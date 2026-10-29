import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const validator = fileURLToPath(new URL('../scripts/validate-catalog.mjs', import.meta.url));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'kiwi-catalog-test-'));
  const catalog = join(root, 'catalog');
  mkdirSync(catalog);
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return { root, catalog };
}

function entry(overrides = {}) {
  return {
    schemaVersion: 1,
    slug: 'study-coach',
    name: 'Study Coach',
    description: 'An example study planner.',
    category: 'exercises',
    maintainer: { name: 'Example contributor', url: 'https://github.com/example' },
    repository: 'https://github.com/example/study-coach',
    documentation: 'https://github.com/example/study-coach#setup',
    license: 'MIT',
    compatibility: 'See the author documentation for supported Kiwi versions.',
    ...overrides,
  };
}

function writeEntry(catalog, data = entry(), filename = 'study-coach.yaml') {
  writeFileSync(join(catalog, filename), JSON.stringify(data));
}

function run(catalog, example) {
  const result = spawnSync(process.execPath, [validator, catalog, ...(example ? [example] : [])], {
    encoding: 'utf8',
    timeout: 10_000,
  });
  assert.ifError(result.error);
  return { status: result.status, output: result.stdout + result.stderr };
}

test('an empty community catalog is valid and reports zero entries', (t) => {
  const { catalog } = fixture(t);
  writeFileSync(join(catalog, '.gitkeep'), '');
  const result = run(catalog);
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /0 app entries/);
});

test('a YAML app listing with optional demo and manifest path is accepted', (t) => {
  const { catalog } = fixture(t);
  writeFileSync(join(catalog, 'study-coach.yml'), `schemaVersion: 1
slug: study-coach
name: Study Coach
description: >-
  An example study planner.
category: exercises
maintainer:
  name: Example contributor
  url: https://github.com/example
repository: https://github.com/example/study-coach
documentation: https://github.com/example/study-coach#setup
license: MIT
compatibility: Author-declared support for the Kiwi bridge.
demo: https://example.org/demo
manifestPath: apps/study-coach/kiwi-app.yaml
`);
  const result = run(catalog);
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /1 app entries/);
});

test('invalid metadata is rejected with the entry filename and offending field', async (t) => {
  const cases = [
    ['missing maintainer', { maintainer: undefined }, /maintainer/],
    ['blank description', { description: '   ' }, /description/],
    ['unrecognized verification claim', { verified: true }, /verified/],
    ['unsupported schema version', { schemaVersion: 2 }, /schemaVersion/],
    ['unencrypted source URL', { repository: 'http://example.org/app' }, /repository/],
    ['credentials in source URL', { repository: 'https://user:secret@example.org/app' }, /repository/],
    ['missing repository hostname', { repository: 'https://:443/path' }, /repository/],
    ['invalid documentation port', { documentation: 'https://example.org:abc/path' }, /documentation/],
    ['out-of-range demo port', { demo: 'https://example.org:70000/path' }, /demo/],
    ['invalid maintainer hostname', { maintainer: { name: 'Example', url: 'https://:443/profile' } }, /maintainer/],
    ['unknown category', { category: 'unknown' }, /category/],
    ['non-text compatibility', { compatibility: true }, /compatibility/],
    ['traversing manifest path', { manifestPath: '../app.yaml' }, /manifestPath/],
    ['absolute manifest path', { manifestPath: '/app.yaml' }, /manifestPath/],
  ];
  for (const [name, overrides, diagnostic] of cases) {
    await t.test(name, (st) => {
      const { catalog } = fixture(st);
      writeEntry(catalog, entry(overrides));
      const result = run(catalog);
      assert.equal(result.status, 1, result.output);
      assert.match(result.output, /study-coach\.yaml/);
      assert.match(result.output, diagnostic);
    });
  }
});

test('malformed YAML and duplicate mapping keys cannot silently change a listing', async (t) => {
  for (const [name, content] of [
    ['malformed YAML', 'name: [unfinished'],
    ['duplicate keys', 'slug: study-coach\nslug: other-app\n'],
    ['multiple documents', 'slug: study-coach\n---\nslug: other-app\n'],
  ]) {
    await t.test(name, (st) => {
      const { catalog } = fixture(st);
      writeFileSync(join(catalog, 'study-coach.yaml'), content);
      const result = run(catalog);
      assert.equal(result.status, 1, result.output);
      assert.match(result.output, /study-coach\.yaml/);
    });
  }
});

test('a filename that differs from the app slug is rejected', (t) => {
  const { catalog } = fixture(t);
  writeEntry(catalog, entry(), 'another-app.yaml');
  const result = run(catalog);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /filename.*slug/i);
});

test('the same slug cannot be listed through both YAML extensions', (t) => {
  const { catalog } = fixture(t);
  writeEntry(catalog);
  writeEntry(catalog, entry(), 'study-coach.yml');
  const result = run(catalog);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /duplicate slug/i);
});

test('unsupported files and nested directories cannot be silently skipped', async (t) => {
  for (const kind of ['json', 'directory']) {
    await t.test(kind, (st) => {
      const { catalog } = fixture(st);
      if (kind === 'json') writeEntry(catalog, entry(), 'study-coach.json');
      else mkdirSync(join(catalog, 'study-coach'));
      const result = run(catalog);
      assert.equal(result.status, 1, result.output);
      assert.match(result.output, /YAML|\.yaml/);
    });
  }
});

test('symlinks cannot make validation read listings outside the catalog', (t) => {
  const { root, catalog } = fixture(t);
  const outside = join(root, 'outside.yaml');
  writeFileSync(outside, JSON.stringify(entry()));
  symlinkSync(outside, join(catalog, 'study-coach.yaml'));
  const result = run(catalog);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /symlink|regular file/i);
});

test('the example is validated separately and never counted as a real app', (t) => {
  const { root, catalog } = fixture(t);
  const example = join(root, 'study-coach.yaml');
  writeFileSync(example, JSON.stringify(entry()));
  const valid = run(catalog, example);
  assert.equal(valid.status, 0, valid.output);
  assert.match(valid.output, /0 app entries/);
  assert.match(valid.output, /example/i);
  writeFileSync(example, '{}');
  const invalid = run(catalog, example);
  assert.equal(invalid.status, 1, invalid.output);
  assert.match(invalid.output, /example/i);
});

test('a missing catalog fails instead of masquerading as an empty directory', (t) => {
  const { root } = fixture(t);
  const result = run(join(root, 'missing'));
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /missing/);
});
