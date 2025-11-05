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
