# 🔐 PrimeSecure CRM

Sistema CRM completo integrado com Supabase para gerenciamento de leads da PrimeSecure.

## 📋 Funcionalidades

✅ **Captura Automática de Leads** - Formulário da landing page salva automaticamente no banco  
✅ **Dashboard Administrativo** - Visualização completa de todos os leads  
✅ **Filtros e Busca** - Filtrar por status e buscar por nome/telefone  
✅ **Pipeline de Status** - 7 estágios de acompanhamento  
✅ **Ficha Detalhada** - Visualizar e editar informações de cada lead  
✅ **Integração WhatsApp** - Botão direto para contato  
✅ **Autenticação Segura** - Login com Supabase Auth  
✅ **Row Level Security** - Proteção de dados com RLS  

## 🚀 Como Configurar

### 1. Configurar o Supabase

#### a) Executar Script SQL
1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie e execute o conteúdo do arquivo `supabase-setup.sql`
4. Verifique se a tabela `leads` foi criada com sucesso

#### b) Criar Usuário Admin
1. No Supabase Dashboard, vá em **Authentication** > **Users**
2. Clique em **Add User** > **Create new user**
3. Preencha:
   - **Email**: seu-email@exemplo.com
   - **Password**: sua-senha-segura
   - **Auto Confirm User**: ✅ MARCAR
4. Clique em **Create user**

### 2. Executar Localmente

```bash
# Navegar até a pasta do projeto
cd c:\Users\arist\Documents\renda

# Executar servidor local (escolha um)
# Opção 1: Python
python -m http.server 8080

# Opção 2: Node.js (http-server)
npx http-server -p 8080

# Opção 3: PHP
php -S localhost:8080
```

### 3. Acessar o Sistema

- **Landing Page**: http://localhost:8080/index.html
- **Admin Login**: http://localhost:8080/admin/login.html
- **Dashboard**: http://localhost:8080/admin/index.html (após login)

## 📁 Estrutura de Arquivos

```
renda/
├── index.html              # Landing page com formulário
├── admin/
│   ├── index.html         # Dashboard do CRM
│   ├── login.html         # Página de login
│   ├── css/
│   │   └── admin.css      # Estilos do admin
│   └── js/
│       ├── auth.js        # Sistema de autenticação
│       └── crm.js         # Lógica do CRM
├── js/
│   ├── config.js          # Configuração Supabase
│   └── script.js          # Script da landing page
├── css/
│   └── style.css          # Estilos da landing page
├── supabase-setup.sql     # Script SQL para setup
├── .env                   # Credenciais (NÃO commitar)
└── .env.example           # Template de exemplo
```

## 🎯 Como Usar

### Captura de Leads

1. O visitante preenche o formulário na landing page
2. Os dados são salvos automaticamente no Supabase
3. Status inicial: **"Novo Lead"**
4. Origem: **"Landing Page PrimeSecure"**

### Gerenciar Leads no CRM

1. Acesse `/admin/login.html`
2. Faça login com as credenciais criadas
3. Visualize todos os leads no dashboard
4. Use os filtros para organizar (status, busca)
5. Clique em um lead para ver detalhes

### Atualizar Status de um Lead

1. Clique no lead na tabela
2. No modal, altere o **Status**
3. Adicione **Observações** se necessário
4. Defina **Próximo Contato**
5. Clique em **Salvar Alterações**

### Pipeline de Status

1. **Novo Lead** - Lead acabou de entrar
2. **WhatsApp Enviado** - Primeira mensagem enviada
3. **Ligação Agendada** - Contato telefônico agendado
4. **Simulação Realizada** - Simulação de seguro feita
5. **Proposta Enviada** - Proposta comercial enviada
6. **Fechado** - Venda concretizada ✅
7. **Perdido** - Lead perdido ❌

## 🔒 Segurança

- ✅ **Row Level Security (RLS)** ativado
- ✅ Apenas usuários autenticados acessam o admin
- ✅ Público pode apenas INSERT (captura de leads)
- ✅ Admins podem SELECT, UPDATE, DELETE
- ✅ Credenciais em `.env` (não versionado)

## 🛠️ Tecnologias

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Authentication
- **Database**: Supabase Database + RLS
- **Hosting**: Qualquer servidor HTTP

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique se o script SQL foi executado
2. Confirme que o usuário admin foi criado
3. Verifique as credenciais no arquivo `.env`
4. Abra o console do navegador (F12) para ver erros

## 🔐 LGPD

O sistema está em conformidade com a LGPD:
- ✅ Dados não são expostos publicamente
- ✅ Acesso restrito apenas a usuários autenticados
- ✅ Políticas de segurança RLS ativas
- ✅ Separação de rotas públicas e privadas
