-- =====================================================
-- TESTE: DESABILITAR RLS TEMPORARIAMENTE
-- =====================================================
-- Use isto APENAS para testar se o problema é RLS
-- =====================================================

-- Desabilitar RLS completamente
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- Verificar
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'leads';

-- Agora tente submeter o formulário
-- Se funcionar, o problema É RLS
-- Se NÃO funcionar, o problema é API Key ou outra coisa
