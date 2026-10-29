import { lstat, readFile, readdir } from 'node:fs/promises';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { parseDocument } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 2) throw new Error('Usage: node scripts/validate-catalog.mjs [catalog-directory] [example-file]');
  const catalog = resolve(args[0] ?? join(root, 'catalog'));
  const example = args[1] ? resolve(args[1]) : args.length === 0 ? join(root, 'examples/study-coach.yaml') : undefined;
  const schema = JSON.parse(await readFile(join(root, 'schemas/catalog.schema.json'), 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: true });
  addFormats(ajv, ['uri']);
  ajv.addFormat('https-url', (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
    } catch {
      return false;
    }
  });
  const validate = ajv.compile(schema);
  const errors = [];
  const slugs = new Map();

  async function readEntry(path, label) {
    try {
      const info = await lstat(path);
      if (!info.isFile()) throw new Error('must be a regular file, not a symlink or directory');
      const document = parseDocument(await readFile(path, 'utf8'), { uniqueKeys: true });
      const diagnostics = [...document.errors, ...document.warnings];
      if (diagnostics.length) throw new Error(diagnostics.map((item) => item.message).join('; '));
      const data = document.toJS({ maxAliasCount: 0 });
      if (!validate(data)) {
        for (const issue of validate.errors) {
          const field = issue.params.additionalProperty ?? issue.params.missingProperty;
          errors.push(`${label}: ${issue.instancePath || '/'}${field ? ` (${field})` : ''} ${issue.message}`);
        }
        return undefined;
      }
      return data;
    } catch (error) {
      errors.push(`${label}: ${error.message}`);
      return undefined;
    }
  }

  for (const name of (await readdir(catalog)).sort()) {
    if (name === '.gitkeep') continue;
    if (!/\.ya?ml$/.test(name)) {
      errors.push(`${name}: catalog entries must be .yaml or .yml files directly inside catalog/`);
      continue;
    }
    const data = await readEntry(join(catalog, name), name);
    if (!data) continue;
    if (basename(name, extname(name)) !== data.slug) errors.push(`${name}: filename must match slug "${data.slug}"`);
    if (slugs.has(data.slug)) errors.push(`${name}: duplicate slug "${data.slug}" also appears in ${slugs.get(data.slug)}`);
    else slugs.set(data.slug, name);
  }

  if (example) await readEntry(example, `example ${basename(example)}`);
  if (errors.length) {
    console.error(`Catalog validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Validated ${slugs.size} app entries${example ? ' and the separate submission example' : ''}.`);
  console.log('Metadata checks only; no apps were fetched, installed, executed, or verified.');
}

main().catch((error) => {
  console.error(`Catalog validation failed: ${error.message}`);
  process.exitCode = 1;
});
