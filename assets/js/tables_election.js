let layoutOptions = {
    topStart: null,
    topEnd: null,
    bottomStart: null,
    bottomEnd: null,
}
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

function getColumnMax(tableSelector, columnIndex) {
    const cells = document.querySelectorAll(`${tableSelector} tbody tr td:nth-child(${columnIndex + 1})`);
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

    const numericValue = data;
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

document.querySelectorAll('table.dtify_exp').forEach(function (tableEl) {
    const tableSelector = `#${tableEl.id}`;
    const hasBars = tableEl.classList.contains('dt-bars');
    const fundsMax = hasBars ? getColumnMax(tableSelector, 1) : 0;
    const expensesMax = hasBars ? getColumnMax(tableSelector, 2) : 0;

    new DataTable(tableSelector, {
        columnDefs: [
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    if (hasBars) {
                        return renderCurrencyBar(data, type, fundsMax, 'dt-bar-funds', true);
                    }
                    else if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return data;
                }
            },
            {
                targets: 2,
                render: function (data, type, row, meta) {
                    if (hasBars) {
                        return renderCurrencyBar(data, type, expensesMax, 'dt-bar-expenses', false);
                    }
                    else if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return data;
                }
            }
        ],
        displayLength: -1,
        layout: layoutOptions,
        footerCallback: function () {
            let api = this.api();

            let totalExp = api
                .column(2)
                .data()
                .reduce(sumAsNum, 0);

            let totalCon = api
                .column(1)
                .data()
                .reduce(sumAsNum, 0);

            api.column(2).footer().innerHTML = formatAsCurrency(totalExp);
            api.column(1).footer().innerHTML = formatAsCurrency(totalCon);
        }
    });
});

document.querySelectorAll('table.dtify_both').forEach(function (tableEl) {
    const tableSelector = `#${tableEl.id}`;
    const hasBars = tableEl.classList.contains('dt-bars');
    const fundsMax = hasBars ? getColumnMax(tableSelector, 1) : 0;
    const expensesMax = hasBars ? getColumnMax(tableSelector, 2) : 0;

    new DataTable(tableSelector, {
        columnDefs: [
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    if (hasBars) {
                        return renderCurrencyBar(data, type, fundsMax, 'dt-bar-funds', true);
                    }
                    else if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return data;
                }
            },
            {
                targets: 2,
                render: function (data, type, row, meta) {
                    if (hasBars) {
                        return renderCurrencyBar(data, type, expensesMax, 'dt-bar-expenses', false);
                    }
                    else if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return data;
                }
            }
        ],
        displayLength: -1,
        layout: layoutOptions,
        footerCallback: function () {
            let api = this.api();

            let totalExp = api
                .column(2)
                .data()
                .reduce(sumAsNum, 0);

            let totalCon = api
                .column(1)
                .data()
                .reduce(sumAsNum, 0);

            api.column(2).footer().innerHTML = formatAsCurrency(totalExp);
            api.column(1).footer().innerHTML = formatAsCurrency(totalCon);
        }
    });
});

document.querySelectorAll('table.dtify_topbm, table.dtify_topcand').forEach(function (tableEl) {
    const tableSelector = `#${tableEl.id}`;
    const hasBars = tableEl.classList.contains('dt-bars');
    const maxValue = hasBars ? getColumnMax(tableSelector, 1) : 0;

    new DataTable(tableSelector, {
        order: [],
        columnDefs: [
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    if (hasBars) {
                        // use linear scaling here (these are already top values)
                        return renderCurrencyBar(data, type, maxValue, 'dt-bar-expenses', false);
                    }

                    else if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return data;
                }
            }
        ],
        displayLength: -1,
        layout: layoutOptions
    });
});
document.querySelectorAll('table.dtify_contributors').forEach(function (tableEl) {
    const tableSelector = `#${tableEl.id}`;
    const hasBars = tableEl.classList.contains('dt-bars');
    const maxValue = hasBars ? getColumnMax(tableSelector, 1) : 0;

    new DataTable(tableSelector, {
        order: [],
        columnDefs: [
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    if (hasBars) {
                        return renderCurrencyBar(data, type, maxValue, 'dt-bar-funds', true);
                    }
                    else if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return data;
                }
            }
        ],
        displayLength: -1,
        layout: layoutOptions
    });
});