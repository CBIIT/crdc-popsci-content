# Content contribution and security rules

All branches and pull-request history in this repository are public. Never add secrets, credentials, sensitive drafts, personal data, or internal-only URLs.

## Promotion flow

1. Create a topic branch from `dev` and open a pull request into `dev`.
2. After validation in the development application, open a pull request from `dev` to `qa`.
3. After QA validation, open a pull request from `qa` to `stage`.
4. After stage validation, open a pull request from `stage` to `prod`.

Direct pushes and skipped tiers are not permitted. Preserve the same `revision` while promoting an identical change. Every new content or manifest change begins with a new unique `revision`.

## Authoring rules

- Use standard Markdown and GitHub-flavored tables only.
- Do not use raw HTML, MDX, JSX, scripts, iframes, forms, embedded styles, or executable diagrams.
- Body Markdown starts at heading level 2 because the application renders the page title as level 1.
- Use meaningful link text. Links must use `https:` or a simple `mailto:` address.
- Images must use `https://raw.githubusercontent.com/CBIIT/...` and require accurate alternative text in `manifest.json`.
- Keep page paths under `pages/`. Do not use absolute paths, `..`, encoded traversal, query strings, or fragments in manifest file paths.
- Run `npm test` before opening or promoting a pull request.

The legacy `/submit` YAML entry is intentionally excluded because `/submit` is not an active route in `crdc-popsci-ui`.
