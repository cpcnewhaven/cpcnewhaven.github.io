document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  const statusEl = document.getElementById('searchStatus');
  const loadingEl = document.getElementById('searchLoading');
  const clearBtn = document.getElementById('clearSearch');
  const suggestionsEl = document.getElementById('searchSuggestions');
  const categoryChipsEl = document.getElementById('searchCategoryChips');

  if (!input || !resultsEl) return;

  let index = [];
  let indexLoaded = false;
  let activeSuggestionIdx = -1;
  let activeCategory = 'All';

  function escapeHtml(str) {
    return (str || '')
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegExp(str) {
    return (str || '').toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, terms) {
    const safe = escapeHtml(text);
    if (!terms || terms.length === 0) return safe;
    const pattern = terms.map(escapeRegExp).filter(Boolean).join('|');
    if (!pattern) return safe;
    try {
      const re = new RegExp('(' + pattern + ')', 'ig');
      return safe.replace(re, '<span class="search-highlight">$1</span>');
    } catch (_) {
      return safe;
    }
  }

  function norm(s) {
    return (s || '').toString().toLowerCase();
  }

  function tokenize(q) {
    return norm(q)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 8);
  }

  function getCategory(entry) {
    return (entry && entry.category) ? entry.category : 'Other';
  }

  function setActiveCategory(cat) {
    activeCategory = cat || 'All';
    try {
      const url = new URL(window.location.href);
      if (activeCategory && activeCategory !== 'All') url.searchParams.set('cat', activeCategory);
      else url.searchParams.delete('cat');
      window.history.replaceState({}, '', url.toString());
    } catch (_) {}

    if (categoryChipsEl) {
      categoryChipsEl.querySelectorAll('.search-chip').forEach(function (btn) {
        const val = btn.getAttribute('data-category') || 'All';
        const isActive = val === activeCategory;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
        btn.tabIndex = isActive ? 0 : -1;
      });
    }
  }

  function passesCategory(entry) {
    if (!activeCategory || activeCategory === 'All') return true;
    return getCategory(entry) === activeCategory;
  }

  function matchesAllTerms(entry, terms) {
    if (!terms || terms.length === 0) return true;
    const title = norm(entry.title);
    const headings = (entry.headings || []).map(norm).join(' ');
    const text = norm(entry.text);
    return terms.every(function (t) {
      return title.includes(t) || headings.includes(t) || text.includes(t);
    });
  }

  function recencyBoost(entry) {
    // Small boost for fresher pages (if updated date exists).
    const updated = (entry && entry.updated) ? String(entry.updated) : '';
    if (!updated) return 0;
    // YYYY-MM-DD
    const m = updated.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return 0;
    const y = Number(m[1]);
    const nowY = new Date().getFullYear();
    const ageYears = Math.max(0, nowY - y);
    if (ageYears <= 0) return 3;
    if (ageYears === 1) return 2;
    if (ageYears === 2) return 1;
    return 0;
  }

  function scoreEntry(entry, terms) {
    const title = norm(entry.title);
    const headings = (entry.headings || []).map(norm).join(' ');
    const text = norm(entry.text);

    let score = 0;
    for (const term of terms) {
      if (!term) continue;

      // Basic relevance: title > headings > body text.
      if (title.includes(term)) score += 18;
      if (headings.includes(term)) score += 8;

      // Count occurrences (lightweight)
      if (text.includes(term)) {
        const count = (text.match(new RegExp(escapeRegExp(term), 'g')) || []).length;
        score += Math.min(10, count);
      }
    }

    // Small boost for shorter URLs (often "main" pages).
    if (entry.url && entry.url.length < 20) score += 1;

    // Slight boost for key site sections people search for.
    const cat = getCategory(entry);
    if (cat === 'Community') score += 1;
    if (cat === 'Sunday Studies') score += 1;

    score += recencyBoost(entry);
    return score;
  }

  function getSnippet(entry, terms) {
    const text = (entry.text || '').toString().replace(/\s+/g, ' ').trim();
    if (!text) return '';

    const lower = text.toLowerCase();
    let idx = -1;
    for (const term of terms) {
      const i = lower.indexOf(term);
      if (i !== -1) {
        idx = i;
        break;
      }
    }

    const windowSize = 180;
    const start = Math.max(0, (idx === -1 ? 0 : idx - 40));
    const snippet = text.slice(start, start + windowSize);
    const prefix = start > 0 ? '…' : '';
    const suffix = start + windowSize < text.length ? '…' : '';
    return prefix + snippet + suffix;
  }

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg || '';
  }

  function clearResults() {
    resultsEl.innerHTML = '';
  }

  function hideSuggestions() {
    activeSuggestionIdx = -1;
    if (!suggestionsEl) return;
    suggestionsEl.hidden = true;
    suggestionsEl.innerHTML = '';
  }

  function renderSuggestions(scored, terms) {
    if (!suggestionsEl) return;
    if (!scored || scored.length === 0 || !input.value.trim()) {
      hideSuggestions();
      return;
    }

    const top = scored.slice(0, 8);
    suggestionsEl.innerHTML = '';
    top.forEach(function (row, idx) {
      const e = row.entry;
      const item = document.createElement('div');
      item.className = 'search-suggestion';
      item.setAttribute('role', 'option');
      item.setAttribute('data-idx', String(idx));

      const t = document.createElement('div');
      t.className = 'search-suggestion-title';
      t.innerHTML = highlight(e.title || e.url || 'Untitled', terms);

      const meta = document.createElement('div');
      meta.className = 'search-suggestion-meta';
      meta.textContent = (getCategory(e) || 'Other') + ' • ' + (e.url || '');

      item.appendChild(t);
      item.appendChild(meta);

      item.addEventListener('mousedown', function (ev) {
        // Prevent input blur before click on mobile/desktop.
        ev.preventDefault();
      });
      item.addEventListener('click', function () {
        window.location.href = e.url || '#';
      });

      suggestionsEl.appendChild(item);
    });
    suggestionsEl.hidden = false;
  }

  function setActiveSuggestion(idx) {
    activeSuggestionIdx = idx;
    if (!suggestionsEl) return;
    const items = Array.from(suggestionsEl.querySelectorAll('.search-suggestion'));
    items.forEach(function (el, i) {
      el.classList.toggle('active', i === idx);
    });
  }

  function renderResults(query) {
    const terms = tokenize(query);
    clearResults();

    if (!indexLoaded) {
      setStatus('Loading search index…');
      return;
    }

    if (!query.trim()) {
      setStatus('Type to search ' + index.length + ' pages. Tip: press ⌘K / Ctrl+K to focus search.');
      hideSuggestions();
      return;
    }

    const scored = index
      .filter(function (entry) {
        return passesCategory(entry) && matchesAllTerms(entry, terms);
      })
      .map(function (entry) {
        return { entry: entry, score: scoreEntry(entry, terms) };
      })
      .filter(function (row) {
        return row.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, 50);

    renderSuggestions(scored, terms);
    setStatus('Showing ' + scored.length + ' result' + (scored.length === 1 ? '' : 's') + '.');

    if (scored.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'search-loading';
      empty.textContent = 'No matches. Try fewer words.';
      resultsEl.appendChild(empty);
      return;
    }

    scored.forEach(function (row) {
      const e = row.entry;
      const a = document.createElement('a');
      a.className = 'search-result';
      a.href = e.url || '#';
      a.setAttribute('role', 'listitem');

      const title = document.createElement('div');
      title.className = 'search-result-title';
      title.innerHTML = highlight(e.title || e.url || 'Untitled', terms);

      const url = document.createElement('div');
      url.className = 'search-result-url';
      const cat = getCategory(e);
      url.textContent = (cat ? cat + ' • ' : '') + (e.url || '');

      const snippet = document.createElement('p');
      snippet.className = 'search-result-snippet';
      const desc = (e.description || '').toString().trim();
      snippet.innerHTML = highlight(desc ? desc : getSnippet(e, terms), terms);

      a.appendChild(title);
      a.appendChild(url);
      a.appendChild(snippet);
      resultsEl.appendChild(a);
    });
  }

  let debounceTimer = null;
  function onQueryChange() {
    const q = input.value || '';
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(function () {
      // Keep query shareable
      try {
        const url = new URL(window.location.href);
        if (q.trim()) url.searchParams.set('q', q);
        else url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());
      } catch (_) {}
      renderResults(q);
    }, 80);
  }

  input.addEventListener('input', onQueryChange);
  input.addEventListener('search', onQueryChange);
  input.addEventListener('focus', function () {
    // Re-render suggestions if there is a query.
    renderResults(input.value || '');
  });
  input.addEventListener('blur', function () {
    // Delay to allow suggestion click.
    window.setTimeout(function () {
      hideSuggestions();
    }, 120);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      input.value = '';
      input.focus();
      hideSuggestions();
      renderResults('');
    });
  }

  // Keyboard UX people expect: Cmd/Ctrl+K focuses the search box, Esc clears.
  document.addEventListener('keydown', function (e) {
    const key = (e.key || '').toLowerCase();
    const isK = key === 'k';
    const isEsc = key === 'escape';
    if (isK && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (isEsc) {
      if (document.activeElement === input) {
        input.value = '';
        hideSuggestions();
        renderResults('');
      }
    }
  });

  // Keyboard navigation for suggestions (Down/Up/Enter)
  input.addEventListener('keydown', function (e) {
    if (!suggestionsEl || suggestionsEl.hidden) return;
    const items = Array.from(suggestionsEl.querySelectorAll('.search-suggestion'));
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(items.length - 1, activeSuggestionIdx + 1);
      setActiveSuggestion(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(0, activeSuggestionIdx - 1);
      setActiveSuggestion(prev);
    } else if (e.key === 'Enter') {
      if (activeSuggestionIdx >= 0 && activeSuggestionIdx < items.length) {
        e.preventDefault();
        const idx = activeSuggestionIdx;
        const row = items[idx];
        row.click();
      }
    }
  });

  function buildCategoryChips() {
    if (!categoryChipsEl) return;
    const counts = {};
    index.forEach(function (e) {
      const c = getCategory(e);
      counts[c] = (counts[c] || 0) + 1;
    });

    const preferredOrder = [
      'All',
      'Community',
      'Events',
      'Podcasts',
      'Sunday Studies',
      'Resources',
      'Media',
      'Live',
      'Give',
      'About',
      'Other',
    ];

    categoryChipsEl.innerHTML = '';
    preferredOrder.forEach(function (cat) {
      if (cat !== 'All' && !counts[cat]) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-chip' + (cat === activeCategory ? ' active' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', cat === activeCategory ? 'true' : 'false');
      btn.setAttribute('data-category', cat);
      btn.tabIndex = cat === activeCategory ? 0 : -1;
      const label = cat === 'All' ? 'All' : cat;
      btn.textContent = cat === 'All' ? 'All' : label + ' (' + counts[cat] + ')';
      btn.addEventListener('click', function () {
        setActiveCategory(cat);
        renderResults(input.value || '');
      });
      categoryChipsEl.appendChild(btn);
    });
  }

  // Load index
  if (loadingEl) loadingEl.hidden = false;
  fetch('./data/search-index.json')
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      index = Array.isArray(data) ? data : [];
      indexLoaded = true;
      if (loadingEl) loadingEl.hidden = true;
      buildCategoryChips();
      renderResults(input.value || '');
    })
    .catch(function (err) {
      indexLoaded = true;
      if (loadingEl) loadingEl.hidden = true;
      setStatus('Search index failed to load.');
      // eslint-disable-next-line no-console
      console.error('Search index failed to load:', err);
    });

  // Initialize from URL query param
  try {
    const url = new URL(window.location.href);
    const q = (url.searchParams.get('q') || '').toString();
    const cat = (url.searchParams.get('cat') || '').toString();
    if (cat) activeCategory = cat;
    if (q) {
      input.value = q;
      // Let the index load; render will run after fetch.
    }
  } catch (_) {}
});

