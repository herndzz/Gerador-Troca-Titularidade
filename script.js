// Update preview and generate PDF
(function() {
  const MODE = {
    PF_PF: 'pf-pf',
    PJ_PJ: 'pj-pj',
    PJ_PF: 'pj-pf',
    PF_PJ: 'pf-pj'
  };

  const ids = {
    dataLocal: 'dataLocal',
    destinatario: 'destinatario',
    nomeTitularAtual: 'nomeTitularAtual',
    rgTitularAtual: 'rgTitularAtual',
    cpfTitularAtual: 'cpfTitularAtual',
    logradouro: 'logradouro',
    numero: 'numero',
    complemento: 'complemento',
    bairro: 'bairro',
    cidade: 'cidade',
    nomeNovoTitular: 'nomeNovoTitular',
    rgNovoTitular: 'rgNovoTitular',
    cpfNovoTitular: 'cpfNovoTitular'
  };

  const map = {
    dataLocal: ['previewDataLocal'],
    destinatario: ['pDestinatario'],
    nomeTitularAtual: ['pNomeTitularAtual', 'aNomeTitularAtual'],
    rgTitularAtual: ['pRgTitularAtual'],
    cpfTitularAtual: ['pCpfTitularAtual', 'aCpfTitularAtual'],
    logradouro: ['pLogradouro'],
    numero: ['pNumero'],
    complemento: ['pComplemento'],
    bairro: ['pBairro'],
    cidade: ['pCidade'],
    nomeNovoTitular: ['pNomeNovoTitular'],
    rgNovoTitular: ['pRgNovoTitular'],
    cpfNovoTitular: ['pCpfNovoTitular']
  };

  function setModeLabels(mode) {
    // Current (titular atual)
    const lblNomeAtual = document.getElementById('labelNomeTitularAtual');
    const lblRgIeAtual = document.getElementById('labelRgIeTitularAtual');
    const lblCpfCnpjAtual = document.getElementById('labelCpfCnpjTitularAtual');
    const pLblRgAtual = document.getElementById('pLabelRgIeAtual');
    const pLblCpfAtual = document.getElementById('pLabelCpfCnpjAtual');
    const aLblCpf = document.getElementById('aLabelCpfCnpj');

    // New (novo titular)
    const lblNomeNovo = document.getElementById('labelNomeNovoTitular');
    const lblRgIeNovo = document.getElementById('labelRgIeNovoTitular');
    const lblCpfCnpjNovo = document.getElementById('labelCpfCnpjNovoTitular');
    const pLblRgNovo = document.getElementById('pLabelRgIeNovo');
    const pLblCpfNovo = document.getElementById('pLabelCpfCnpjNovo');

    // Helper for labels
    const isAtualPJ = (mode === MODE.PJ_PJ || mode === MODE.PJ_PF);
    const isNovoPJ = (mode === MODE.PJ_PJ || mode === MODE.PF_PJ);

    // Atual
    lblNomeAtual.textContent = isAtualPJ ? 'Razão Social do titular atual' : 'Nome do titular atual';
    lblRgIeAtual.textContent = isAtualPJ ? 'IE do titular atual' : 'RG do titular atual';
    lblCpfCnpjAtual.textContent = isAtualPJ ? 'CNPJ do titular atual' : 'CPF do titular atual';
    pLblRgAtual.textContent = isAtualPJ ? 'IE' : 'RG';
    pLblCpfAtual.textContent = isAtualPJ ? 'CNPJ' : 'CPF';
    aLblCpf.textContent = isAtualPJ ? 'CNPJ' : 'CPF';

    // Novo
    lblNomeNovo.textContent = isNovoPJ ? 'Razão Social do novo titular' : 'Nome do novo titular';
    lblRgIeNovo.textContent = isNovoPJ ? 'IE do novo titular' : 'RG do novo titular';
    lblCpfCnpjNovo.textContent = isNovoPJ ? 'CNPJ do novo titular' : 'CPF do novo titular';
    pLblRgNovo.textContent = isNovoPJ ? 'IE' : 'RG';
    pLblCpfNovo.textContent = isNovoPJ ? 'CNPJ' : 'CPF';
  }

  function updatePreview() {
    Object.keys(ids).forEach(key => {
      const value = document.getElementById(ids[key]).value.trim();
      const targets = map[key];
      targets.forEach(tid => {
        const el = document.getElementById(tid);
        if (!el) return;
        el.textContent = value || `[${el.dataset.placeholder || ''}]`;
      });
    });
  }

  function attachPlaceholders() {
    Object.values(map).flat().forEach(tid => {
      const el = document.getElementById(tid);
      if (el) {
        el.dataset.placeholder = el.textContent.replace(/\[|\]/g, '');
      }
    });
  }

  function clearForm() {
    // Reset form fields
    const form = document.getElementById('dataForm');
    if (form) form.reset();

    // Restore placeholders in preview
    Object.values(map).flat().forEach(tid => {
      const el = document.getElementById(tid);
      if (el) {
        const ph = el.dataset.placeholder || '';
        el.textContent = ph ? `[${ph}]` : '';
      }
    });

    // Keep mode selector value and labels consistent after reset
    const modeSel = document.getElementById('transferMode');
    if (modeSel) setModeLabels(modeSel.value);
  }

  async function generatePDF() {
    const letter = document.getElementById('letter');
    // Ensure latest preview
    updatePreview();
    // Render to canvas
    const canvas = await html2canvas(letter, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Fit image to page preserving aspect ratio
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * (imgWidth / canvas.width);
    const y = 0;

    pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
    pdf.save('carta-alteracao-titularidade.pdf');
  }

  function bind() {
    document.getElementById('previewBtn').addEventListener('click', updatePreview);
    document.getElementById('pdfBtn').addEventListener('click', generatePDF);
    document.getElementById('clearBtn').addEventListener('click', clearForm);
    // live preview as user types
    Object.values(ids).forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('input', updatePreview);
    });

    const modeSel = document.getElementById('transferMode');
    if (modeSel) {
      modeSel.addEventListener('change', () => {
        setModeLabels(modeSel.value);
        updatePreview();
      });
      // initialize
      setModeLabels(modeSel.value);
    }
  }

  // Init
  attachPlaceholders();
  bind();
})();
