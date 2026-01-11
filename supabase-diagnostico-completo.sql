-- =====================================================
-- DIAGNÓSTICO COMPLETO DO PROBLEMA RLS
-- =====================================================

-- 1. Verificar se RLS está ativo
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'leads' AND schemaname = 'public';

-- 2. Listar TODAS as políticas ativas
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

-- 3. Testar INSERT direto como role anon
SET ROLE anon;
INSERT INTO leads (nome, email, telefone, status, origem)
VALUES ('Teste Anon', 'teste@anon.com', '11999999999', 'Novo Lead', 'Teste');
RESET ROLE;

-- 4. Verificar permissões da tabela
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'leads' AND table_schema = 'public';

-- 5. Verificar se a tabela está no schema correto
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_name = 'leads';
