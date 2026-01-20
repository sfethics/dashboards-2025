new DataTable('#contributors_table', {
    pageLength: 10,
    lengthChange: false,
    order: [[2, 'desc']],
    columnDefs: [
        { width: '60%', targets: [1] },
        { width: '20%', targets: [0, 2] },
        {
            targets: [2],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data;
            }
        }
    ],
    layout: {
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    },
    language: {
        search: '',                     // remove visible label text :contentReference[oaicite:0]{index=0}
        searchPlaceholder: 'Search…'   // set placeholder text :contentReference[oaicite:1]{index=1}
    },
    initComplete: function () {
        // Add an aria-label if you prefer not to visually show a label but still provide accessibility
        const input = document.querySelector('#contributors_table_filter input[type=search]');
        if (input) {
            input.setAttribute('aria-label', 'Search Contributors');   // ensures screen-reader users know what this input is for
        }
    }
});
new DataTable('#expenditures_table', {
    pageLength: 10,
    lengthChange: false,
    order: [[1, 'desc']],
    columnDefs: [
        { width: '80%', targets: [0] },
        {
            targets: [1],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data;
            }
        }
    ],
    layout: {
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    },
    language: {
        search: '',                     // remove visible label text :contentReference[oaicite:0]{index=0}
        searchPlaceholder: 'Search…'   // set placeholder text :contentReference[oaicite:1]{index=1}
    },
    initComplete: function () {
        // Add an aria-label if you prefer not to visually show a label but still provide accessibility
        const input = document.querySelector('#expenditures_table_filter input[type=search]');
        if (input) {
            input.setAttribute('aria-label', 'Search Expenditures');   // ensures screen-reader users know what this input is for
        }
    }
});
new DataTable('#loans_received_table', {
    pageLength: 10,
    lengthChange: false,
    order: [[1, 'desc']],
    responsive: {
        details: {
            display: DataTable.Responsive.display.childRowImmediate,
            target: 0,
            type: 'none'
        }
    },
    columnDefs: [
        { responsivePriority: 10001, targets: [2, 3] },
        {
            targets: [1, 2, 3, 4],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data;
            }
        }
    ],
    layout: {
        topEnd: null,
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    },
});
new DataTable('#filings_table', {
    pageLength: 10,
    order: [[0, 'desc']],
    lengthChange: false,
    layout: {
        topEnd: null,
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    }
});

// this table only appears on candidate_committee.html
new DataTable('#third_party_table', {
    displayLength: -1,
    responsive: {
        details: {
            display: DataTable.Responsive.display.childRowImmediate,
            target: 0,
            type: 'none'
        }
    },
    layout: {
        topStart: null,
        topEnd: null,
        bottomStart: null,
        bottomEnd: null,
    },
    lengthChange: false,
    columnDefs: [
        { responsivePriority: 10001, targets: [1] },
        {
            targets: [2, 3],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data
            }
        },
    ],
});

new DataTable('table#ie-candidates_table', {
    pageLength: 10,
    lengthChange: false,
    order: [[2, 'desc']],
    columnDefs: [
        {
            targets: [-1],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data
            }
        }
    ],
    layout: {
        topEnd: null,
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    }
});

new DataTable('table#schedule-d_table', {
    pageLength: 10,
    lengthChange: false,
    order: [[2, 'desc'], [3, 'desc']],
    responsive: {
        details: {
            display: DataTable.Responsive.display.childRowImmediate,
            target: 0,
            type: 'none'
        }
    },
    columnDefs: [
        { width: '20%', targets: [1] },
        { width: '10%', targets: [2,3] },
        { responsivePriority: 10001, targets: [1] },
        {
            targets: [-1],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data
            }
        }
    ],
    layout: {
        topEnd: null,
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    }
});

new DataTable('table.dt_f497p2', {
    pageLength: 10,
    lengthChange: false,
    columnDefs: [
        {
            targets: [-1],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data
            }
        }
    ],
    layout: {
        topEnd: null,
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    }
});

// IE Measures — use same responsive approach as third_party_table

new DataTable('#ie-measures_table', {
  displayLength: -1,
  responsive: {
    details: {
      display: DataTable.Responsive.display.childRowImmediate,
      // render hidden columns as a small label/value table
      // (some vanilla libs support renderer.tableAll; if your build doesn't, remove renderer)
      renderer: DataTable.Responsive.renderer && DataTable.Responsive.renderer.tableAll
                 ? DataTable.Responsive.renderer.tableAll({ tableClass: 'responsive-child-table' })
                 : undefined,
      target: 0,
      type: 'none'
    }
  },
        layout: {
            bottomEnd: {
                paging: {
                    type: 'full'
                }
            }
        },
  lengthChange: false,
  order: [[2, 'desc']], // sort by Total column
  columnDefs: [
    // keep Measure visible first, Position second, Total collapsible if needed
    { responsivePriority: 10001, targets: [1] },

    // format the Total column for display (currency)
    {
      targets: [2],
      render: function (data, type, row, meta) {
        if (type === 'display') {
          return formatAsCurrency(data);
        }
        return data;
      }
    }
  ],
  language: {
    search: '',
    searchPlaceholder: 'Search…'
  },
  initComplete: function () {
    const input = document.querySelector('#ie-measures_table_filter input[type=search]');
    if (input) input.setAttribute('aria-label', 'Search Independent Expenditures');
  }
});
