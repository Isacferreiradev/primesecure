// =====================================================
// PRIMESECURE - SCRIPT PRINCIPAL
// =====================================================
// 
// NOTA: A captura de leads é pública, mas os dados só podem
// ser LIDOS por usuários autenticados (protegido por RLS).
// =====================================================

document.body.classList.add('js-active');

document.addEventListener('DOMContentLoaded', () => {
    // Animações de scroll
    setupScrollAnimations();

    // Configurar formulário de leads
    setupLeadForm();
});

// =====================================================
// ANIMAÇÕES DE SCROLL
// =====================================================
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
}

// =====================================================
// CONFIGURAR FORMULÁRIO DE LEADS
// =====================================================
function setupLeadForm() {
    const leadForm = document.getElementById('leadForm');
    if (!leadForm) return;

    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = leadForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Coletar dados
        const leadData = {
            nome: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefone: document.getElementById('phone').value.trim(),
            status: 'Novo Lead',
            origem: 'Landing Page PrimeSecure'
        };

        // Validação
        if (!leadData.nome || !leadData.email || !leadData.telefone) {
            showFeedback(btn, '⚠️ Preencha todos os campos', '#f59e0b', originalText);
            return;
        }

        // Obter cliente Supabase
        const client = window.supabaseClient || getSupabaseClient();
        if (!client) {
            showFeedback(btn, '✗ Erro de conexão', '#ef4444', originalText);
            return;
        }

        // Loading
        btn.innerHTML = '⏳ Enviando...';
        btn.disabled = true;

        try {
            const { data, error } = await client
                .from('leads')
                .insert([leadData])
                .select();

            if (error) throw error;

            console.log('Lead capturado:', data);

            // Sucesso
            btn.innerHTML = '✓ Enviado com Sucesso!';
            btn.style.backgroundColor = '#10b981';
            btn.style.color = '#fff';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.disabled = false;
                leadForm.reset();
            }, 3000);

        } catch (error) {
            console.error('Erro ao salvar lead:', error);
            showFeedback(btn, '✗ Erro ao enviar', '#ef4444', originalText);
        }
    });
}

// =====================================================
// FEEDBACK VISUAL
// =====================================================
function showFeedback(btn, message, color, originalText) {
    btn.innerHTML = message;
    btn.style.backgroundColor = color;
    btn.style.color = '#fff';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.disabled = false;
    }, 3000);
}
