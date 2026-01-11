-- =====================================================
-- VALIDAÇÃO DO API KEY
-- =====================================================

-- 1. Verificar se a API key anon tem as permissões corretas
-- Vá em: Settings > API > Project API keys
-- Certifique-se de que você está usando a "anon/public" key
-- NÃO use a "service_role" key no frontend

-- 2. Verifique se a URL está correta
-- URL do projeto: https://kqnezphnpclbetbocsmo.supabase.co
-- Settings > API > Project URL

-- 3. Execute esta query para ver o role atual
SELECT current_user, session_user;

-- 4. Verificar configuração JWT
SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'postgres');

-- 5. Testar permissões diretas do role anon
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon' AND table_name = 'leads';
