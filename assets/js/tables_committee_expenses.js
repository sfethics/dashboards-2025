let table = new DataTable('table.dtify', {
    pageLength: 20,
    order: [[2, 'desc']],
    layout: {
        topStart: null,
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    },
    responsive: {
        details: {
            display: DataTable.Responsive.display.childRowImmediate,
            target: 0,
            type: 'none'
        }
    },
    columnDefs: [
        { responsivePriority: 10001, targets: [1] },
        {
            targets: [2],
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