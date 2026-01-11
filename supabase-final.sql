-- =====================================================
-- CONFIGURAÇÃO FINAL - RLS CORRETO
-- =====================================================

-- 1. Habilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Allow public insert" ON leads;
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON leads;

-- 3. Criar política de INSERT para TODOS (público e autenticado)
CREATE POLICY "public_insert_leads"
    ON leads
    FOR INSERT
    WITH CHECK (true);

-- 4. Criar política de SELECT apenas para autenticados
CREATE POLICY "authenticated_select_leads"
    ON leads
    FOR SELECT
    TO authenticated
    USING (true);

-- 5. Criar política de UPDATE apenas para autenticados
CREATE POLICY "authenticated_update_leads"
    ON leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Criar política de DELETE apenas para autenticados
CREATE POLICY "authenticated_delete_leads"
    ON leads
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT '✅ Configuração concluída!' as status;

-- Ver políticas criadas
SELECT policyname, cmd, roles::text[] 
FROM pg_policies 
WHERE tablename = 'leads'
ORDER BY cmd;

-- Confirmar RLS ativo
SELECT 'RLS Status: ' || CASE WHEN rowsecurity THEN 'ATIVO ✅' ELSE 'DESATIVADO ❌' END as rls_status
FROM pg_tables 
WHERE tablename = 'leads';
