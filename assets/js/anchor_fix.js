// Anchor offset helper: keep section headings visible below the sticky header.
// Works for whitepaper pages (RSS/RSP, EN/CN) and is safe on other pages.

(function () {
  function findHeaderEl() {
    return (
      document.querySelector('.header') ||
      document.querySelector('.topbar') ||
      document.querySelector('.site-header') ||
      document.querySelector('header') ||
      null
    );
  }

  function measureHeaderHeight() {
    var el = findHeaderEl();
    if (!el) return 0;
    var rect = el.getBoundingClientRect();
    // If the header is not sticky/fixed, it doesn't occlude anchors.
    var pos = window.getComputedStyle(el).position;
    var isSticky = pos === 'sticky' || pos === 'fixed';
    return isSticky ? Math.round(rect.height) : 0;
  }

  function setAnchorVars() {
    var h = measureHeaderHeight();
    // A small gap so the heading isn't glued to the header.
    // Keep it tight to avoid showing leftover previous text in long paragraphs.
    // Slightly larger gap to prevent any preceding paragraph fragment from
    // appearing above the heading after anchor jumps.
    var gap = 10;
    var offset = h ? h + gap : 72;
    var root = document.documentElement;
    root.style.setProperty('--header-h', h + 'px');
    root.style.setProperty('--anchor-offset', offset + 'px');
    return offset;
  }

  function getHashTarget() {
    if (!location.hash) return null;
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return null;
    return document.getElementById(id) || document.querySelector('[name="' + CSS.escape(id) + '"]');
  }

  function scrollToHashTarget(smooth) {
    var el = getHashTarget();
    if (!el) return;

    var offset = setAnchorVars();
    var top = el.getBoundingClientRect().top + window.pageYOffset - offset;

    // Avoid tiny oscillations.
    if (Math.abs(window.pageYOffset - top) < 2) return;

    window.scrollTo({ top: top, behavior: smooth ? 'smooth' : 'auto' });
  }

  // Expose a tiny API for page-specific scripts (e.g. TOC smooth-scroll).
  window.__anchorFix = {
    setAnchorVars: setAnchorVars,
    scrollToHashTarget: scrollToHashTarget,
    getHeaderHeight: getHeaderHeight,
  };

  // Initial setup.
  setAnchorVars();

  window.addEventListener('load', function () {
    setAnchorVars();
    // The browser may auto-scroll to the hash before CSS/JS is ready.
    // Re-apply once immediately and once after layout settles.
    if (location.hash) {
      setTimeout(scrollToHashTarget, 0);
      setTimeout(scrollToHashTarget, 80);
    }
  });

  window.addEventListener('hashchange', function () {
    setTimeout(scrollToHashTarget, 0);
  });

  window.addEventListener('resize', function () {
    setAnchorVars();
    // Keep current anchor aligned if the header height changes.
    if (location.hash) setTimeout(scrollToHashTarget, 0);
  });
})();
