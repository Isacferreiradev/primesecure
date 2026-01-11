// =====================================================
// PRIMESECURE CRM - LÓGICA PRINCIPAL
// =====================================================
//
// SEGURANÇA: Todas as queries são protegidas pelo RLS do Supabase.
// Usuários não autenticados NÃO conseguem ler dados mesmo acessando este código.
// =====================================================

let currentLeads = [];
let currentLead = null;

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    await displayUserInfo();
    await loadLeads();
    setupFilters();
});

// =====================================================
// EXIBIR INFORMAÇÕES DO USUÁRIO
// =====================================================
async function displayUserInfo() {
    const user = await authModule.getCurrentUser();
    const userEmailEl = document.getElementById('userEmail');
    if (user && userEmailEl) {
        userEmailEl.textContent = user.email;
    }
}

// =====================================================
// CARREGAR LEADS
// =====================================================
async function loadLeads() {
    const client = window.supabaseClient || getSupabaseClient();
    if (!client) {
        showErrorInTable('Erro ao conectar');
        return;
    }

    try {
        // O RLS garante que apenas usuários autenticados podem executar SELECT
        const { data: leads, error } = await client
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        currentLeads = leads || [];
        displayLeads(currentLeads);
        updateStats(currentLeads);

    } catch (error) {
        console.error('Erro ao carregar leads:', error);

        // Se erro de autenticação, redirecionar
        if (error.message && error.message.includes('JWT')) {
            window.location.replace('login.html');
        } else {
            showErrorInTable('Erro ao carregar leads');
        }
    }
}

// =====================================================
// EXIBIR LEADS NA TABELA
// =====================================================
function displayLeads(leads) {
    const tbody = document.getElementById('leadsTableBody');
    if (!tbody) return;

    if (!leads || leads.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Nenhum lead encontrado.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = leads.map(lead => `
        <tr onclick="openLeadModal('${lead.id}')">
            <td><strong>${escapeHtml(lead.nome)}</strong></td>
            <td>${escapeHtml(lead.telefone)}</td>
            <td>${escapeHtml(lead.email)}</td>
            <td>
                <span class="status-badge ${getStatusClass(lead.status)}">
                    ${lead.status}
                </span>
            </td>
            <td>${escapeHtml(lead.origem)}</td>
            <td>${formatDate(lead.created_at)}</td>
        </tr>
    `).join('');
}

// =====================================================
// ATUALIZAR ESTATÍSTICAS
// =====================================================
function updateStats(leads) {
    const today = new Date().toISOString().split('T')[0];

    document.getElementById('totalLeads').textContent = leads.length;
    document.getElementById('newToday').textContent =
        leads.filter(l => l.created_at.startsWith(today)).length;
    document.getElementById('inProgress').textContent =
        leads.filter(l => !['Fechado', 'Perdido'].includes(l.status)).length;
    document.getElementById('closedLeads').textContent =
        leads.filter(l => l.status === 'Fechado').length;
}

// =====================================================
// FILTROS E BUSCA
// =====================================================
function setupFilters() {
    const statusFilter = document.getElementById('filterStatus');
    const searchInput = document.getElementById('searchInput');

    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
}

function applyFilters() {
    const statusFilter = document.getElementById('filterStatus').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filtered = currentLeads;

    if (statusFilter) {
        filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (searchTerm) {
        filtered = filtered.filter(lead =>
            lead.nome.toLowerCase().includes(searchTerm) ||
            lead.telefone.toLowerCase().includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm)
        );
    }

    displayLeads(filtered);
}

// =====================================================
// MODAL DE DETALHES DO LEAD
// =====================================================
async function openLeadModal(leadId) {
    const lead = currentLeads.find(l => l.id === leadId);
    if (!lead) return;

    currentLead = lead;
    const modalBody = document.getElementById('modalBody');
    const whatsappLink = `https://wa.me/55${lead.telefone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(lead.nome)}!%20Sou%20da%20PrimeSecure.`;

    modalBody.innerHTML = `
        <div class="lead-detail-group">
            <label>Nome Completo</label>
            <p><strong>${escapeHtml(lead.nome)}</strong></p>
        </div>
        <div class="lead-detail-group">
            <label>E-mail</label>
            <p>${escapeHtml(lead.email)}</p>
        </div>
        <div class="lead-detail-group">
            <label>Telefone / WhatsApp</label>
            <p>${escapeHtml(lead.telefone)}</p>
            <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">
                📱 Abrir WhatsApp
            </a>
        </div>
        <div class="lead-detail-group">
            <label for="modalStatus">Status</label>
            <select id="modalStatus" style="width: 100%; padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: 6px;">
                ${STATUS_OPTIONS.map(status => `
                    <option value="${status}" ${lead.status === status ? 'selected' : ''}>
                        ${status}
                    </option>
                `).join('')}
            </select>
        </div>
        <div class="lead-detail-group">
            <label>Origem</label>
            <p>${escapeHtml(lead.origem)}</p>
        </div>
        <div class="lead-detail-group">
            <label for="modalObservacoes">Observações Internas</label>
            <textarea id="modalObservacoes" placeholder="Adicione observações...">${escapeHtml(lead.observacoes || '')}</textarea>
        </div>
        <div class="lead-detail-group">
            <label for="modalProximoContato">Próximo Contato</label>
            <input type="date" id="modalProximoContato" value="${lead.proximo_contato || ''}" style="padding: 0.75rem; border: 1px solid var(--gray-300); border-radius: 6px; width: 100%;">
        </div>
        <div class="lead-detail-group">
            <label>Data de Cadastro</label>
            <p>${formatDateTime(lead.created_at)}</p>
        </div>
    `;

    document.getElementById('leadModal').classList.add('active');
}

function closeModal() {
    document.getElementById('leadModal').classList.remove('active');
    currentLead = null;
}

// =====================================================
// SALVAR ALTERAÇÕES DO LEAD
// =====================================================
async function saveLead() {
    if (!currentLead) return;

    const client = window.supabaseClient || getSupabaseClient();
    if (!client) {
        showNotification('Erro de conexão', 'error');
        return;
    }

    const updatedData = {
        status: document.getElementById('modalStatus').value,
        observacoes: document.getElementById('modalObservacoes').value,
        proximo_contato: document.getElementById('modalProximoContato').value || null
    };

    try {
        // RLS garante que apenas usuários autenticados podem UPDATE
        const { error } = await client
            .from('leads')
            .update(updatedData)
            .eq('id', currentLead.id);

        if (error) throw error;

        // Atualizar localmente
        const index = currentLeads.findIndex(l => l.id === currentLead.id);
        if (index !== -1) {
            currentLeads[index] = { ...currentLeads[index], ...updatedData };
        }

        displayLeads(currentLeads);
        updateStats(currentLeads);
        closeModal();
        showNotification('Lead atualizado!', 'success');

    } catch (error) {
        console.error('Erro ao salvar:', error);
        showNotification('Erro ao salvar', 'error');
    }
}

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================
function getStatusClass(status) {
    const map = {
        'Novo Lead': 'status-novo',
        'WhatsApp Enviado': 'status-whatsapp',
        'Ligação Agendada': 'status-ligacao',
        'Simulação Realizada': 'status-simulacao',
        'Proposta Enviada': 'status-proposta',
        'Fechado': 'status-fechado',
        'Perdido': 'status-perdido'
    };
    return map[status] || 'status-novo';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showErrorInTable(message) {
    const tbody = document.getElementById('leadsTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--danger); padding: 2rem;">
                    ${message}
                </td>
            </tr>
        `;
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white; border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999; font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Fechar modal ao clicar fora
document.getElementById('leadModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'leadModal') closeModal();
});
