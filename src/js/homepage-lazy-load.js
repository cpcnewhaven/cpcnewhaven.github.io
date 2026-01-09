/**
 * Homepage: lazy-load non-critical scripts to improve initial interactivity.
 *
 * Loads:
 * - Highlights (`/src/js/highlights.js`) when #highlights is near viewport
 * - Instagram feed (`/src/js/instagram-feed.js`) when #instagram-feed is near viewport
 *
 * This keeps the hero + nav snappy and defers extra fetch + DOM work until needed.
 */
(function () {
  const loaded = new Set();

  function loadScriptOnce(src) {
    if (!src || loaded.has(src)) return;
    loaded.add(src);

    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.lazy = 'true';
    document.body.appendChild(script);
  }

  function observeAndLoad(elementId, src, rootMargin) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // If the browser doesn't support IntersectionObserver, just load after window load.
    if (!('IntersectionObserver' in window)) {
      window.addEventListener('load', () => loadScriptOnce(src), { once: true });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadScriptOnce(src);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: rootMargin || '800px 0px' }
    );

    obs.observe(el);
  }

  document.addEventListener('DOMContentLoaded', () => {
    observeAndLoad('highlights', './src/js/highlights.js', '1000px 0px');
    observeAndLoad('instagram-feed', './src/js/instagram-feed.js', '1200px 0px');
  });
})();

