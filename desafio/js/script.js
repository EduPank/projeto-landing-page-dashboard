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
      const total = valores.reduce((a,b)=>a+b,0);
      const legendEl = document.getElementById('chartLegend');
      redes.forEach((r,i) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="swatch" style="background:${r.color}"></span>
          <span class="label">${r.name}</span>
          <span class="value">${valores[i].toLocaleString()} (${((valores[i]/total)*100).toFixed(1)}%)</span>`;
        legendEl.appendChild(li);
      });
    });
  
        