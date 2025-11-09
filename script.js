let graficoLinha = null;
let graficoPizza = null;

// === FORMATAÇÃO DO CAMPO VALOR ===
const inputValor = document.getElementById('valor');

// Formata com ponto nos milhares, sem limite
inputValor.addEventListener('input', function (e) {
  let valor = e.target.value;

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, '');

  if (valor === '') {
    e.target.value = '';
    return;
  }

  // Converte para número e formata com ponto como separador de milhar
  e.target.value = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
});

// === CÁLCULO DO EMPRÉSTIMO ===
document.getElementById('form-simulador').addEventListener('submit', function(event) {
  event.preventDefault();

  // Converte o valor (com pontos) para número
  const valor = parseFloat(document.getElementById('valor').value.replace(/\./g, ''));
  const taxa = parseFloat(document.getElementById('taxa').value.replace(',', '.')) / 100;
  const prazo = parseInt(document.getElementById('prazo').value);

  // Cálculos
  const parcela = (valor * taxa) / (1 - Math.pow(1 + taxa, -prazo));
  const totalPago = parcela * prazo;
  const totalJuros = totalPago - valor;

  // Mostra resultado formatado com vírgula e 2 casas decimais
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = `
    <h2>Resultado da Simulação</h2>
    <p>Parcela mensal: <strong>R$ ${parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
    <p>Total pago: <strong>R$ ${totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
    <p>Total de juros: <strong>R$ ${totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
  `;
  // Array para os gráficos
  const parcelaMensal = Array(prazo).fill(parcela);
  const totais = parcelaMensal.map((_, i) => parcela * (i + 1));
  const juros = totais.map(t => t - (valor * (t / totalPago)));

  //<!-- Gráfico de Linha -->
  const ctxLinha = document.getElementById('graficoLinha');

  if (graficoLinha) grafico.destroy();

  graficoLinha = new Chart(ctxLinha, {
    type: 'line',
    data: {
      labels: Array.from({ length: prazo}, (_, i) => `Mês ${i+1}`),
      datasets: [
        {
          label: 'Parcela Mensal (R$)',
          data: parcelaMensal,
          fill: false,
          borderColor: '#36A2EB',
          tension: 0.2
        },
        {
          label: 'Total Pago (R$)',
          data: totais,
          borderColor: '#4BC0C0',
          backgroundColor: '#4BC0C033',
          fill: false,
          tension: 0.2
        },
        {
          label: 'Total de Juros (R$)',
          data: juros,
          borderColor: '#FF6384',
          backgroundColor: '#FF638433',
          fill: false,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Evolução dos Valores do Empréstimo'
        },
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {display: true, text: 'Valor (R$)'}
        },
        x: {
          title: {display: true, text: 'Meses'}
        }
      }
    }
  });

  //<!-- Gráfico de Pizza -->
  const ctxPizza = document.getElementById('graficoPizza');

  if (graficoPizza) grafico.destroy();

  graficoPizza = new Chart(ctxPizza, {
    type: 'pie',
    data: {
      labels: ['Valor Emprestado', 'Juros Totais'],
      datasets: [
        {
          data: [valor, totalJuros],
          backgroundColor: ['#36A2EB', '#FF6384'],
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Composição do Total Pago'
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
});


// === TOOLTIP DE AJUDA (❓) ===
const infoBtn = document.getElementById('taxa-info');
const tooltip = document.getElementById('tooltip');

infoBtn.addEventListener('click', () => {
  tooltip.classList.toggle('show');

  // posiciona o tooltip abaixo do botão
  const rect = infoBtn.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
});

// fecha o tooltip ao clicar fora
document.addEventListener('click', (e) => {
  if (!infoBtn.contains(e.target) && !tooltip.contains(e.target)) {
    tooltip.classList.remove('show');
  }
});

