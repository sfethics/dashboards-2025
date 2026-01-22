new DataTable('#committee_list_table', {
    order: [],
    pageLength: 20,
    lengthChange: false,
    columnDefs: [
        {
            targets: 1,        // column index to hide
            visible: false     // hidden from view
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
        // Provide label text (HTML is allowed here) and keep placeholder for visual users
        search: '<span class="visually-hidden">Search Committees</span>',
        searchPlaceholder: 'Search by committee name or ID'
    },
    initComplete: function () {
        // No need to set aria-label on the input when the <label> has text;
        // remove or comment out the aria-label line to avoid duplicate announcement.
        const input = document.querySelector('#committee_list_table_wrapper input[type=search]');
        if (input) {
            input.style.width = '15rem';
        }
    }
});
