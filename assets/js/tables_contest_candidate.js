let layoutOptions = {
    topStart: null,
    topEnd: null,
    bottomStart: null,
    bottomEnd: null,
}
new DataTable('table.candidate_controlled', {
    lengthChange: false,
    displayLength: -1,
    layout: layoutOptions,
    columnDefs: [{
        targets: [1, 2],
        render: function (data, type, row, meta) {
            if (type === 'display') {
                return formatAsCurrency(data);
            }
            return data
        }
    },
    ],
    footerCallback: function (row, data, start, end, display) {
        let api = this.api();

        // Total over all pages
        totalExp = api
            .column(2)
            .data()
            .reduce(sumAsNum, 0);
        totalCon = api
            .column(1)
            .data()
            .reduce(sumAsNum, 0);

        // Update footer
        api.column(2).footer().innerHTML =
            formatAsCurrency(totalExp);
        api.column(1).footer().innerHTML =
            formatAsCurrency(totalCon);
    },
});

new DataTable('table.ie_committee', {
    displayLength: -1,
    responsive: true,
    layout: layoutOptions,
    lengthChange: false,
    columnDefs: [{
        targets: [1, 2],
        render: function (data, type, row, meta) {
            if (type === 'display') {
                return formatAsCurrency(data);
            }
            return data
        }
    },
    ],
    footerCallback: function (row, data, start, end, display) {
        let api = this.api();

        // Total over all pages
        totalExp = api
            .column(2)
            .data()
            .reduce(sumAsNum, 0);

        // Update footer
        api.column(2).footer().innerHTML =
            formatAsCurrency(totalExp);
    },
});

new DataTable('table.all_ie_committees', {
    displayLength: -1,
    responsive: true,
    layout: layoutOptions,
    lengthChange: false,
    columnDefs: [{
        targets: [3, 4],
        render: function (data, type, row, meta) {
            if (type === 'display') {
                return formatAsCurrency(data);
            }
            return data
        }
    },
    ],
    footerCallback: function (row, data, start, end, display) {
        let api = this.api();

        // Total over all pages
        totalExp = api
            .column(4)
            .data()
            .reduce(sumAsNum, 0);

        // Update footer
        api.column(4).footer().innerHTML =
            formatAsCurrency(totalExp);
    },
});