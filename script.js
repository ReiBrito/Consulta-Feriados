document.addEventListener('DOMContentLoaded', function() {
    const anoSelect = document.getElementById('anoSelect');
    const searchButton = document.getElementById('searchButton');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const resultContainer = document.getElementById('resultContainer');
    const feriadosList = document.getElementById('feriadosList');
    const anoSelecionado = document.getElementById('anoSelecionado');

    // Preencher o select com anos (de 2000 até o ano atual + 2)
    function preencherAnos() {
        const anoAtual = new Date().getFullYear();
        const anoInicial = 2000;
        
        for (let ano = anoAtual + 2; ano >= anoInicial; ano--) {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            anoSelect.appendChild(option);
        }
    }

    // Consultar feriados
    async function consultarFeriados() {
        const ano = anoSelect.value;
        
        if (!ano) {
            showError('Selecione um ano para consultar');
            return;
        }
        
        loading.style.display = 'block';
        error.style.display = 'none';
        resultContainer.style.display = 'none';
        
        try {
            const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
            
            if (!response.ok) {
                throw new Error(`Erro ao consultar feriados: ${response.status}`);
            }
            
            const feriados = await response.json();
            
            if (!Array.isArray(feriados)) {
                throw new Error('Formato de dados inesperado');
            }
            
            exibirFeriados(feriados, ano);
            
        } catch (err) {
            showError(err.message);
            console.error("Erro detalhado:", err);
        } finally {
            loading.style.display = 'none';
        }
    }
    
    // Exibir feriados na tela
    function exibirFeriados(feriados, ano) {
        feriadosList.innerHTML = '';
        anoSelecionado.textContent = ano;
        
        if (feriados.length === 0) {
            feriadosList.innerHTML = '<p class="no-results">Nenhum feriado nacional encontrado para este ano.</p>';
            resultContainer.style.display = 'block';
            return;
        }
        
        feriados.forEach(feriado => {
            const feriadoItem = document.createElement('div');
            feriadoItem.className = 'feriado-item';
            
            const data = formatarData(feriado.date);
            const diaSemana = getDiaSemana(feriado.date);
            
            feriadoItem.innerHTML = `
                <div class="feriado-data">${data} - ${diaSemana}</div>
                <div class="feriado-nome">${feriado.name}</div>
            `;
            
            feriadosList.appendChild(feriadoItem);
        });
        
        resultContainer.style.display = 'block';
    }
    
    // Funções auxiliares
    function formatarData(dataString) {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    
    function getDiaSemana(dataString) {
        const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const data = new Date(dataString);
        return dias[data.getDay()];
    }
    
    function showError(message) {
        error.textContent = message;
        error.style.display = 'block';
    }
    
    // Event listeners
    searchButton.addEventListener('click', consultarFeriados);
    
    // Inicialização
    preencherAnos();
});