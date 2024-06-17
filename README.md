# API de Gestão de Usuários e Livros

Esta API em Node.js permite a gestão de usuários e livros, incluindo funcionalidades de cadastro, login, envio de email para alteração de senha, alteração de senha, segurança das rotas, criptografia de senhas, JWT (JSON Web Token) e listagem de livros.

## Funcionalidades

- **Cadastro de Novo Usuário**: Permite a criação de novos usuários.
- **Login**: Permite que os usuários façam login na aplicação.
- **Envio de Email para Alterar Senha**: Envia um email para o usuário com um link para alterar a senha.
- **Alterar Senha**: Permite que os usuários alterem sua senha.
- **Segurança das Rotas**: Protege rotas específicas, permitindo acesso apenas a usuários autenticados.
- **Criptografia das Senhas**: Garante a segurança das senhas dos usuários através de criptografia.
- **JWT (JSON Web Token)**: Utiliza tokens JWT para autenticação e autorização dos usuários.
- **Listagem de Livros**: Permite a listagem de livros disponíveis.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- JWT (JSON Web Token)
- BCrypt (para criptografia de senhas)
- Nodemailer (para envio de emails)
