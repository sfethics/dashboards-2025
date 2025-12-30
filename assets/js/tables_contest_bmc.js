if (document.querySelectorAll('table.dtify-bmc').length > 0) {
    new DataTable('table.dtify-bmc', {
        columnDefs: [
            {
                targets: [2, 3],
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        return formatAsCurrency(data);
                    }
                    return data
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
        layout: {
            topStart: null,
            topEnd: null,
            bottomStart: null,
            bottomEnd: null,
        },

        footerCallback: function (row, data, start, end, display) {
            let api = this.api();

            // Total over all pages
            totalExp = api
                .column(3)
                .data()
                .reduce(sumAsNum, 0);

            // Update footer
            api.column(3).footer().innerHTML =
                formatAsCurrency(totalExp);
        },
    });
}