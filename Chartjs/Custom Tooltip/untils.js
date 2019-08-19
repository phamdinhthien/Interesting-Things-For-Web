
var bgrColor = [];
bgrColor[0] = "aqua";
bgrColor[1] = "green";
Chart.defaults.global.pointHitDetectionRadius = 1;

var customTooltips = function (tooltip) {
    // Tooltip Element 
    var tooltipEl = document.getElementById('chartjs-tooltip');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<table></table>';
        this._chart.canvas.parentNode.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltip.yAlign) {
        tooltipEl.classList.add(tooltip.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
        return bodyItem.lines;
    }

    // Set Text
    if (tooltip.body) {
        var titleLines = tooltip.title || [];
        var bodyLines = tooltip.body.map(getBody);

        var innerHtml = '<thead>';

        titleLines.forEach(function (title) {
            innerHtml += '<tr><th>' + title + '</th></tr>';
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach(function (body, i) {
            var style = 'background:' + bgrColor[i];
            // style += '; border-color:' + bgrColor[i];
            style += '; border-width: 2px';
            var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
            innerHtml += '<tr><td>' + span + body + '</td></tr>';
        });
        innerHtml += '</tbody>';

        var tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;
    }

    var positionY = this._chart.canvas.offsetTop;
    var positionX = this._chart.canvas.offsetLeft;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
    tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
    tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
    tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
};

var moment = moment();
var date = [moment.format('DD/MM/YYYY'), moment.add(1, 'days').format('DD/MM/YYYY'), moment.add(2, 'days').format('DD/MM/YYYY'), moment.add(3, 'days').format('DD/MM/YYYY'), moment.add(4, 'days').format('DD/MM/YYYY'), moment.add(5, 'days').format('DD/MM/YYYY'), moment.add(6, 'days').format('DD/MM/YYYY')]
var lineChartData = {
    labels: date,
    datasets: [{
        label: 'My First dataset',
        fill: false,
        borderColor: "aqua",
        backgroundColor: "aqua",
        data: [2, 5, 3, 1, 5, 6, 3]
    }, {
        label: 'My Second dataset',
        fill: false,
        borderColor: "green",
        backgroundColor: "green",
        data: [1, 5, 3, 4, 1, 6, 2],
        // pointBackgroundColor: "red",
        // pointBorderColor: "red",
        // pointBorderWidth: 1
    }]
};

var options = {
    title: {
        display: true,
        text: 'Chart.js Line Chart - Custom Tooltips',
        fontSize: 20
    },
    scales: {
        xAxes: [{
            ticks: {
                autoSkip: false,
                maxRotation: 60,
                minRotation: 60,
                // fontColor: 'red'
            },
            scaleLabel: {
                display: true,
                labelString: 'Time',
                // fontColor: 'red',
                fontSize: 14
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero: true,
            },
            scaleLabel: {
                display: true,
                labelString: 'Count',
                fontSize: 14
            }
        }]
    },
    tooltips: {
        enabled: false,
        mode: 'index',
        // intersect: false,
        position: 'nearest',
        custom: customTooltips
    }
}

window.onload = function () {
    var chartEl = document.getElementById('chart').getContext('2d');
    chartEl.canvas.width = "100%";
    chartEl.canvas.height = 350;
    window.myLine = new Chart(chartEl, {
        type: 'line',
        data: lineChartData,
        options: options
    });
};