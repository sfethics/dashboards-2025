(() => {
  const TABLE_SEL = '#committee_list_table';
  const OFFCANVAS_SEL = '#committeeList';
  const TOP_SEARCH_SEL = '#committeeSearch';
  const CLEAR_BTN_SEL = '#committeeSearchClear';
  const COUNT_SEL = '#committeeCount';

  let dt; // will hold the DataTables instance

  function initDataTable() {
    // Guard: don’t initialize twice
    if (dt) return dt;

    const tableEl = document.querySelector(TABLE_SEL);
    if (!tableEl) return null;

    dt = new DataTable(TABLE_SEL, {
      order: [],
      pageLength: 20,
      lengthChange: false,
      columnDefs: [
        {
          targets: 1,    // hide Committee ID column
          visible: false
        }
      ],

      // Remove DataTables’ built-in search box (top) so only your custom one is used
      layout: {
        topStart: null,
        topEnd: null,
        bottomEnd: {
          paging: { type: 'full' }
        }
      },

      language: {
        // This only matters if the built-in search is shown, but keeping it is fine
        search: '<span class="visually-hidden">Search Committees</span>',
        searchPlaceholder: 'Search by committee name or ID'
      },

      initComplete: function () {
        // If you ever re-enable the built-in search, this keeps it a reasonable width
        const input = document.querySelector('#committee_list_table_wrapper input[type=search]');
        if (input) input.style.width = '15rem';
      }
    });

    return dt;
  }

  function wireTopSearch() {
    const searchEl = document.querySelector(TOP_SEARCH_SEL);
    const clearBtn = document.querySelector(CLEAR_BTN_SEL);
    const countEl = document.querySelector(COUNT_SEL);

    if (!searchEl) return; // top search not on this page

    // Avoid stacking duplicate listeners if offcanvas opens multiple times
    if (searchEl.dataset.wired === 'true') return;
    searchEl.dataset.wired = 'true';

    const instance = initDataTable();
    if (!instance) return;

    function updateCount() {
      if (!countEl) return;
      const info = instance.page.info();
      countEl.textContent =
        `${info.recordsDisplay.toLocaleString()} of ${info.recordsTotal.toLocaleString()} committees shown`;
    }

    searchEl.addEventListener('input', () => {
      instance.search(searchEl.value).draw();
      updateCount();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchEl.value = '';
        instance.search('').draw();
        searchEl.focus();
        updateCount();
      });
    }

    // If user opens the offcanvas after previously filtering, keep UI consistent
    updateCount();
  }

  // If the table is present at load, initialize and wire immediately
  document.addEventListener('DOMContentLoaded', () => {
    initDataTable();
    wireTopSearch();
  });

  // Also wire on offcanvas show (helps if content is injected or initialized later)
  const offcanvasEl = document.querySelector(OFFCANVAS_SEL);
  if (offcanvasEl) {
    offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
      initDataTable();
      wireTopSearch();
    });
  }
})();