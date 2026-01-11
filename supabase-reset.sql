-- =====================================================
-- PRIMESECURE CRM - RESET E RECONFIGURAÇÃO
-- Execute este script para resetar e recriar tudo
-- =====================================================

-- 1. REMOVER políticas existentes (caso existam)
DROP POLICY IF EXISTS "Allow public insert" ON leads;
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON leads;

-- 2. DESABILITAR RLS temporariamente
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- 3. HABILITAR RLS novamente
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. RECRIAR POLÍTICAS

-- Permitir INSERT público (QUALQUER usuário pode capturar leads)
CREATE POLICY "Allow public insert"
    ON leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Usuários autenticados podem SELECT
CREATE POLICY "Authenticated users can view all leads"
    ON leads
    FOR SELECT
    TO authenticated
    USING (true);

-- Usuários autenticados podem UPDATE
CREATE POLICY "Authenticated users can update leads"
    ON leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Usuários autenticados podem DELETE
CREATE POLICY "Authenticated users can delete leads"
    ON leads
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'leads'
ORDER BY policyname;

-- Verificar RLS está ativo
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'leads';
