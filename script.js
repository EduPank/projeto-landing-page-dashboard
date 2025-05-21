document.addEventListener('DOMContentLoaded', function() {
    // Gráfico de Matrículas (Doughnut)
    const matriculasCtx = document.getElementById('matriculasChart').getContext('2d');
    new Chart(matriculasCtx, {
        type: 'doughnut',
        data: {
            labels: ['Federal', 'Estadual', 'Municipal', 'Privada'],
            datasets: [{
                data: [383522, 14052850, 23134718, 9517832],
                backgroundColor: [
                    '#0E2C5D',
                    '#82cbf5',
                    '#006aff',
                    '#a7f3f6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 20
                    }
                }
            }
        }
    });

    // Gráfico de Docentes (Barra com bordas arredondadas)
const docentesCtx = document.getElementById('docentesChart').getContext('2d');
new Chart(docentesCtx, {
    type: 'bar',
    data: {
        labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [{
            label: 'Número de docentes',
            data: [2192224, 2226423, 2212018, 2189005, 2190943, 2315616, 2354194, 2367777],
            backgroundColor: '#3498db',
            borderRadius: 12, // Bordas arredondadas
            borderSkipped: false, // Aplica borda redonda em todos os lados
            barThickness: 30 // Largura das barras
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Oculta a legenda
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.raw.toLocaleString(); // Formata com separadores de milhar
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false // Remove linhas de grade verticais
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: '#e0e0e0' // Cor mais suave para as linhas de grade
                },
                ticks: {
                    callback: function(value) {
                        return (value / 1000000).toFixed(1) + 'M'; // Converte para milhões
                    }
                }
            }
        }
    }
});

     // Gráfico de Escolas (Pie)
     const escolasCtx = document.getElementById('escolasChart').getContext('2d');
     new Chart(escolasCtx, {
         type: 'doughnut',
         data: {
             labels: ['Urbana', 'Rural'],
             datasets: [{
                 data: [71.4, 28.6],
                 backgroundColor: [
                     '#006aff',
                     '#82cbf5'
                 ],
                 borderWidth: 0
             }]
         },
         options: {
            cutout: '70%',
             plugins: {
                 legend: {
                     position: 'bottom'
                 }
             }
         }
     });

    // Gráfico de Gestores (Bar)
    const gestoresCtx = document.getElementById('gestoresChart').getContext('2d');
    new Chart(gestoresCtx, {
        type: 'bar',
        data: {
            labels: ['2019', '2023'],
            datasets: [
                {
                    label: 'Ensino superior completo',
                    data: [84.4, 69.1],
                    backgroundColor: '#3498db'
                },
                {
                    label: 'Ensino médio completo',
                    data: [16.1, 19.1],
                    backgroundColor: '#a7f3f6'
                }
            ]
        },
        options: {
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
});