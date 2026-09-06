'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ROUTES = new Set(['/about', '/access_data', '/analyze_data', '/support']);
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_REVISION = /^\d{4}-\d{2}-\d{2}\.[1-9]\d*$/;
const RAW_IMAGE = /^https:\/\/raw\.githubusercontent\.com\/CBIIT\/(?:crdc-popsci-content|datacommons-assets)\/[A-Za-z0-9._/-]+$/;
const RAW_HTML = /<\/?[A-Za-z!][^>]*>/;
const UNSAFE_URL = /(?:javascript|data|blob|file|vbscript)\s*:/i;

function fail(message) {
  throw new Error(message);
}

function safeRelative(file, prefix) {
  if (typeof file !== 'string' || !file.startsWith(prefix) || file.includes('\\')) return false;
  if (file.includes('?') || file.includes('#') || /[\u0000-\u001f\u007f]/.test(file)) return false;
  const normalized = path.posix.normalize(file);
  return normalized === file && !normalized.split('/').includes('..');
}

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
if (manifest.schemaVersion !== 1) fail('schemaVersion must be 1');
if (!SAFE_REVISION.test(manifest.revision || '')) fail('revision must use YYYY-MM-DD.N');
if (!Array.isArray(manifest.pages) || manifest.pages.length !== ROUTES.size) fail('manifest must contain exactly four pages');

const routes = new Set();
const slugs = new Set();
manifest.pages.forEach((page) => {
  if (!page || typeof page !== 'object') fail('each page must be an object');
  if (!ROUTES.has(page.route) || routes.has(page.route)) fail(`invalid or duplicate route: ${page.route}`);
  if (!SAFE_SLUG.test(page.slug || '') || slugs.has(page.slug)) fail(`invalid or duplicate slug: ${page.slug}`);
  if (typeof page.title !== 'string' || !page.title.trim() || page.title.length > 160) fail(`invalid title for ${page.route}`);
  if (!safeRelative(page.markdown, 'pages/') || !page.markdown.endsWith('.md')) fail(`invalid Markdown path for ${page.route}`);

  const absoluteMarkdown = path.resolve(ROOT, page.markdown);
  if (!absoluteMarkdown.startsWith(`${ROOT}${path.sep}`) || !fs.existsSync(absoluteMarkdown)) fail(`missing Markdown for ${page.route}`);
  const markdown = fs.readFileSync(absoluteMarkdown, 'utf8');
  if (Buffer.byteLength(markdown, 'utf8') > 100 * 1024) fail(`Markdown too large for ${page.route}`);
  if (RAW_HTML.test(markdown)) fail(`raw HTML is not allowed in ${page.markdown}`);
  if (UNSAFE_URL.test(markdown)) fail(`unsafe URL scheme in ${page.markdown}`);
  if (/^#\s/m.test(markdown)) fail(`h1 is reserved for the application in ${page.markdown}`);

  if (!page.primaryImage || !RAW_IMAGE.test(page.primaryImage.src || '')) fail(`invalid primary image for ${page.route}`);
  if (typeof page.primaryImage.alt !== 'string' || !page.primaryImage.alt.trim()) fail(`missing image alt text for ${page.route}`);
  if (!['left', 'right'].includes(page.primaryImage.position)) fail(`invalid image position for ${page.route}`);
  routes.add(page.route);
  slugs.add(page.slug);
});

ROUTES.forEach((route) => {
  if (!routes.has(route)) fail(`missing route: ${route}`);
});

console.log(`Validated ${manifest.pages.length} pages at revision ${manifest.revision}.`);
