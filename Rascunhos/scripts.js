document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('temperatureChart').getContext('2d');

    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Temperatura (°C)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: [15, 18, 20, 22, 25, 28]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});

//Cibele:
//teste apenas para ver como funciona o charts.js