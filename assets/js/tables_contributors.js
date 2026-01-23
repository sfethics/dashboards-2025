let layoutOptions = {
    topStart: null,
    // topEnd: null,
    bottomStart: null,
    bottomEnd: null,
}
function format(d) {
    return d[4]; // this is the contents of row[4]
}

let table = new DataTable('table.dtify', {
    lengthMenu: [
        [10, 25, 50, 100],
        [10, 25, 50, 100]
    ],
    // layout: layoutOptions,
    order: [[3, 'desc'], [2, 'asc'], [1, 'asc']],
    layout: {
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    },
    columnDefs: [
        {
            targets: [0],
            class: 'dt-control',
            orderable: false,
        },
        {
            targets: [4],
            visible: false,
        },
        {
            targets: [3],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data
            }
        },
    ],
    language: {
    search: '<span class="visually-hidden">Search...</span>',
    searchPlaceholder: 'Search…'
  }
});

// Add event listener for opening and closing details
// and listener for redrawing as "currency"
table.on('click', 'td.dt-control', function (e) {
    let tr = e.target.closest('tr');
    let row = table.row(tr);

    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
    }
    else {
        // Open this row
        row.child(format(row.data())).show();
    }
    formatAllCurrencyElements()
})

