/* =========================
   FACTOIDS SCROLLER JS
   Add once (e.g., bottom of layout/page).
========================= */
document.addEventListener('DOMContentLoaded', function () {
  const scroller = document.getElementById('factoidsScroller');
  if (!scroller) return;

  const leftBtn = document.querySelector('.scroll-btn-left');
  const rightBtn = document.querySelector('.scroll-btn-right');

  // Keep this in sync with CSS: .factoids-row { gap: 1rem; }
  const gapPx = 16;

  // Drag behavior
  const DRAG_THRESHOLD = 6;      // px
  const SNAP_DEBOUNCE_MS = 120;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragged = false;
  let snapTimeout = null;

  function behavior() {
    return prefersReducedMotion.matches ? 'auto' : 'smooth';
  }

  function children() {
    return Array.from(scroller.querySelectorAll(':scope > [class*="col-"]'));
  }

  function atStart() {
    return scroller.scrollLeft <= 2;
  }

  function atEnd() {
    return Math.ceil(scroller.scrollLeft + scroller.clientWidth) >= scroller.scrollWidth - 2;
  }

  function updateButtons() {
    if (!leftBtn || !rightBtn) return;
    leftBtn.disabled = atStart();
    rightBtn.disabled = atEnd();
  }

  // Compute width of the visible "lane" between arrows and size each card to fit it
  function computeCardWidth() {
    const wrapper = scroller.closest('.factoids-row-wrapper');
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();

    const leftRect = leftBtn ? leftBtn.getBoundingClientRect() : null;
    const rightRect = rightBtn ? rightBtn.getBoundingClientRect() : null;

    const computed = getComputedStyle(wrapper);
    const padLeft = parseFloat(computed.paddingLeft) || 0;
    const padRight = parseFloat(computed.paddingRight) || 0;

    // Measure how much space the arrows take up on each side.
    // If buttons aren't visible yet, fall back to wrapper padding.
    const leftOccupied = leftRect
      ? Math.max(0, (leftRect.right - wrapperRect.left))
      : padLeft;

    const rightOccupied = rightRect
      ? Math.max(0, (wrapperRect.right - rightRect.left))
      : padRight;

    const laneWidth = Math.max(0, Math.round(wrapperRect.width - leftOccupied - rightOccupied));

    // Make the card fill the lane nicely, leaving one "gap" so it doesn't collide visually.
    const cardWidth = Math.max(240, laneWidth - gapPx);

    scroller.style.setProperty('--card-width', cardWidth + 'px');
  }

  function nearestCardIndex() {
    const els = children();
    if (!els.length) return 0;

    const left = scroller.scrollLeft;
    let nearestIdx = 0;
    let nearestDist = Infinity;

    els.forEach((el, i) => {
      const dist = Math.abs(el.offsetLeft - left);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    });

    return nearestIdx;
  }

  function snapToIndex(idx) {
    const els = children();
    if (!els[idx]) return;
    scroller.scrollTo({ left: els[idx].offsetLeft, behavior: behavior() });
  }

  function scheduleSnapToNearest() {
    if (snapTimeout) clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      snapToIndex(nearestCardIndex());
      updateButtons();
      snapTimeout = null;
    }, SNAP_DEBOUNCE_MS);
  }

  function scrollByCard(delta) {
    const els = children();
    if (!els.length) return;

    const cur = nearestCardIndex();
    const target = Math.max(0, Math.min(els.length - 1, cur + delta));
    snapToIndex(target);
  }

  // Button actions
  if (leftBtn) leftBtn.addEventListener('click', () => scrollByCard(-1));
  if (rightBtn) rightBtn.addEventListener('click', () => scrollByCard(1));

  // Scroller events
  scroller.addEventListener('scroll', () => {
    updateButtons();
    scheduleSnapToNearest();
  });

  // Keyboard support (does not hijack Tab)
  scroller.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByCard(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByCard(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      snapToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      const els = children();
      snapToIndex(Math.max(0, els.length - 1));
    }
  });

  // Pointer drag-to-scroll enhancement without breaking clicks
  scroller.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isPointerDown = true;
    dragged = false;
    startX = e.clientX;
    startScrollLeft = scroller.scrollLeft;

    scroller.setPointerCapture(e.pointerId);

    if (snapTimeout) {
      clearTimeout(snapTimeout);
      snapTimeout = null;
    }
  });

  scroller.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) dragged = true;
    scroller.scrollLeft = startScrollLeft - dx;
  });

  function endDrag() {
    if (!isPointerDown) return;
    isPointerDown = false;
    scheduleSnapToNearest();
  }

  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
  scroller.addEventListener('pointerleave', endDrag);

  // Prevent accidental click activation after a drag
  scroller.addEventListener('click', (e) => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
      dragged = false;
    }
  }, true);

  // Recompute sizing on load and resize
  function onResize() {
    computeCardWidth();
    scheduleSnapToNearest();
  }
  window.addEventListener('resize', onResize);

  // Init
  computeCardWidth();
  updateButtons();
  scheduleSnapToNearest();
});