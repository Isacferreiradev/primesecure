-- =====================================================
-- PRIMESECURE CRM - SUPABASE SETUP
-- Execute este script no SQL Editor do Supabase Dashboard
-- =====================================================

-- 1. Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    status TEXT DEFAULT 'Novo Lead' NOT NULL,
    origem TEXT DEFAULT 'Landing Page PrimeSecure',
    observacoes TEXT,
    proximo_contato DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. Política: Permitir INSERT público (captura de leads)
CREATE POLICY "Allow public insert"
    ON leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 5. Política: Usuários autenticados podem ver todos os leads
CREATE POLICY "Authenticated users can view all leads"
    ON leads
    FOR SELECT
    TO authenticated
    USING (true);

-- 6. Política: Usuários autenticados podem atualizar leads
CREATE POLICY "Authenticated users can update leads"
    ON leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Política: Usuários autenticados podem deletar leads
CREATE POLICY "Authenticated users can delete leads"
    ON leads
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se a tabela foi criada
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'leads';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'leads';

-- =====================================================
-- DADOS DE TESTE (OPCIONAL)
-- =====================================================

-- Inserir lead de teste
INSERT INTO leads (nome, email, telefone, status, origem)
VALUES 
    ('João Silva', 'joao@example.com', '(11) 98765-4321', 'Novo Lead', 'Landing Page PrimeSecure'),
    ('Maria Santos', 'maria@example.com', '(11) 91234-5678', 'WhatsApp Enviado', 'Landing Page PrimeSecure');
