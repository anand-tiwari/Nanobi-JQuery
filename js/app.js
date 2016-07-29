$(document).ready(function() {
    var productType = [];
    var obj = {};
    //------------------ Ajax Call and GET Json Response ------------------------------------------------------//
    $.ajax({
        "type": 'GET',
//                    "url": "http://nbvmpoc.cloudapp.net:81/contentserver/services/content/analytics/an8e8ee334-08ce-4fef-bbdb-798f7b1b6bf5/json?t=930d0d51-9765-4787-bfe8-9770e3afa053",
        "url": "data.json",
        "cache": 'false',
        "dataType": "json",
        success: function(data) {
            //---------------------------   create Object for later operation on that object --------------------//
            $(data.json_data).each(function(k, v) {
                var product, sale;
                $.each(v, function(i, e) {
                    if (i == "Product Category")
                        product = e;
                    if (i == "Net Sales")
                        sale = e;
                });
                productType[k] = (product);
                obj[k] = {
                    Product: product,
                    State: v.State,
                    Date: v.Date,
                    Sale: sale
                };
            });
            console.log($.unique(productType));
            //----------------------- Filter Unique values and create select option ------------------------------//
            $($.unique(productType)).each(function(i, v) {
                $('.productCategory').append('<option value="' + v + '">' + v + '</option>');
            });

            //----------------- Handle events of changing the Product Category ------------------------------------------------//
            $('.productCategory').on('change', function() {
                dateRangeFilter();
            }).change();
        }
    });

    //---------------- open Dialog ----------------------------------------------------------///
    $(".dialog").dialog({
        autoOpen: false,
        maxWidth: 600,
        maxHeight: 500,
        width: 600,
        height: 500,
        modal: true,
    });
    //------------------  Handle on click events of rows in tables --------------------------------------------------//
    var opts = {
        angle: 0.10, // The length of each line
        lineWidth: 0.14, // The line thickness
        colorStart: '#5CABD3',   // Colors
        colorStop: '#7FBDDC',    // just experiment with them
        strokeColor: '#d3d9df',   // to see which ones work best for you
    };
    $('.personDataTable').on('click', '.opener', function(e) {
        var mi = parseInt($(this).attr("value"));
        $('.sales_value').html("Rs"+mi);
        mi = 110 - parseInt(mi % 100);
        $(".dialog").dialog("open");
        var gaugeOneTarget = document.getElementById('gaugeOne');
        var gaugeOne = new Donut(gaugeOneTarget).setOptions(opts);
        gaugeOne.maxValue = 100;
        gaugeOne.set(mi);
    });   

    //--------------------------  Filter data between two selected Dates Ranges -----------------------------------------------//
    function dateRangeFilter() {
        var from = new Date($("#slider-range").slider("values", 0) * 1000).toDateString();
        var to = new Date($("#slider-range").slider("values", 1) * 1000).toDateString();
        
        var startDate = moment(from).format('YYYY-MM-DD');
        var endDate = moment(to).format('YYYY-MM-DD');

         var $that = $('.productCategory');
                $('.personDataTable').empty();
                $.each(obj, function(i, v) {
                    var t = new Date(v.Date).toDateString();
                    var selectedDate = moment(t).format('YYYY-MM-DD');
                    if ($that.val() == v.Product && ( !(moment(selectedDate).isBefore(startDate)) && !(moment(selectedDate).isAfter(endDate)) )) {
                        var row = $('<tr class="opener" value=" ' + v.Sale + ' "></tr>');
                        $(".personDataTable").append(row);
                        row.append($("<td>" + v.Product + "</td>"));
                        row.append($("<td>" + v.State + "</td>"));
                        row.append($("<td>" + v.Sale + "</td>"));
                        row.append($("<td>" + v.Date + "</td>"));
                        
                    }
        });
    }
    //--------------------- slider for date range selector -----------------------------------------------------------------//
    $("#slider-range").slider({
        range: true,
        min: new Date('2010.01.01').getTime() / 1000,
        max: new Date('2016.01.01').getTime() / 1000,
        step: 86400,
        values: [new Date('2010.01.01').getTime() / 1000, new Date('2016.02.01').getTime() / 1000],
        slide: function(event, ui) {
            $("#amount").val((new Date(ui.values[0] * 1000).toDateString()) + " - " + (new Date(ui.values[1] * 1000)).toDateString());
        }
    });

    $("#amount").val((new Date($("#slider-range").slider("values", 0) * 1000).toDateString()) +
        " - " + (new Date($("#slider-range").slider("values", 1) * 1000)).toDateString());

    $('#slider-range').slider({
        change: function() {
            dateRangeFilter();
        }
    });
});