document.getElementById('form-simulador').addEventListener('submit', function(event) {
  event.preventDefault();

  const valor = parseFloat(document.getElementById('valor').value);
  const taxa = parseFloat(document.getElementById('taxa').value) / 100;
  const prazo = parseInt(document.getElementById('prazo').value);

  const parcela = (valor * taxa) / (1 - Math.pow(1 + taxa, -prazo));
  const totalPago = parcela * prazo;
  const totalJuros = totalPago - valor;

  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = `
    <h2>Resultado da Simulação</h2>
    <p>Parcela mensal: <strong>R$ ${parcela.toFixed(2)}</strong></p>
    <p>Total pago: <strong>R$ ${totalPago.toFixed(2)}</strong></p>
    <p>Total de juros: <strong>R$ ${totalJuros.toFixed(2)}</strong></p>
  `;
});
