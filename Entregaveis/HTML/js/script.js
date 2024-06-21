$(document).ready(function() {
    // Initialize variables
    var ctx = document.getElementById('graficoDados').getContext('2d');
    var grafico;
    var dataUrl = 'https://raw.githubusercontent.com/ciblele/Siemens-Energy/main/Entregaveis/dados_1718915601.json';
    var categorias = [];

    // Fetch JSON data
    $.getJSON(dataUrl, function(data) {
        // Process JSON data
        var labels = data.map(function(item) {
            return item.fabricante;
        });

        var values = data.map(function(item) {
            return item.pressao;
        });

        categorias = data.map(function(item) {
            return item.status;
        });

        // Create initial chart
        grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.sort(),
                datasets: [{
                    label: 'Pressão',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
					borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
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

        var categoriasUnicas = [...new Set(categorias.sort())];
        var filtroSelect = $('#filtros-categoria');
        categoriasUnicas.forEach(function(categoria) {
            filtroSelect.append('<option value="' + categoria + '">' + categoria + '</option>');
        });

        $('#filtros-categoria').change(function() {
            var categoriaEscolhida = $(this).val();
            var labelsFiltrados = [];
            var valoresFiltrados = [];

            if (categoriaEscolhida === '') {
                labelsFiltrados = labels;
                valoresFiltrados = values;
            } else {
                data.forEach(function(item) {
                    if (item.status === categoriaEscolhida) {
                        labelsFiltrados.push(item.fabricante);
                        valoresFiltrados.push(item.pressao);
                    }
                });
            }

            // Update chart data
            grafico.data.labels = labelsFiltrados.sort();
            grafico.data.datasets[0].data = valoresFiltrados;
            grafico.update();
        });
    });
});
