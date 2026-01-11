# 🚀 GUIA RÁPIDO - COMEÇAR AGORA

## ⚡ 3 Passos para Ativar o CRM

### PASSO 1: Executar SQL no Supabase ⏱️ 2 minutos

1. Abra: https://supabase.com/dashboard/project/kqnezphnpclbetbocsmo
2. Clique em **SQL Editor** (no menu lateral)
3. Clique em **New Query**
4. Copie TODO o conteúdo do arquivo `supabase-setup.sql`
5. Cole no editor
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. ✅ Deve aparecer "Success" sem erros

---

### PASSO 2: Criar Usuário Admin ⏱️ 1 minuto

1. No mesmo Supabase Dashboard
2. Clique em **Authentication** > **Users**
3. Clique em **Add User** > **Create new user**
4. Preencha:
   ```
   Email: seu-email@exemplo.com
   Password: SuaSenha123!
   ```
5. ✅ **IMPORTANTE:** Marque "Auto Confirm User"
6. Clique em **Create user**

---

### PASSO 3: Iniciar Servidor ⏱️ 30 segundos

Abra o terminal na pasta do projeto e execute:

```bash
# Opção 1: Python (mais comum)
python -m http.server 8080

# Opção 2: Node.js
npx http-server -p 8080
```

---

## 🎯 Acessar o Sistema

Abra seu navegador:

- 🌐 **Landing Page**: http://localhost:8080/index.html
- 🔐 **Login Admin**: http://localhost:8080/admin/login.html

---

## ✅ Testar Tudo

### 1. Testar Captura de Lead
- Acesse a landing page
- Preencha: Nome, Email, Telefone
- Clique "Solicitar Contato Agora"
- Deve aparecer: "✓ Enviado com Sucesso!"

### 2. Testar Login
- Acesse `/admin/login.html`
- Use o email/senha criado no Passo 2
- Deve redirecionar para o dashboard

### 3. Testar CRM
- Veja o lead na tabela
- Clique no lead para abrir detalhes
- Mude o status para "WhatsApp Enviado"
- Adicione uma observação
- Clique "Salvar Alterações"
- ✅ Pronto! Sistema funcionando!

---

## 🆘 Problemas?

**Erro ao executar SQL:**
- Verifique se copiou TODO o conteúdo do arquivo
- Execute novamente o script

**Não consegue fazer login:**
- Confirme que marcou "Auto Confirm User"
- Verifique email/senha digitados
- Abra o console (F12) e veja os erros

**Lead não aparece no dashboard:**
- Verifique se o SQL foi executado
- Abra o console (F12) para ver erros
- Verifique conexão com Supabase

---

## 📚 Documentação Completa

- [README.md](file:///c:/Users/arist/Documents/renda/README.md) - Documentação completa
- [walkthrough.md](file:///C:/Users/arist/.gemini/antigravity/brain/b839c216-b8d1-446b-b61f-dddd0af4ad77/walkthrough.md) - Detalhes da implementação

---

**Tempo total de setup: ~4 minutos** ⚡
