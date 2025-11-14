// ===== VARIÁVEIS GLOBAIS =====
let graficoLinha, graficoPizza, graficoComparacao;

// ===== LIMPAR FORMULÁRIO AO CARREGAR A PÁGINA =====
window.addEventListener('load', function() {
  document.getElementById('valor').value = '';
  document.getElementById('taxa').value = '';
  document.getElementById('prazo').value = '';
  
  // Esconde a seção de resultado se estiver visível
  document.querySelector('.secao-resultado-completa').classList.add('oculto');
});

// ===== SIMULADOR DE EMPRÉSTIMO =====
document.getElementById('form-simulador').addEventListener('submit', function(e) {
  e.preventDefault();

  const valorInput = document.getElementById('valor').value;
  const taxaInput = document.getElementById('taxa').value;
  const prazo = parseInt(document.getElementById('prazo').value);

  // Limpa os valores (remove pontos, vírgulas e R$)
  const valor = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));
  const taxa = parseFloat(taxaInput.replace(',', '.')) / 100;

  if (isNaN(valor) || isNaN(taxa) || isNaN(prazo) || valor <= 0 || taxa <= 0 || prazo <= 0) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  // Cálculo da parcela (Tabela Price)
  const parcela = valor * (taxa * Math.pow(1 + taxa, prazo)) / (Math.pow(1 + taxa, prazo) - 1);
  const totalPago = parcela * prazo;
  const totalJuros = totalPago - valor;

  // total da amortização
  let totalAmortizacao = 0;
  let saldo = valor;
  for (let i = 1; i <= prazo; i++) {
    const jurosMes = saldo * taxa;
    const amortizacao = parcela - jurosMes;
    totalAmortizacao += amortizacao; // Soma a amortização do mês
    saldo -= amortizacao;
    if (saldo < 0) saldo = 0;
  }

  // Exibe resultado
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    <p><strong>Valor da Parcela:</strong> R$ ${parcela.toFixed(2)}</p>
    <p><strong>Total a Pagar:</strong> R$ ${totalPago.toFixed(2)}</p>
    <p><strong>Total de Juros:</strong> R$ ${totalJuros.toFixed(2)}</p>
    <p><strong>Total de Amortização:</strong> R$ ${totalAmortizacao.toFixed(2)}</p>
  `;

  // Mostra a seção de resultado
  document.querySelector('.secao-resultado-completa').classList.remove('oculto');

  // Gera os gráficos
  gerarGraficos(valor, totalJuros, taxa, prazo);

  // Scroll suave até o resultado
  setTimeout(() => {
    document.querySelector('.secao-resultado-completa').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
});

// ===== FORMATAÇÃO DE INPUTS =====
document.getElementById('valor').addEventListener('input', function(e) {
  let valor = e.target.value.replace(/\D/g, '');
  //valor = (valor / 100).toFixed(2);
  valor = valor.replace('.', ',');
  valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  e.target.value = valor;
});

document.getElementById('taxa').addEventListener('input', function(e) {
  let valor = e.target.value.replace(/[^\d,]/g, '');
  e.target.value = valor;
});

// ===== TOOLTIP DO BOTÃO DE AJUDA =====
const taxaInfoBtn = document.getElementById('taxa-info');
const tooltip = document.getElementById('tooltip');

taxaInfoBtn.addEventListener('mouseenter', function(e) {
  const rect = taxaInfoBtn.getBoundingClientRect();
  const formRect = document.querySelector('.hero-simulador form').getBoundingClientRect();
  
  tooltip.style.position = 'absolute';
  tooltip.style.left = '0';
  tooltip.style.top = '100%';
  tooltip.style.marginTop = '5px';
  tooltip.classList.add('show');
});

taxaInfoBtn.addEventListener('mouseleave', function(e) {
  // Pequeno delay para permitir que o mouse entre no tooltip se necessário
  setTimeout(() => {
    tooltip.classList.remove('show');
  }, 100);
});

// Mantém o tooltip visível quando o mouse está sobre ele
tooltip.addEventListener('mouseenter', function() {
  tooltip.classList.add('show');
});

tooltip.addEventListener('mouseleave', function() {
  tooltip.classList.remove('show');
});

// ===== FUNÇÃO PARA GERAR GRÁFICOS =====
function gerarGraficos(valor, totalJuros, taxa, prazo) {
  // Destrói gráficos anteriores se existirem
  if (graficoLinha) graficoLinha.destroy();
  if (graficoPizza) graficoPizza.destroy();

  // Calcula os valores
  const parcela = valor * (taxa * Math.pow(1 + taxa, prazo)) / (Math.pow(1 + taxa, prazo) - 1);
  //const totalPago = parcela * prazo;

  // Gráfico de Linha - Evolução dos Valores do Empréstimo
  const ctxLinha = document.getElementById('graficoLinha').getContext('2d');
  const dadosEvolucao = calcularEvolucaoValores(valor, taxa, prazo, parcela);

  // Criar gradientes para as linhas
  const gradienteAmortizacao = ctxLinha.createLinearGradient(0, 0, 0, 350);
  gradienteAmortizacao.addColorStop(0, 'rgba(0, 184, 148, 0.35)');
  gradienteAmortizacao.addColorStop(1, 'rgba(0, 184, 148, 0.05)');

  const gradienteSaldoDevedor = ctxLinha.createLinearGradient(0, 0, 0, 350);
  gradienteSaldoDevedor.addColorStop(0, 'rgba(99, 110, 114, 0.25)');
  gradienteSaldoDevedor.addColorStop(1, 'rgba(99, 110, 114, 0.05)');

  const gradienteJuros = ctxLinha.createLinearGradient(0, 0, 0, 350);
  gradienteJuros.addColorStop(0, 'rgba(214, 48, 49, 0.25)');
  gradienteJuros.addColorStop(1, 'rgba(214, 48, 49, 0.05)');

  graficoLinha = new Chart(ctxLinha, {
    type: 'line',
    data: {
      labels: dadosEvolucao.meses,
      datasets: [
        {
          label: `Amortizações: R$ ${dadosEvolucao.amortizacoes[dadosEvolucao.amortizacoes.length - 1].toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
          data: dadosEvolucao.amortizacoes,
          borderColor: '#00B894',
          backgroundColor: gradienteAmortizacao,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00B894',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#00B894',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3
        },
        {
          label: `Saldo Devedor: R$ ${dadosEvolucao.saldosDevedores[0].toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
          data: dadosEvolucao.saldosDevedores,
          borderColor: '#636E72',
          backgroundColor: gradienteSaldoDevedor,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#636E72',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#636E72',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3
        },
        {
          label: `Juros Mensais: R$ ${dadosEvolucao.jurosMensais[0].toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
          data: dadosEvolucao.jurosMensais,
          borderColor: '#D63031',
          backgroundColor: gradienteJuros,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#D63031',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#D63031',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          bottom: 10,
          left: 10,
          right: 10
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Evolução dos Valores do Empréstimo',
          font: {
            size: 17,
            weight: 'bold',
            family: "'Segoe UI', 'Inter', sans-serif"
          },
          color: '#0F172A',
          padding: {
            top: 10,
            bottom: 25
          }
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: { 
              size: 13, 
              weight: '600',
              family: "'Segoe UI', 'Inter', sans-serif"
            },
            color: '#1E293B',
            padding: 18,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 10,
            boxHeight: 10
          }
        },
        tooltip: {
          backgroundColor: 'rgba(13, 24, 42, 0.95)',
          titleFont: { 
            size: 14, 
            family: "'Segoe UI', 'Inter', sans-serif", 
            weight: 'bold' 
          },
          bodyFont: { 
            size: 13, 
            family: "'Segoe UI', 'Inter', sans-serif" 
          },
          padding: 14,
          cornerRadius: 10,
          displayColors: true,
          boxWidth: 12,
          boxHeight: 12,
          boxPadding: 6,
          callbacks: {
            label: function(context) {
              const labelLimpo = context.dataset.label.replace(/: R\$.*$/, '');

              if (labelLimpo.includes('juros')){
                const jurosTotal = dadosEvolucao.totaisJuros[context.dataIndex];
                return `Juros total: R$ ${jurosTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
              }
              
              return `${labelLimpo}: R$ ${context.parsed.y.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toLocaleString('pt-BR');
            },
            font: {
              size: 12,
              family: "'Segoe UI', 'Inter', sans-serif",
              weight: '500'
            },
            color: '#94A3B8',
            padding: 10
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.12)',
            drawBorder: false,
            lineWidth: 1
          },
          border: {
            display: false
          }
        },
        x: {
          ticks: {
            font: {
              size: 11,
              family: "'Segoe UI', 'Inter', sans-serif",
              weight: '500'
            },
            color: '#64748B',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10
          },
          grid: {
            display: false
          },
          border: {
            display: false
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      }
    }
  });

  // Gráfico de Pizza - Valor Emprestado vs Juros
  const ctxPizza = document.getElementById('graficoPizza').getContext('2d');

  graficoPizza = new Chart(ctxPizza, {
    type: 'doughnut',
    data: {
      labels: [
        `Valor Emprestado: R$ ${valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, `Total de Juros: R$ ${totalJuros.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
      ],
      datasets: [{
        data: [valor, totalJuros],
        backgroundColor: ['#0D182A', '#D63031'],
        borderWidth: 4,
        borderColor: '#fff',
        hoverBorderWidth: 5,
        hoverBorderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          bottom: 10
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { 
              size: 13, 
              weight: 'bold', 
              family: "'Segoe UI', 'Inter', sans-serif" 
            },
            padding: 18,
            color: '#1E293B',
            boxWidth: 20,
            boxHeight: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(13, 24, 42, 0.95)',
          titleFont: { 
            size: 14, 
            family: "'Segoe UI', 'Inter', sans-serif" 
          },
          bodyFont: { 
            size: 13, 
            family: "'Segoe UI', 'Inter', sans-serif" 
          },
          padding: 14,
          cornerRadius: 10,
          callbacks: {
            label: function(context) {
              const labelLimpo = context.label.replace(/: R\$.*$/, '');
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${labelLimpo}: R$ ${context.parsed.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
        easing: 'easeInOutQuart'
      }
    }
  });
}

// ===== FUNÇÃO AUXILIAR - CALCULAR EVOLUÇÃO DOS VALORES =====
function calcularEvolucaoValores(valor, taxa, prazo, parcela) {
  const meses = [];
  const amortizacoes = [];
  const jurosMensais = [];
  const totaisJuros = [];
  const saldosDevedores = [];
  
  let saldo = valor;
  let totalPagoAcumulado = 0;
  let totalJurosAcumulado = 0;

  for (let i = 1; i <= prazo; i++) {
    
    // Calcula juros do mês
    const jurosMes = saldo * taxa;
    const amortizacao = parcela - jurosMes;
    
    // Atualiza saldo
    saldo -= amortizacao;
    if (saldo < 0) saldo = 0;
    
    // Acumula valores
    totalPagoAcumulado += parcela;
    totalJurosAcumulado += jurosMes;

    meses.push(`Mês ${i}`);
    amortizacoes.push(parseFloat(amortizacao.toFixed(2)));
    jurosMensais.push(parseFloat(jurosMes.toFixed(2)));
    totaisJuros.push(parseFloat(totalJurosAcumulado.toFixed(2)));
    saldosDevedores.push(parseFloat(saldo.toFixed(2)));
  }

  return { meses, amortizacoes, jurosMensais, totaisJuros, saldosDevedores };
}

// ===== GRÁFICO DE COMPARAÇÃO DE TAXAS =====
window.addEventListener('load', function() {
  const ctxComparacao = document.getElementById('graficoComparacao');
  
  if (!ctxComparacao) return;

  const ctx = ctxComparacao.getContext('2d');

  // Gradientes para as barras
  const gradiente1 = ctx.createLinearGradient(0, 0, 0, 400);
  gradiente1.addColorStop(0, '#1a2332');
  gradiente1.addColorStop(1, '#0D182A');

  const gradiente2 = ctx.createLinearGradient(0, 0, 0, 400);
  gradiente2.addColorStop(0, '#6B7A8F');
  gradiente2.addColorStop(1, '#4A5568');

  const gradiente3 = ctx.createLinearGradient(0, 0, 0, 400);
  gradiente3.addColorStop(0, '#A0AEC0');
  gradiente3.addColorStop(1, '#718096');

  graficoComparacao = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Consignado INSS¹', 'Empréstimo Pessoal²', 'Cartão de Crédito²'],
      datasets: [{
        data: [1.85, 7.04, 15.46],
        backgroundColor: [gradiente1, gradiente2, gradiente3],
        borderRadius: 30,
        borderSkipped: false,
        barThickness: 110,
        maxBarThickness: 120
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 70,
          bottom: 30,
          left: 30,
          right: 30
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 18,
          ticks: {
            stepSize: 6,
            callback: function(value) {
              return value + '%';
            },
            font: {
              size: 12,
              family: "'Segoe UI', 'Inter', sans-serif",
              weight: '500'
            },
            color: '#94A3B8',
            padding: 12
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)',
            drawBorder: false,
            lineWidth: 1
          },
          border: {
            display: false,
            dash: [5, 5]
          }
        },
        x: {
          ticks: {
            font: {
              size: 13,
              family: "'Segoe UI', 'Inter', sans-serif",
              weight: '700'
            },
            color: '#1E293B',
            padding: 18
          },
          grid: {
            display: false
          },
          border: {
            display: false
          }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    },
    plugins: [{
      id: 'customLabels',
      afterDatasetsDraw: function(chart) {
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        
        meta.data.forEach((bar, index) => {
          const data = chart.data.datasets[0].data[index];
          
          ctx.save();
          
          // Desenha o valor principal
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 26px "Segoe UI", "Inter", sans-serif';
          
          const x = bar.x;
          const y = bar.y - 30;
          
          ctx.fillText(data.toFixed(2).replace('.', ',') + '%', x, y);
          
          // Desenha "a.m" abaixo
          ctx.font = '600 11px "Segoe UI", "Inter", sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.textBaseline = 'top';
          ctx.fillText('a.m', x, y + 5);
          
          ctx.restore();
        });
      }
    }]
  });
});

// ===== CARROSSEL DE VANTAGENS =====
const btnAnterior = document.querySelector('.btn-anterior');
const btnProximo = document.querySelector('.btn-proximo');
const containerVantagens = document.querySelector('.container-vantagens');

if (btnAnterior && btnProximo && containerVantagens) {
  const scrollStep = 340;

  btnProximo.addEventListener('click', () => {
    containerVantagens.scrollBy({ left: scrollStep, behavior: 'smooth' });
  });

  btnAnterior.addEventListener('click', () => {
    containerVantagens.scrollBy({ left: -scrollStep, behavior: 'smooth' });
  });

  // ===== ARRASTAR COM O MOUSE =====
  let isDown = false;
  let startX;
  let scrollLeft;

  containerVantagens.addEventListener('mousedown', (e) => {
    isDown = true;
    containerVantagens.style.cursor = 'grabbing';
    startX = e.pageX - containerVantagens.offsetLeft;
    scrollLeft = containerVantagens.scrollLeft;
  });

  containerVantagens.addEventListener('mouseleave', () => {
    isDown = false;
    containerVantagens.style.cursor = 'grab';
  });

  containerVantagens.addEventListener('mouseup', () => {
    isDown = false;
    containerVantagens.style.cursor = 'grab';
  });

  containerVantagens.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - containerVantagens.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do arrasto
    containerVantagens.scrollLeft = scrollLeft - walk;
  });
}

// ===== CARROSSEL DE GRÁFICOS =====
const btnGraficoAnterior = document.querySelector('.btn-grafico-anterior');
const btnGraficoProximo = document.querySelector('.btn-grafico-proximo');
const slides = document.querySelectorAll('.grafico-slide');
const indicadores = document.querySelectorAll('.indicador');
let slideAtual = 0;

function mostrarSlide(index) {
  slides.forEach(slide => slide.classList.remove('ativo'));
  indicadores.forEach(ind => ind.classList.remove('ativo'));
  
  slides[index].classList.add('ativo');
  indicadores[index].classList.add('ativo');
}

if (btnGraficoProximo) {
  btnGraficoProximo.addEventListener('click', () => {
    slideAtual = (slideAtual + 1) % slides.length;
    mostrarSlide(slideAtual);
  });
}

if (btnGraficoAnterior) {
  btnGraficoAnterior.addEventListener('click', () => {
    slideAtual = (slideAtual - 1 + slides.length) % slides.length;
    mostrarSlide(slideAtual);
  });
}

indicadores.forEach((indicador, index) => {
  indicador.addEventListener('click', () => {
    slideAtual = index;
    mostrarSlide(slideAtual);
  });
});

// ===== ACCORDION =====
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const wasActive = item.classList.contains('ativo');
    
    // Fecha todos os outros
    accordionHeaders.forEach(h => {
      h.parentElement.classList.remove('ativo');
    });
    
    // Abre o clicado (se não estava ativo)
    if (!wasActive) {
      item.classList.add('ativo');
    }
  });
});

// ===== SMOOTH SCROLL PARA LINKS DO MENU =====
document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ====== BARRA DE PROGRESSO DE ROLAGEM ======
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('progressBar');
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
  
  if (progressBar) {
    progressBar.style.width = scrollPercentage + '%';
  }
});

