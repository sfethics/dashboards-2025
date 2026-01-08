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
        search: '',                     // remove visible label text :contentReference[oaicite:0]{index=0}
        searchPlaceholder: 'Search by name or Committee ID…'   // set placeholder text :contentReference[oaicite:1]{index=1}
    },
    initComplete: function () {
        // Add an aria-label if you prefer not to visually show a label but still provide accessibility
        const input = document.querySelector('#committee_list_table_wrapper input[type=search]');
        if (input) {
            input.setAttribute('aria-label', 'Search Committees');   // ensures screen-reader users know what this input is for
            input.setAttribute('style', 'width: 15rem');            // ensures the input field is full width
        }
    }
});
