# Kiwi Apps

[简体中文](README.zh-CN.md)

A community directory of apps built for [Kiwi](https://github.com/MAPS-research/kiwi). App authors maintain their own source code, hosting, releases, documentation, and support. This repository holds public catalog metadata and contribution tools.

Listings are community submissions, not certifications. Automated checks validate metadata structure; they do not run apps or verify security, privacy, availability, or compatibility. Compatibility descriptions are statements from app authors.

## App directory

| App | Description | Category | Source | Demo | Setup |
| --- | --- | --- | --- | --- | --- |
| [Kiwi Podcast](catalog/kiwi-podcast.yaml) | Create and listen to class and personalized podcasts from Kiwi course materials, with synchronized transcripts and Ask Kiwi context sharing. | utilities | [Source](https://github.com/ym3116/kiwi-podcast) | [Demo](https://podcast.apps.kiwiai.org/) | [Setup](https://github.com/ym3116/kiwi-podcast#recommended-dev-setup) |

Categories: `exercises`, `simulations`, `collaboration`, `analytics`, and `utilities`.

## Find and use an app

Each listing links to its source and setup documentation; a demo is optional. Read the app's documentation, license, data practices, and author-stated compatibility before deploying it. Send app bugs and feature requests to the app's own repository; report incorrect directory information in this repository.

A listing does not install an app or authorize it in a Kiwi deployment. Administrator whitelisting, registration, and class enablement remain separate steps, described in the [Kiwi app developer guide](https://github.com/MAPS-research/kiwi/blob/development/kiwi-app-developer-guide-example/KIWI_APP_DEVELOPER_GUIDE.md). The [Kiwi app SDK](https://github.com/MAPS-research/kiwi/tree/development/kiwi-app-sdk) provides the framework's integration tools.

## Add or maintain a listing

1. Copy [the fictional example](examples/study-coach.yaml) to `catalog/<slug>.yaml` and replace all example values with your app's public information. A `.yml` extension is also accepted.
2. Add a directory row to both READMEs, linking the app name to its catalog file, Source to its repository, Demo to its demo if present (otherwise `—`), and Setup to its documentation. Keep category identifiers unchanged in both languages.
3. Run the checks below and open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for field definitions and correction, removal, and ownership-transfer rules.

One YAML file represents one app. The YAML is the source of truth; README tables are maintained by contributors in the same pull request. There is no generated index, web frontend, automatic sync, or runtime installer. Authors may use the `kiwi-app` topic on their source repository to help discovery.

The [catalog schema](schemas/catalog.schema.json) defines directory metadata only. It is neither Kiwi's registration payload nor a standardized app manifest. An optional `manifestPath` points to an existing metadata file in the author's source repository; it does not require a new manifest format or SDK feature.

## Check a contribution locally

Use Node.js 24 (recommended); Node.js 20.14 or later is supported.

```sh
npm ci --ignore-scripts
npm run validate
npm test
```

`npm run validate` checks the actual catalog and fictional example. `npm test` checks validator behavior. `npm run check` runs both and is also used in CI. Checks read catalog data without downloading or executing submitted apps.

## Community and licensing

Follow the [code of conduct](CODE_OF_CONDUCT.md). This repository's own material is [MIT licensed](LICENSE); each listed app keeps its own license. A catalog entry does not relicense the app.
