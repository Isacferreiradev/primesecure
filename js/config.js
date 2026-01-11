// =====================================================
// PRIMESECURE CRM - CONFIGURAÇÃO SUPABASE
// =====================================================

// Configuração
const SUPABASE_URL = 'https://kqnezphnpclbetbocsmo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbmV6cGhucGNsYmV0Ym9jc21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDk0NjEsImV4cCI6MjA4MzcyNTQ2MX0.gNmJ7FTTTqSRKx6mb2RmHkaQggHGFake5DqdasjGMpo';

// Status disponíveis
const STATUS_OPTIONS = [
    'Novo Lead',
    'WhatsApp Enviado',
    'Ligação Agendada',
    'Simulação Realizada',
    'Proposta Enviada',
    'Fechado',
    'Perdido'
];

// Cliente Supabase (singleton)
let _client = null;

function getSupabaseClient() {
    if (!_client && typeof window.supabase !== 'undefined') {
        _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _client;
}

// Expor globalmente - SEM criar variável 'supabase' que conflita com a lib
window.getSupabaseClient = getSupabaseClient;
window.STATUS_OPTIONS = STATUS_OPTIONS;
window.supabaseClient = getSupabaseClient();
