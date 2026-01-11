-- =====================================================
-- DIAGNÓSTICO COMPLETO
-- =====================================================

-- Ver se a tabela existe
SELECT 'Tabela leads existe?' as check_type, 
       CASE WHEN EXISTS (
           SELECT FROM information_schema.tables 
           WHERE table_schema = 'public' AND table_name = 'leads'
       ) THEN 'SIM' ELSE 'NÃO' END as result;

-- Ver se RLS está ativo
SELECT 'RLS está ativo?' as check_type,
       CASE WHEN rowsecurity THEN 'SIM' ELSE 'NÃO' END as result
FROM pg_tables
WHERE tablename = 'leads';

-- Ver todas as políticas
SELECT 'Políticas existentes:' as info;
SELECT policyname, roles, cmd 
FROM pg_policies
WHERE tablename = 'leads';

-- =====================================================
-- SOLUÇÃO TEMPORÁRIA: DESABILITAR RLS PARA TESTAR
-- =====================================================

-- TEMPORARIAMENTE desabilitar RLS para testar
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

SELECT 'RLS foi DESABILITADO temporariamente' as status;
SELECT 'Agora teste o formulário da landing page' as instrucao;
