# Validação técnica — reconstrução estática

- Nenhuma dependência remota em `index.html` e `landing.html`.
- HTML carrega CSS e scripts através de caminhos relativos (compatível com Live Server).
- `js/core.mjs` é importável isoladamente por Node.js, sem DOM.
- Arquivos são servidos por HTTP local usando `python -m http.server` somente como servidor estático.
- Testes automatizados executados com `node --test tests/*.test.mjs`.
- **Limitação do ambiente de QA:** o Chromium do ambiente de execução utiliza uma política administrativa que bloqueia a navegação para URLs, inclusive `localhost`; por isso a inspeção visual automatizada real no browser não pôde ser executada aqui. Os testes de navegação foram executados com DOM simulado e o HTTP local foi verificado via solicitações reais. Recomenda-se abrir pelo Live Server e revisar visualmente no computador do usuário.
