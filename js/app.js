/**
 * Gerenciador de Modais
 */
const ModalManager = {
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal '${modalId}' não encontrado`);
            return false;
        }
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        return true;
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal '${modalId}' não encontrado`);
            return false;
        }
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        return true;
    }
};

/**
 * Gerenciador de Configuração (com validação)
 */
const ConfigManager = {
    isValidConfig(config) {
        if (!config || typeof config !== 'object') return false;
        // Adicione validações específicas aqui
        return true;
    },

    saveConfig(config) {
        if (!this.isValidConfig(config)) {
            console.error('Configuração inválida');
            return false;
        }
        try {
            localStorage.setItem('config', JSON.stringify(config));
            return true;
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            return false;
        }
    },

    loadConfig() {
        try {
            const config = localStorage.getItem('config');
            return config ? JSON.parse(config) : null;
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
            return null;
        }
    }
};

/**
 * Gerenciador de Filtros e Ordenação de Tabelas
 */
const TableManager = {
    sanitizeInput(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    },

    applyFilters(tableId, filterValue) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error(`Tabela '${tableId}' não encontrada`);
            return;
        }

        const sanitizedFilter = this.sanitizeInput(filterValue).toLowerCase();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const matches = Array.from(row.cells).some(cell =>
                cell.textContent.toLowerCase().includes(sanitizedFilter)
            );
            row.style.display = matches ? '' : 'none';
        });
    },

    sortTable(tableId, columnIndex, ascending = true) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error(`Tabela '${tableId}' não encontrada`);
            return;
        }

        const rows = Array.from(table.querySelectorAll('tbody tr'));
        
        if (columnIndex < 0 || columnIndex >= rows[0]?.cells.length) {
            console.error(`Coluna ${columnIndex} inválida`);
            return;
        }

        rows.sort((a, b) => {
            const cellA = a.cells[columnIndex].innerText.trim();
            const cellB = b.cells[columnIndex].innerText.trim();

            // Detectar números
            const numA = parseFloat(cellA);
            const numB = parseFloat(cellB);

            if (!isNaN(numA) && !isNaN(numB)) {
                return ascending ? numA - numB : numB - numA;
            }

            // Fallback para string
            return ascending
                ? cellA.localeCompare(cellB, 'pt-BR')
                : cellB.localeCompare(cellA, 'pt-BR');
        });

        const tbody = table.querySelector('tbody');
        rows.forEach(row => tbody.appendChild(row));
    }
};

/**
 * Utilitários
 */
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Exemplo de uso com debounce
 */
const debouncedFilter = debounce((tableId, filterValue) => {
    TableManager.applyFilters(tableId, filterValue);
}, 300);