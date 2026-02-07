let table = new DataTable('table.dtify', {
    pageLength: 20,
    order: [[1, 'desc']],
    layout: {
        topStart: null,
        bottomEnd: {
            paging: {
                type: 'full'
            }
        }
    },
    columnDefs: [
        {
            targets: [1],
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