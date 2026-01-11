// =====================================================
// PRIMESECURE CRM - AUTENTICAÇÃO
// =====================================================
// 
// IMPORTANTE: Este código é apenas para UX (experiência do usuário).
// A SEGURANÇA REAL está no Row Level Security (RLS) do Supabase.
// Mesmo que alguém desative o JavaScript, o RLS impedirá acesso aos dados.
// =====================================================

const isLoginPage = window.location.pathname.includes('login.html');
let authInitialized = false;

// Inicializar autenticação
async function initAuth() {
    if (authInitialized) return;

    const client = getSupabaseClient();
    if (!client) {
        console.error('Cliente Supabase não disponível');
        return;
    }

    try {
        const { data: { session } } = await client.auth.getSession();

        if (isLoginPage) {
            if (session) {
                // Usuário já logado, redirecionar para admin
                window.location.replace('index.html');
            } else {
                setupLoginForm();
            }
        } else {
            if (!session) {
                // Não logado, redirecionar para login
                window.location.replace('login.html');
            }
        }

        authInitialized = true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (!isLoginPage) {
            window.location.replace('login.html');
        }
    }
}

// Executar quando DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

// =====================================================
// CONFIGURAR FORMULÁRIO DE LOGIN
// =====================================================
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showError('Preencha todos os campos');
            return;
        }

        const client = getSupabaseClient();
        if (!client) {
            showError('Erro ao conectar com o servidor');
            return;
        }

        // Estado de loading
        loginBtn.innerHTML = '⏳ Entrando...';
        loginBtn.disabled = true;
        errorMessage.style.display = 'none';

        try {
            const { data, error } = await client.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Sucesso
            loginBtn.innerHTML = '✓ Conectado!';
            loginBtn.style.backgroundColor = '#10b981';

            setTimeout(() => {
                window.location.replace('index.html');
            }, 500);

        } catch (error) {
            console.error('Erro no login:', error);

            let message = 'Credenciais inválidas';
            if (error.message.includes('Invalid login credentials')) {
                message = 'Email ou senha incorretos';
            } else if (error.message.includes('Email not confirmed')) {
                message = 'Email não confirmado';
            }

            showError(message);
            loginBtn.innerHTML = 'Entrar';
            loginBtn.disabled = false;
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

// =====================================================
// FUNÇÃO DE LOGOUT
// =====================================================
async function logout() {
    const client = getSupabaseClient();
    if (!client) return;

    try {
        await client.auth.signOut();
        window.location.replace('login.html');
    } catch (error) {
        console.error('Erro no logout:', error);
    }
}

// =====================================================
// OBTER USUÁRIO ATUAL
// =====================================================
async function getCurrentUser() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
        const { data: { user } } = await client.auth.getUser();
        return user;
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
    }
}

// Exportar funções
window.authModule = {
    logout,
    getCurrentUser
};
