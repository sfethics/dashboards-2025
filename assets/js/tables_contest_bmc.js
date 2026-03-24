let layoutOptions = {
    topStart: null,
    topEnd: null,
    bottomStart: null,
    bottomEnd: null,
};

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

function renderCurrencyBar(data, type, maxValue, barClass, useSqrtScaling = false) {
    if (type !== 'display') {
        return parseMoneyValue(data);
    }

    const numericValue = parseMoneyValue(data);
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

document.querySelectorAll('table.dtify-bmc').forEach(function (tableEl) {
    const hasBars = tableEl.classList.contains('dt-bars');
    const fundsMax = hasBars ? getColumnMax(tableEl, 2) : 0;
    const expensesMax = hasBars ? getColumnMax(tableEl, 3) : 0;

    new DataTable(tableEl, {
        columnDefs: [
            {
                targets: 2,
                render: function (data, type) {
                    if (hasBars) {
                        return renderCurrencyBar(data, type, fundsMax, 'dt-bar-funds', true);
                    }
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
                }
            },
            {
                targets: 3,
                render: function (data, type) {
                    if (hasBars) {
                        return renderCurrencyBar(data, type, expensesMax, 'dt-bar-expenses', false);
                    }
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
                }
            }
        ],
        responsive: {
            details: {
                display: DataTable.Responsive.display.childRowImmediate,
                target: 0,
                type: 'none'
            }
        },
        order: [[1, 'asc']],
        lengthChange: false,
        displayLength: -1,
        layout: layoutOptions,
        footerCallback: function () {
            let api = this.api();

            let totalExp = api
                .column(3)
                .data()
                .reduce(sumAsNum, 0);

            api.column(3).footer().innerHTML =
                formatAsCurrency(totalExp);
        }
    });
});

document.querySelectorAll('table.dtify_contributors').forEach(function (tableEl) {
    const hasBars = tableEl.classList.contains('dt-bars');
    const maxValue = hasBars ? getColumnMax(tableEl, 1) : 0;

    new DataTable(tableEl, {
        order: [],
        displayLength: -1,
        layout: layoutOptions,
        columnDefs: [
            {
                targets: 1,
                render: function (data, type) {
                    if (hasBars) {
                        return renderCurrencyBar(data, type, maxValue, 'dt-bar-funds', true);
                    }
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return parseMoneyValue(data);
                }
            }
        ]
    });
});