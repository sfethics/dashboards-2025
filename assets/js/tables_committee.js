function parseMoneyValue(value) {
    if (value === null || value === undefined) {
        return 0;
    }

    if (typeof value === 'number') {
        return value;
    }

    let str = String(value).trim().toUpperCase().replace(/[$,\s]/g, '');

    if (!str) {
        return 0;
    }

    let multiplier = 1;

    if (str.endsWith('K')) {
        multiplier = 1e3;
        str = str.slice(0, -1);
    } else if (str.endsWith('M')) {
        multiplier = 1e6;
        str = str.slice(0, -1);
    } else if (str.endsWith('B')) {
        multiplier = 1e9;
        str = str.slice(0, -1);
    }

    const numeric = Number(str);
    return Number.isFinite(numeric) ? numeric * multiplier : 0;
}

function getColumnMax(tableEl, columnIndex) {
    const cells = tableEl.querySelectorAll(`tbody tr td:nth-child(${columnIndex + 1})`);
    let max = 0;

    cells.forEach(function (cell) {
        const value = parseMoneyValue(cell.textContent);
        if (value > max) {
            max = value;
        }
    });

    return max;
}

function getFilteredColumnMax(api, columnIndex) {
    const values = api
        .column(columnIndex, { search: 'applied' })
        .data()
        .toArray()
        .map(parseMoneyValue);

    return Math.max(...values, 0);
}

function renderCurrencyBar(value, maxValue, barClass, useSqrtScaling = true) {
    const numericValue = parseMoneyValue(value);
    let widthPct = 0;

    if (maxValue > 0) {
        widthPct = useSqrtScaling
            ? Math.sqrt(numericValue / maxValue) * 100
            : (numericValue / maxValue) * 100;
    }

    return `
        <div class="dt-bar-cell ${barClass}" style="--bar-width: ${Math.min(widthPct, 100)}%;">
            <span class="dt-bar-value">${formatAsCurrency(numericValue)}</span>
        </div>
    `;
}

function applyBarsToCurrentPage(api, columnIndex, barClass, useSqrtScaling = true) {
    const tableEl = api.table().node();
    if (!tableEl || !tableEl.classList.contains('dt-bars')) {
        return;
    }

    const maxValue = getFilteredColumnMax(api, columnIndex);
    const nodes = api.column(columnIndex, { page: 'current' }).nodes();
    const values = api.column(columnIndex, { page: 'current' }).data().toArray();

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].innerHTML = renderCurrencyBar(values[i], maxValue, barClass, useSqrtScaling);
    }
}

function runBarPass(api, configs) {
    configs.forEach(function (cfg) {
        applyBarsToCurrentPage(api, cfg.columnIndex, cfg.barClass, cfg.useSqrtScaling);
    });
}

function scheduleBarPass(api, configs) {
    requestAnimationFrame(function () {
        runBarPass(api, configs);

        requestAnimationFrame(function () {
            runBarPass(api, configs);
        });
    });
}

function setupBarRefresh(api, configs) {
    const tableEl = api.table().node();
    if (!tableEl || !tableEl.classList.contains('dt-bars')) {
        return;
    }
    if (api.column(configs[0].columnIndex).data().toArray().length < 2) {
        return;
    }

    api.on('draw', function () {
        scheduleBarPass(api, configs);
    });

    api.on('page', function () {
        scheduleBarPass(api, configs);
    });

    api.on('order', function () {
        scheduleBarPass(api, configs);
    });

    api.on('search', function () {
        scheduleBarPass(api, configs);
    });

    api.on('responsive-resize', function () {
        scheduleBarPass(api, configs);
    });

    api.on('column-sizing', function () {
        scheduleBarPass(api, configs);
    });

    scheduleBarPass(api, configs);

    setTimeout(function () {
        scheduleBarPass(api, configs);
    }, 0);

    setTimeout(function () {
        scheduleBarPass(api, configs);
    }, 100);
}

/* Contributors */
if (document.querySelector('#contributors_table')) {
    new DataTable('#contributors_table', {
        pageLength: 10,
        lengthChange: false,
        order: [[2, 'desc']],
        columnDefs: [
            { width: '60%', targets: [1] },
            { width: '20%', targets: [0, 2] },
            {
                targets: 2,
                render: function (data, type) {
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
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
            search: '<span class="visually-hidden">Search...</span>',
            searchPlaceholder: 'Search…'
        },
        initComplete: function () {
            const input = document.querySelector('#contributors_table_filter input[type=search]');
            if (input) {
                input.setAttribute('aria-label', 'Search Contributors');
            }

            setupBarRefresh(this.api(), [
                { columnIndex: 2, barClass: 'dt-bar-funds', useSqrtScaling: true }
            ]);
        }
    });
}

/* Expenditures */
if (document.querySelector('#expenditures_table')) {
    new DataTable('#expenditures_table', {
        pageLength: 10,
        lengthChange: false,
        order: [[1, 'desc']],
        columnDefs: [
            { width: '80%', targets: [0] },
            {
                targets: 1,
                render: function (data, type) {
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
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
            search: '<span class="visually-hidden">Search...</span>',
            searchPlaceholder: 'Search…'
        },
        initComplete: function () {
            const input = document.querySelector('#expenditures_table_filter input[type=search]');
            if (input) {
                input.setAttribute('aria-label', 'Search Expenditures');
            }

            setupBarRefresh(this.api(), [
                { columnIndex: 1, barClass: 'dt-bar-expenses', useSqrtScaling: true }
            ]);
        }
    });
}

/* Loans received */
if (document.querySelector('#loans_received_table')) {
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
                render: function (data, type) {
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
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
        initComplete: function () {
            setupBarRefresh(this.api(), [
                { columnIndex: 4, barClass: 'dt-bar-expenses', useSqrtScaling: true }
            ]);
        }
    });
}

/* Filings */
if (document.querySelector('#filings_table')) {
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
}

/* Third-party table */
if (document.querySelector('#third_party_table')) {
    const fundsMax = getColumnMax(document.querySelector('#third_party_table'), 2);
    const expensesMax = getColumnMax(document.querySelector('#third_party_table'), 3);
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
            bottomEnd: null
        },
        lengthChange: false,
        columnDefs: [
            { responsivePriority: 10001, targets: [1,2] },
            {
                targets: 2,
                render: function (data, type) {
                    if (type === 'display') {
                        return renderCurrencyBar(data, fundsMax, 'dt-bar-funds', true);
                    }
                    return data;
                }
            }, 
            {
                targets: 3,
                render: function (data, type) {
                    if (type === 'display') {
                        return renderCurrencyBar(data, expensesMax, 'dt-bar-expenses', true);
                    }
                    return data;
                }
            }
        ]
        // ,
        // initComplete: function () {
        //     setupBarRefresh(this.api(), [
        //         { columnIndex: 2, barClass: 'dt-bar-funds', useSqrtScaling: true },
        //         { columnIndex: 3, barClass: 'dt-bar-expenses', useSqrtScaling: true }
        //     ]);
        // }
    });
}

/* IE candidates */
if (document.querySelector('#ie-candidates_table')) {
    new DataTable('#ie-candidates_table', {
        pageLength: 10,
        lengthChange: false,
        responsive: {
            details: {
                display: DataTable.Responsive.display.childRowImmediate,
                target: 0,
                type: 'none'
            }
        },
        order: [[3, 'desc']],
        columnDefs: [
            { responsivePriority: 10001, targets: [0,2] },
            {
                targets: 3,
                render: function (data, type) {
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
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
        initComplete: function () {
            setupBarRefresh(this.api(), [
                { columnIndex: 3, barClass: 'dt-bar-expenses', useSqrtScaling: true }
            ]);
        }
    });
}

/* Schedule D */
if (document.querySelector('#schedule-d_table')) {
    new DataTable('#schedule-d_table', {
        pageLength: 10,
        lengthChange: false,
        order: [[3, 'desc'], [0, 'asc']],
        responsive: {
            details: {
                display: DataTable.Responsive.display.childRowImmediate,
                target: 0,
                type: 'none'
            }
        },
        columnDefs: [
            { width: '20%', targets: [1] },
            { width: '10%', targets: [2, 3] },
            { responsivePriority: 10001, targets: [1] },
            {
                targets: 3,
                render: function (data, type) {
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
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
        initComplete: function () {
            setupBarRefresh(this.api(), [
                { columnIndex: 3, barClass: 'dt-bar-expenses', useSqrtScaling: true }
            ]);
        }
    });
}

/* F497P2 */
if (document.querySelector('#f497p2_table')) {
    new DataTable('#f497p2_table', {
        pageLength: 10,
        lengthChange: false,
        columnDefs: [
            {
                targets: 1,
                render: function (data, type) {
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
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
        initComplete: function () {
            setupBarRefresh(this.api(), [
                { columnIndex: 1, barClass: 'dt-bar-funds', useSqrtScaling: true }
            ]);
        }
    });
}

/* IE measures */
if (document.querySelector('#ie-measures_table')) {
    new DataTable('#ie-measures_table', {
        displayLength: -1,
        responsive: {
            details: {
                display: DataTable.Responsive.display.childRowImmediate,
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
        order: [[2, 'desc']],
        columnDefs: [
            { responsivePriority: 10001, targets: [1] },
            {
                targets: 2,
                render: function (data, type) {
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
                }
            }
        ],
        language: {
            search: '<span class="visually-hidden">Search...</span>',
            searchPlaceholder: 'Search…'
        },
        initComplete: function () {
            const input = document.querySelector('#ie-measures_table_filter input[type=search]');
            if (input) {
                input.setAttribute('aria-label', 'Search Independent Expenditures');
            }

            setupBarRefresh(this.api(), [
                { columnIndex: 2, barClass: 'dt-bar-expenses', useSqrtScaling: true }
            ]);
        }
    });
}