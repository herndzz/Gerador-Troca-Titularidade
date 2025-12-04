# Gerador de Carta de Alteração de Titularidade

Um site simples para coletar dados e gerar um PDF com a carta de alteração de titularidade em formato genérico.

## Como usar

1. Abra o arquivo `index.html` no navegador (clique duas vezes nele no Windows).
2. Preencha todos os campos do formulário.
3. Clique em "Prever Carta" para atualizar a prévia.
4. Clique em "Gerar PDF" para baixar o arquivo `carta-alteracao-titularidade.pdf`.

## Observações

- O PDF é gerado a partir da prévia usando `html2canvas` + `jsPDF`.
- Os campos de CPF/RG não possuem máscara obrigatória; você pode digitar com pontos e traços conforme desejar.
