# SimulaCred – Simulador de Crédito Consignado
O SimulaCred é uma aplicação web desenvolvida para facilitar a simulação de crédito consignado de forma clara, rápida e visual. O sistema permite ao usuário inserir valor, taxa de juros e prazo, exibindo automaticamente os resultados do cálculo, tabelas e gráficos para comparação.

Este projeto foi construído utilizando HTML, CSS e JavaScript, com foco em usabilidade, acessibilidade e experiência do usuário.

## Funcionalidades Principais
✔️ Simulação completa com valor, taxa e prazo

✔️ Cálculo automático da parcela via fórmula de juros compostos

✔️ Exibição de resultados detalhados

✔️ Gráficos interativos (linha e pizza) com Chart.js

✔️ Carrossel de gráficos

✔️ Tooltip explicativo de juros

✔️ Barra de progresso de rolagem

✔️ Componentes interativos (accordion, carrossel, destaque visual)

✔️ Responsividade para dispositivos móveis

## Tecnologias Utilizadas
### HTML5
Estrutura semântica da aplicação com seções organizadas:

- Menu fixo
- Banner com simulador
- Formulário de entrada
- Área de resultado
- Gráficos
- Sessões informativas (“como funciona”, “vantagens”, “dicas de segurança”).

### CSS3
Estilização completa com:
- Sistema de cores via :root
- Design responsivo
- Animações e efeitos (hover, carrosséis, fade-in, floating effect)
- Sombras, transições e gradientes
- Acessibilidade com foco visual (:focus).

### JavaScript
Responsável pela lógica e interatividade:
- Cálculo das parcelas usando juros compostos
- Formatação dos valores de entrada
- Exibição dinâmica do resultado
- Geração dos gráficos com Chart.js
- Controle do carrossel de gráficos
- Tooltip de ajuda
- Accordion de segurança
- Barra de progresso da página
  
## Lógica de Cálculo
A aplicação utiliza a fórmula de sistema de amortização Price: `PMT = PV * i / (1 - (1 + i)^(-n))`

Onde:
- PMT = valor da parcela
- PV = valor do empréstimo
- i = taxa de juros mensal
- n = número de parcelas

## Estrutura de Pastas
SimulaCred/

│── index.html

│── style.css

│── script.js

│── /img

│── README.md

## Recursos de Design
1. Interface moderna com gradientes e sombras suaves
2. Tipografia: Inter e Poppins
3. Paleta focada em tons de azul para confiança e clareza
4. Cartões, ícones, steps e layouts responsivos

## Responsividade
O layout se adapta automaticamente para:
- Desktop
- Tablets
- Smartphones
Com ajustes de fonte, grid, carrossel e reorganização de colunas.

## Como Executar
1. Baixe o repositório
2. Abra o arquivo index.html em qualquer navegador
3. O simulador já estará totalmente funcional

## Biblioteca Utilizada
Chart.js CDN para gráficos interativos.

## Desenvolvido por
- Adriano Ferreira
- Giovanna Silva Ribeiro
- Samille Soares
