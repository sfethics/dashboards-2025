let layoutOptions = {
    topStart: null,
    topEnd: null,
    bottomStart: null,
    bottomEnd: null,
}
new DataTable('table.dtify_both', {
    columnDefs: [
        {
            targets: [1, 2],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data
            }
        }
    ],
    displayLength: -1,
    layout: layoutOptions,
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

    }
});

new DataTable('table.dtify_exp', {
    columnDefs: [
        {
            targets: [1, 2],
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    return formatAsCurrency(data);
                }
                return data
            }
        }
    ],
    displayLength: -1,
    layout: layoutOptions,
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
    }
});