function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["K", "M", "B", "T"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round(number * decPlaces / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
}

function getRounding(num) {
    if (num < 1000) {
        return 0;
    } else if (num <= 10000) {
        return 1;
    } else if (num <= 100000) {
        return 0;
    } else if (num <= 1000000) {
        return 0;
    } else {
        return 1;
    }
}

// Array reducing function that converts strings to numbers
function sumAsNum(a, b) {
    // Remove the formatting to get number data for summation
    let numVal = function (i) {
        return typeof i === 'string'
            ? i.replace(/[\$,]/g, '') * 1
            : typeof i === 'number'
            ? i
            : 0;
    };
    return numVal(a) + numVal(b)
}

function formatAsPercentage(val) {
    if (val == "") {
        return ""
    }
    if (isNaN(val)) {
        return val
    }

    return `${val} %`
}
function formatAllPercentageElements(containerId) {
  const container = containerId
    ? document.getElementById(containerId)
    : document;

  if (!container) return;

  container.querySelectorAll('.percentage').forEach(el => {
    const original = el.textContent;
    const formatted = formatAsPercentage(original);
    el.textContent = formatted
  });
}

function formatAsCurrency(val) {
    if (val == "") {
        return ""
    }
    if (parseInt(val) == 0) {
        return "N/A"
    }
    if (isNaN(val)) {
        return val
    }

    val = parseFloat(val)
    let round = getRounding(val)
    return "$"+abbrNum(val, round)
}

function formatAllCurrencyElements(containerId) {
  const container = containerId
    ? document.getElementById(containerId)
    : document;

  if (!container) return;

  container.querySelectorAll('.currency').forEach(el => {
    const original = el.textContent;
    const formatted = formatAsCurrency(original);
    el.textContent = formatted
  });
}

function formatAllDateElements() {
  document.querySelectorAll('.formatted-date').forEach(el => {
    const [year, month, day] = el.textContent.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    el.textContent = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
        }).format(dateObj);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // Format ALL `.currency` elements 
  formatAllCurrencyElements();
  
  // Format ALL `.percentage` elements 
  formatAllPercentageElements();

  formatAllDateElements();
});