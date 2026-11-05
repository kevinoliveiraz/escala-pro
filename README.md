# EscalaPro — páginas separadas

O projeto usa HTML, CSS e JavaScript puro, sem etapa de compilação. Cada item do menu tem seu próprio HTML, CSS e módulo JavaScript. Os dados ficam no `localStorage`, com a chave `escalapro-standalone-v2`. O sistema inicia sem funcionários, setores, solicitações ou escalas de exemplo. Os turnos Manhã, Tarde e Noite continuam disponíveis para o cadastro.

## Abrir o projeto

Abra `index.html` pelo Live Server do VS Code. Mantenha o mesmo endereço e a mesma porta usados anteriormente para acessar os dados já salvos no navegador. `landing.html` continua sendo a apresentação pública.

## Começar a preencher

Em Funcionários, clique em Adicionar funcionário. No primeiro cadastro, informe também o nome do primeiro setor. Você também pode criar setores pela página Setores. O funcionário salvo aparece na lista e permanece cadastrado ao recarregar a página.

Na primeira abertura após esta atualização, os dados antigos são substituídos por uma base vazia. Uma cópia integral anterior fica guardada no mesmo navegador, na chave `escalapro-standalone-v2-before-empty-start-v1`. Essa limpeza ocorre uma única vez; os novos cadastros são preservados. Em Configurações, Limpar dados volta a uma base vazia.

## Onde editar cada tela

| Tela | HTML | CSS próprio | JavaScript próprio |
|---|---|---|---|
| Escalas | `index.html` | `css/escalas.css` | `js/escalas.mjs` |
| Simulações | `simulacoes.html` | `css/simulacoes.css` | `js/simulacoes.mjs` |
| Solicitações | `solicitacoes.html` | `css/solicitacoes.css` | `js/solicitacoes.mjs` |
| Funcionários | `funcionarios.html` | `css/funcionarios.css` | `js/funcionarios.mjs` |
| Setores | `setores.html` | `css/setores.css` | `js/setores.mjs` |
| Relatórios | `relatorios.html` | `css/relatorios.css` | `js/relatorios.mjs` |
| Configurações | `configuracoes.html` | `css/configuracoes.css` | `js/configuracoes.mjs` |
| Minha escala | `portal.html` | `css/portal.css` | `js/portal.mjs` |
| Minhas solicitações | `minhas-solicitacoes.html` | `css/minhas-solicitacoes.css` | `js/minhas-solicitacoes.mjs` |

Os arquivos `.mjs` são arquivos JavaScript organizados em módulos. Cada HTML carrega somente o módulo da sua tela. Dentro de cada HTML, o elemento `<template id="page-template">` contém a estrutura da página. Os marcadores como `{{cabecalho}}` são preenchidos pelo JavaScript daquela tela.

## Arquivos compartilhados

- `css/base.css`: tema, navegação, botões, formulários e janelas usados em várias telas.
- `js/shared/context.mjs`: dados locais, estado selecionado e endereços das páginas.
- `js/shared/ui.mjs`: menu, elementos visuais e controle das janelas.
- `js/shared/boot.mjs`: inicialização da página e eventos comuns.
- `js/shared/requests.mjs`: formulário de solicitação usado pela gestão e pelo funcionário.
- `js/shared/data-tools.mjs`: exportação CSV, backup e importação JSON.
- `js/shared/pdf-preview.mjs`: prévia do PDF e download após a conferência.
- `js/core.mjs`: regras de escala, folgas, validação, simulação e publicação.
- `js/storage.mjs`: leitura e gravação no navegador.
- `js/schedule-pdf.mjs`: montagem do PDF por turno, com funcionários nas linhas e dias nas colunas.

`js/app.mjs` e `css/style.css` são entradas pequenas de compatibilidade com a página de escalas. Eles não concentram mais as outras telas.

O PDF e as ferramentas de exportação são carregados quando usados. O mês, o setor e a prévia de simulação são preservados na mesma aba durante a navegação entre os arquivos HTML.

## Comentários e CSS

As linhas dos arquivos HTML, CSS e JavaScript possuem comentários breves. O CSS usa aninhamento nativo: `html` abre o contexto e os seletores internos começam com `&`. Não é necessário instalar Sass. Os estilos particulares de uma tela ficam no CSS correspondente; os estilos reutilizados ficam em `base.css`.

## Fluxo da escala

Arraste um funcionário até o dia, escolha Folga ou Plantão e, no plantão, escolha Manhã, Tarde ou Noite. Clicar em um plantão já colocado abre a mesma escolha. O botão PDF abre a prévia; o arquivo só é baixado ao escolher Baixar PDF.

## Conferir os testes

Com Node.js disponível, execute na pasta do projeto:

```powershell
node tests/engine.test.mjs
node tests/pdf.test.mjs
node tests/ui.test.mjs
```

Os testes verificam as regras, a geração do PDF, as nove páginas, os links para HTML reais, a permanência do mês e setor e os fluxos de arraste, marcação individual, simulação, publicação, solicitações, cadastros e configurações.

O projeto continua sendo uma aplicação local: o armazenamento não sincroniza outros dispositivos e a troca de perfil permanece demonstrativa. Use o backup JSON para guardar uma cópia dos dados.
