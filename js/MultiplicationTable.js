/* 
File: MultiplicationTable.js
GUI Assignment: [HW4]
Nicholas Johnson, UMass Lowell Computer Science, Nicholas_Johnson5@student.uml.edu 
Copyright (c) 2025 by Nicholas Johnson.  All rights reserved.  May be freely copied or 
excerpted for educational purposes with credit to the author. 
updated by NJ on November 28, 2025 at 9:06 PM
Template for header made by Wenjin Zhou and provided in the HW1 pdf.
*/

let tabIndex = 1;

$(document).ready(function () {
    // Adds validation rules to the validator.
    $.validator.addMethod("integerOnly", function (value) {
        return value === "" || Number.isInteger(parseFloat(value));
    }, "Value must be a whole number.");

    $.validator.addMethod("inRange", function (value) {
        if (value === "" || isNaN(value)) return true;
        const n = parseFloat(value);
        return n >= -50 && n <= 50;
    }, "Value must be between -50 and 50.");

    $.validator.addMethod("rowOrder", function () {
        const min = parseFloat($("#minrow").val());
        const max = parseFloat($("#maxrow").val());
        if (isNaN(min) || isNaN(max)) return true;
        return min <= max;
    }, "Max row must be ≥ min row.");

    $.validator.addMethod("colOrder", function () {
        const min = parseFloat($("#mincol").val());
        const max = parseFloat($("#maxcol").val());
        if (isNaN(min) || isNaN(max)) return true;
        return min <= max;
    }, "Max column must be ≥ min column.");

    // Validate form:
    $("#form").validate({
        rules: {
            minrow: { required: true, number: true, integerOnly: true, inRange: true, rowOrder: true },
            maxrow: { required: true, number: true, integerOnly: true, inRange: true, rowOrder: true },
            mincol: { required: true, number: true, integerOnly: true, inRange: true, colOrder: true },
            maxcol: { required: true, number: true, integerOnly: true, inRange: true, colOrder: true }
        },
        // Custom error display:
        showErrors: function (errorMap) {
            // Clear previous:
            $(".error-msg").text("");
            $("#conditions li").removeClass("invalid");

            let anyNotNumber = false;
            let anyNotInteger = false;
            let outOfRange = false;
            let minOverMax = false;

            // Detect failed rules:
            for (const field in errorMap) {
                const msg = errorMap[field].toLowerCase();
                if (msg.includes("number")) anyNotNumber = true;
                if (msg.includes("whole")) anyNotInteger = true;
                if (msg.includes("between")) outOfRange = true;
                if (msg.includes("≥") || msg.includes(">=") || msg.includes("greater")) minOverMax = true;
            }

            // Display unmet conditions:
            if (outOfRange) {
                $("#in-range .error-msg").text("Values must be between -50 and 50");
                $("#in-range").addClass("invalid");
            }
            if (minOverMax) {
                $("#max-over-min .error-msg").text("Maximum must be ≥ minimum");
                $("#max-over-min").addClass("invalid");
            }
            if (anyNotInteger) {
                $("#whole-number .error-msg").text("All inputs must be whole numbers");
                $("#whole-number").addClass("invalid");
            }
            if (anyNotNumber) {
                $("#is-number .error-msg").text("All inputs must be numbers");
                $("#is-number").addClass("invalid");
            }
        },
        // Clear table if invalid:
        invalidHandler: function () {
            generateInputTab();
        },
        // Block table generation unless valid:
        submitHandler: function () {
            createTableTab();
        }
    });

    // Creates the sliders:
    const sliders = [
        { input: "#minrow", slider: "#minrow-slider" },
        { input: "#maxrow", slider: "#maxrow-slider" },
        { input: "#mincol", slider: "#mincol-slider" },
        { input: "#maxcol", slider: "#maxcol-slider" }
    ];

    // Slider logic:
    sliders.forEach(pair => {
        const $input = $(pair.input);
        const $slider = $(pair.slider);

        $slider.slider({
            min: -50,
            max: 50,
            value: parseInt($input.val()),
            slide: function (event, ui) {
                $input.val(ui.value).trigger("change");
            }
        });

        $input.on("input", function () {
            const val = parseInt($input.val());
            if (!isNaN(val) && val >= -50 && val <= 50) {
                $slider.slider("value", val);
                $input.trigger("change");
            }
        });
    });

    $("#minrow, #maxrow, #mincol, #maxcol").on("change", function () {
        if ($("#form").valid()) generateInputTab();
    });

    // Initialize tabs:
    $("#tabs").tabs();

    // Generates the input tab (where new tabs are created):
    function generateInputTab() {
        const container = $("#mult-table");
        container.empty();
        const table = generateTable();
        container.append(table);
    }

    // Creates a tab with a saved table:
    function createTableTab() {
        const tabId = `tab-${tabIndex}`;
        const $tabContent = $(`<div id="${tabId}"></div>`);
        const table = generateTable();
        $tabContent.append(table);

        const minRow = $("#minrow").val();
        const maxRow = $("#maxrow").val();
        const minCol = $("#mincol").val();
        const maxCol = $("#maxcol").val();

        const tabLabel = `Table ${tabIndex}`;
        $("#tabs .ui-tabs-nav").append(
            `<li><a href="#${tabId}">${tabLabel}</a>
             <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>`
        );
        $("#tabs").append($tabContent);

        $("#tabs").tabs("refresh");
        const newIndex = $("#tabs ul li").length - 1;
        $("#tabs").tabs("option", "active", newIndex);

        tabIndex++;
    }

    // Creates the table based on inputs:
    function generateTable() {
        const minRow = parseInt($("#minrow").val());
        const maxRow = parseInt($("#maxrow").val());
        const minCol = parseInt($("#mincol").val());
        const maxCol = parseInt($("#maxcol").val());

        const table = document.createElement("table");

        for (let i = minRow - 1; i <= maxRow; i++) {
            const row = document.createElement("tr");
            for (let j = minCol - 1; j <= maxCol; j++) {
                const headerRow = (i === minRow - 1);
                const headerCol = (j === minCol - 1);
                const origin = headerRow && headerCol;
                const cell = document.createElement(headerRow || headerCol ? "th" : "td");

                if (origin) cell.textContent = "*";
                else if (headerRow) cell.textContent = j;
                else if (headerCol) cell.textContent = i;
                else cell.textContent = i * j;

                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        return table;
    }

    // Close functionality:
    $("#tabs").on("click", "span.ui-icon-close", function () {
        const panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        $("#tabs").tabs("refresh");
    });
});
