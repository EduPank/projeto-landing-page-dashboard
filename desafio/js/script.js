document.addEventListener('DOMContentLoaded', async () => {
  // Dark mode toggle
  const toggle = document.getElementById('darkModeToggle');
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('night-mode', toggle.checked);
  });

  // Chart setup (cores já definidas anteriormente)
  const totRes = await fetch('https://simcaq.c3sl.ufpr.br/api/v1/enrollment?dims=state&filter=state:21');
  const totData = (await totRes.json()).result;
  const lastYear = Math.max(...totData.map(r => r.year));
  const redes = [
    { id: 1, name: 'Federal', color: '#717171' },
    { id: 2, name: 'Estadual', color: '#48BFFF' },
    { id: 3, name: 'Municipal', color: '#0851C5' },
    { id: 4, name: 'Privada', color: '#B5E5FF' }
  ];
  const valores = await Promise.all(redes.map(async rede => {
    const res = await fetch(
      `https://simcaq.c3sl.ufpr.br/api/v1/enrollment?filter=state:21,adm_dependency:${rede.id},year:${lastYear}`
    );
    const rec = (await res.json()).result[0];
    return rec ? Number(rec.total) : 0;
  }));
  const ctx = document.getElementById('donutChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: redes.map(r => r.name),
      datasets: [{
        data: valores,
        backgroundColor: redes.map(r => r.color),
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      plugins: { legend: { display: false } },
      maintainAspectRatio: false
    }
  });
  const total = valores.reduce((a, b) => a + b, 0);
  const legendEl = document.getElementById('chartLegend');
  redes.forEach((r, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
          <span class="swatch" style="background:${r.color}"></span>
          <span class="label">${r.name}</span>
          <span class="value">${valores[i].toLocaleString()} (${((valores[i] / total) * 100).toFixed(1)}%)</span>`;
    legendEl.appendChild(li);
  });


  // Daados do número de docentes
  const url = "https://simcaq.c3sl.ufpr.br/api/v1/teacher?filter=state:21";
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const anos = data.result.map(item => item.year);
      const totais = data.result.map(item => item.total);

      const ctx = document.getElementById("graficoDocentesAno").getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: anos,
          datasets: [{
            label: "Total de docentes no Maranhão",
            data: totais,
            backgroundColor: "#0851C5",
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
            datalabels: {
              color: '#fff',
              anchor: 'center',
              align: 'center',
              rotation: -90, // gira o texto para ficar deitado
              font: {
                weight: 'bold',
                size: 11
              },
              formatter: function (value) {
                return value.toLocaleString(); // formata número com separador
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        plugins: [ChartDataLabels] // plugin de legenda nas barras do gráfico
      });

    })
    .catch(error => {
      console.error("Erro ao buscar dados:", error);
    });

// Gráfico de População do Maranhão
try {
  const resposta = await fetch("https://simcaq.c3sl.ufpr.br/api/v1/population?filter=state:21");
  const dados = await resposta.json();
  const resultados = dados.result;

  const anos = resultados.map(item => item.year);
  const populacoes = resultados.map(item => item.total);

  const ctxPop = document.getElementById("graficoPopulacao").getContext("2d");

  new Chart(ctxPop, {
    type: 'line',
    data: {
      labels: anos,
      datasets: [{
        label: 'População',
        data: populacoes,
        borderColor: '#006AFF',
        backgroundColor: 'rgba(0, 106, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#006AFF'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
          }
        },
        title: {
          display: false,
          text: 'Evolução da População do Maranhão (2010–2020)',
          font: { size: 18 }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return value.toLocaleString('pt-BR');
            }
          }
        }
      }
    }
  });
} catch (erro) {
  console.error("Erro ao carregar dados da população:", erro);
}


});

