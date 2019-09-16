$(document).ready(function() {

    fetch();

    function fetch()
    {
        $.ajax({
            url: "fetch.php",
            method: "POST",
            success: function(response)
            {
                google.charts.load('current', {packages: ["corechart", "bar"]});
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
                    $response = JSON.parse(response);
                    let data = [];
                    let header = ["", "", { role: "style" }];
                    data.push(header);
                    $total_votes = 0;
                    $.each($response, function( key, value ) {
                        $total_votes += value;
                    });
                    $.each($response, function( key, value ) {
                        let temp = [];
                        temp.push(key);
                        temp.push(value);
                        temp.push("#364c5a");
                        data.push(temp);
                    });
                    let chartdata = new google.visualization.arrayToDataTable(data);
                    let groupData = google.visualization.data.group(
                        chartdata,
                        [{column: 0, modifier: function () {return 'total'}, type:'string'}],
                        [{column: 1, aggregation: google.visualization.data.sum, type: 'number'}]
                    );
                    let formatPercent = new google.visualization.NumberFormat({
                        pattern: '#,##0.0%'
                    });
                    let view = new google.visualization.DataView(chartdata);
                    view.setColumns([0, 1, {
                        calc: function (dt, row) {
                            return formatPercent.formatValue(dt.getValue(row, 1) / groupData.getValue(0, 1));
                        },
                        type: "string",
                        role: "annotation" }, 2]);

                    let options = {
                        bar: {groupWidth: "80%"},
                        chartArea: { width: "35%" },
                        color: "#364c5a",
                        fontSize: 18,
                        fontName: "Georgia",
                        hAxis: { title: "Votes per option" },
                        italic: true,
                        legend: { position: "none" },
                        title: "Poll results",
                        titleTextStyle: {
                            color: "#364c5a",
                            fontName: "Georgia",
                            fontSize: 24,
                            bold: true,
                            italic: true
                        },
                    };

                    let chart = new google.visualization.BarChart(document.getElementById("poll-result"));
                    chart.draw(view, options);

                    window.onload = drawChart;
                    window.onresize = drawChart;
                }
            }
        });
    }

    $("#poll-form").on("submit", function(event) {
        event.preventDefault();
        let option = "";
        $(".option").each(function() {
            if ($(this).is(":checked"))
            {
                option = $(this).val();
            }
        });
        if(option)
        {
            $("#submit").prop("disabled", false);
            $.ajax({
                url: "add.php",
                method: "POST",
                data: { option },
                success:function(response)
                {
                    $("#submit").prop("disabled", true);
                    fetch();
                }
            });
        }
        else
        {
            alert("Please select an option");
        }
    });

});