# Contributing to Kiwi Apps

Submit an app you maintain or are authorized to represent. Keep its source, releases, hosting, documentation, and support in its own repository. A listing request issue is also welcome if you need help preparing a pull request.

This directory does not certify apps. Review checks whether a submission is relevant to Kiwi, understandable, complete, and consistent with its public source and documentation. Passing CI only means the catalog data passed structural checks.

## Submit a listing

1. Copy `examples/study-coach.yaml` to `catalog/<slug>.yaml` (or `.yml`). The example is fictional: replace its values and remove optional fields you do not use.
2. Supply working, public HTTPS links to the app's source, setup documentation, and maintainer. Give an honest author statement about compatibility, including the tested Kiwi version or revision when known and any limitations.
3. Add the matching row to both [README.md](README.md) and [README.zh-CN.md](README.zh-CN.md), ordered alphabetically by app name. Link the app name to its catalog file, Source to `repository`, Demo to `demo` or use `—`, and Setup to `documentation`. Translate the description, preserve the app's name and category identifier, and use the same links in both tables. Remove the empty-directory notice when adding the first real app.
4. Run `npm ci --ignore-scripts` and `npm run check` with Node.js 24 (recommended; 20.14 or later supported).
5. Open a pull request with a brief description of the app, your relationship to it, and any setup or compatibility limitations.

The YAML is the source of truth. Keep both README rows synchronized in every listing change; there is no table generator or automatic sync. Do not copy app source code or release bundles into this repository.

## Catalog fields

The exact constraints are in [schemas/catalog.schema.json](schemas/catalog.schema.json). Unknown fields are rejected. One file represents one app, and the filename stem must equal its unique, stable slug.

| Field | Required | Meaning |
| --- | --- | --- |
| `schemaVersion` | Yes | Integer `1`. |
| `slug` | Yes | Lowercase letters and digits separated by single hyphens; at most 64 characters, with no leading or trailing hyphen. |
| `name` | Yes | Public app name. |
| `description` | Yes | Short factual explanation of what the app does. |
| `category` | Yes | One of `exercises`, `simulations`, `collaboration`, `analytics`, `utilities`. |
| `maintainer` | Yes | Object containing `name` and `url` for the responsible person or team. |
| `repository` | Yes | Public HTTPS URL of the app's source repository. |
| `documentation` | Yes | Public HTTPS URL of the app's setup and usage documentation. |
| `license` | Yes | App source license; an SPDX identifier is recommended. This is separate from this directory's MIT license. |
| `compatibility` | Yes | Author's statement of Kiwi compatibility and known limits; not a directory verification or guarantee. |
| `demo` | No | Public HTTPS demo URL. Omit if none is available. |
| `manifestPath` | No | Relative path to an existing metadata file in the app's source repository. Omit if not applicable. |

All URL fields, including `maintainer.url`, must use HTTPS and contain no embedded credentials. Use public destinations without tokens. Never include registration secrets, API keys, session cookies, class IDs, or private deployment details. `manifestPath` is a source-repository-relative path, not a local filesystem path or URL.

Use `npm run validate` for the full structural checks. It registers the schema's custom `https-url` format with Node's URL parser, including host and port validation. Other schema consumers must register that format too; these checks do not contact the destination.

This schema is for catalog metadata. It does not define Kiwi's registration payload or a standardized app manifest. Listing, administrator whitelisting, registration, and class enablement are separate processes. Follow the [Kiwi app developer guide](https://github.com/MAPS-research/kiwi/blob/development/kiwi-app-developer-guide-example/KIWI_APP_DEVELOPER_GUIDE.md) for integration and deployment.

## Correct, remove, or transfer a listing

- **Correct:** Anyone may report an inaccurate description, broken link, or outdated statement through an app correction issue. A pull request should update the YAML and both README rows with the public evidence for the change.
- **Remove:** Request removal with a correction issue or pull request explaining why. Maintainers may remove entries at an author's request or when an app is unavailable, abandoned, misleading, or outside the directory's scope. Delete its YAML and both README rows; restore the empty-directory notices if no apps remain. Removed entries remain in Git history.
- **Transfer:** Update `maintainer`, repository/documentation links, and both README rows as needed. Provide public confirmation from the current maintainer or explain the basis for the transfer so directory maintainers can resolve it. Preserve the slug when the app's identity is unchanged.

Directory maintainers manually check link reachability, the submitter's authority to represent the app, and metadata consistency before merging. The validator makes no network requests and cannot establish ownership. This manual check is not an app security audit or compatibility test. Do not add star rankings, safety badges, or unsubstantiated endorsement claims.

## Support and conduct

Report app behavior and deployment problems upstream in the app's repository. Use this repository's issues for directory information and tooling. Follow the [code of conduct](CODE_OF_CONDUCT.md); do not post sensitive reports, credentials, or personal information in public issues.

Contributions to this repository are provided under its [MIT license](LICENSE). App source remains under the license declared by its own authors.
