/**
 * Update `data/instagram-feed.json` with the latest posts from Instagram.
 *
 * Why this exists:
 * - GitHub Pages is static, and Instagram API tokens should NOT live in browser JS.
 * - We fetch with a token in CI (GitHub Actions) and commit the JSON to the repo.
 *
 * Setup (GitHub):
 * - Add repo secret: INSTAGRAM_ACCESS_TOKEN
 *
 * Run locally:
 *   INSTAGRAM_ACCESS_TOKEN="..." node scripts/update-instagram-feed.js
 */

const fs = require('fs');
const path = require('path');

const PROFILE_URL = 'https://www.instagram.com/cpcnewhaven/';
const OUT_PATH = path.join(__dirname, '..', 'data', 'instagram-feed.json');

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var ${name}. Set it and re-run.`);
  }
  return v;
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      // Helps avoid some aggressive edge caching in CI runs
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} fetching ${url}\n${body.slice(0, 500)}`);
  }
  return res.json();
}

function toPost(item) {
  // Instagram Basic Display / Graph-like fields we request:
  // id, caption, media_type, media_url, permalink, timestamp, thumbnail_url
  const imageUrl =
    item.media_type === 'VIDEO'
      ? item.thumbnail_url || item.media_url
      : item.media_url || item.thumbnail_url;

  return {
    id: item.id,
    imageUrl,
    caption: item.caption || '',
    link: item.permalink || PROFILE_URL,
    timestamp: item.timestamp || '',
    mediaType: item.media_type || '',
  };
}

async function main() {
  const accessToken = requireEnv('INSTAGRAM_ACCESS_TOKEN');

  // Instagram Basic Display API-style endpoint (works with user tokens and `me`)
  // If this ever needs to move to the Instagram Graph API (business accounts),
  // we can adapt the URL + token, but the output JSON stays the same.
  const fields = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'permalink',
    'timestamp',
    'thumbnail_url',
  ].join(',');

  const apiUrl = `https://graph.instagram.com/me/media?fields=${encodeURIComponent(
    fields
  )}&access_token=${encodeURIComponent(accessToken)}`;

  const json = await fetchJson(apiUrl);

  const items = Array.isArray(json.data) ? json.data : [];
  const posts = items.map(toPost).filter((p) => p.imageUrl);

  // Sort newest first and keep the site fast with a small payload.
  posts.sort((a, b) => (Date.parse(b.timestamp) || 0) - (Date.parse(a.timestamp) || 0));
  const trimmed = posts.slice(0, 12);

  const out = {
    profileUrl: PROFILE_URL,
    generatedAt: new Date().toISOString(),
    posts: trimmed,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8');
  console.log(`Wrote ${trimmed.length} post(s) to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

