-- =====================================================
-- FIX DEFINITIVO - RLS PARA LEADS
-- =====================================================
-- Execute este script INTEIRO no SQL Editor do Supabase
-- =====================================================

-- 1. REMOVER TODAS as políticas existentes
DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.leads;

-- 2. DESABILITAR RLS temporariamente
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- 3. GARANTIR permissões de tabela para anon
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.leads TO anon;
GRANT SELECT ON public.leads TO authenticated;
GRANT UPDATE ON public.leads TO authenticated;
GRANT DELETE ON public.leads TO authenticated;

-- 4. REABILITAR RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 5. CRIAR política de INSERT PÚBLICA (SEM RESTRIÇÕES)
CREATE POLICY "Public can insert leads"
    ON public.leads
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 6. CRIAR política de SELECT apenas para autenticados
CREATE POLICY "Authenticated users can view all leads"
    ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

-- 7. CRIAR política de UPDATE apenas para autenticados
CREATE POLICY "Authenticated users can update leads"
    ON public.leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 8. CRIAR política de DELETE apenas para autenticados
CREATE POLICY "Authenticated users can delete leads"
    ON public.leads
    FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Mostrar políticas criadas
SELECT 
    policyname,
    roles,
    cmd,
    permissive,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'leads'
ORDER BY cmd, policyname;

-- Verificar RLS está ativo
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'leads';

-- Mostrar permissões
SELECT 
    grantee, 
    string_agg(privilege_type, ', ') as privileges
FROM information_schema.role_table_grants 
WHERE table_name = 'leads' AND table_schema = 'public'
GROUP BY grantee;
