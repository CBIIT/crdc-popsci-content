# CRDC Population Sciences content

This folder is a standalone public content repository for the CRDC Population Sciences UI. The deployed browser reads `manifest.json` and the Markdown under `pages/` directly from the configured GitHub branch at runtime.

## Publish this folder as its own GitHub repository

No nested Git repository has been created here. When ready, copy this folder outside the UI repository or initialize it as a separate repository using your organization's normal process, then publish it as a public GitHub repository (for example, `CBIIT/crdc-popsci-content`).

Create protected long-lived branches named `dev`, `qa`, `stage`, and `prod`. Require pull requests, validation checks, and CODEOWNER approval. Promote changes in this order:

```text
topic branch → dev → qa → stage → prod
```

Configure each application tier to read only its matching branch. For `CBIIT/crdc-popsci-content`, the production manifest URL is:

```text
https://raw.githubusercontent.com/CBIIT/crdc-popsci-content/prod/manifest.json
```

Set the UI runtime variables described in the main repository's `README.md` and `conf/inject.template.js`. No GitHub token is used because the repository is public.

## Edit and validate content

Update Markdown or the manifest on a topic branch from `dev`. Change `manifest.json`'s `revision` for every new content change. Keep the same revision as that exact commit set is promoted through QA, stage, and production.

```sh
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for security, accessibility, and promotion requirements.

## Routes

The manifest contains only the active application routes:

- `/about`
- `/access_data`
- `/analyze_data`
- `/support`

`/submit` is intentionally excluded because it is present in the legacy YAML but is not an active About route in the UI.
