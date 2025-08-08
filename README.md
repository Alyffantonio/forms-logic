> # 📄 Forms Logic - Sistema de Formulários Dinâmicos
>
> ## 📌 Descrição Geral
> O projeto Forms Logic oferece uma plataforma robusta para criação, edição, preenchimento e versionamento automático de formulários dinâmicos.
> Administradores podem criar formulários com múltiplos tipos de campos, lógicas condicionais, validações personalizadas e fórmulas automáticas entre campos.
> Cada modificação gera uma nova versão, garantindo rastreabilidade e integridade das respostas.
>
> ---
>
> ## 🎯 Objetivo da História
> Desenvolver o núcleo do sistema Forms Logic, incluindo:
> - Criação e edição de formulários inteligentes
> - Estrutura de versionamento automático
> - Visualização em tempo real dos campos e regras
> - Integração completa entre frontend e backend
>
> ---
>
> ## 🧩 Funcionalidades
> - Modal para criação de formulários (nome + descrição)
> - Adição dinâmica de campos com suporte aos tipos:
>   - Texto, Número, Data, Booleano, Seleção (dropdown), Calculado
> - Validações por tipo (regex, min/max, obrigatório)
> - Lógica condicional para exibição de campos
> - Fórmulas automáticas entre campos (`campo_calculado = campoA + campoB`)
> - Visualização em tempo real da estrutura do formulário
> - Versionamento automático preservando versões anteriores
> - Submissão de respostas sempre vinculadas à versão ativa
>
> ---
>
> ## ✅ Regras e Critérios de Aceitação
> - IDs de campos devem ser únicos por formulário
> - Expressões e dependências validadas no backend
> - Dependências circulares são proibidas
> - Atualizações geram nova versão, mantendo as anteriores
> - Apenas a versão ativa pode receber respostas
> - Confirmações visuais para cada ação importante do usuário
>
> ---
>
> ## 🚀 Tecnologias Utilizadas
>
> ### 🔙 Backend (`/backend`)
> - **Python 3.12+**
> - **Django 4.x** + **Django REST Framework**
> - **SQLite3** (default, facilmente migrável para PostgreSQL)
> - Estrutura modular com aplicação de **Strategy Pattern**
>
> ### 🎨 Frontend (`/frontend`)
> - **React 18** com **Vite** para build e hot reload rápido
> - **Tailwind CSS** com classes utilitárias e responsividade moderna
> - Estrutura baseada em **componentes reutilizáveis**:
>   - `CamposFixos.jsx`, `CheckBox.jsx`, `Condicionais.jsx`, `Formula.jsx`
> - Visualização em tempo real do formulário em: `FormularioPreview.jsx`
> - Modal dinâmico com `Modal.jsx` e `RespostaModal.jsx`
> - Organização por páginas: `Home.jsx`, `Lista.jsx`
> - Validações de entrada e regras de negócio aplicadas dinamicamente nos componentes

>
> ### 🐳 Infraestrutura
> - **Docker** (backend + frontend)
> - **Docker Compose**
> - **Nginx** (para build estático do frontend)
>
> ---
>
> ## 🔌 Endpoints Principais da API
> - `GET /formularios/` → Lista todos os formulários
> - `POST /formularios/save/` → Cria um novo formulário
> - `GET /formularios/<id>/versao/<version>/` → Retorna os detalhes da versão de um formulário
> - `PUT /formularios/update/<id>/` → Atualiza um formulário existente (nova versão)
> - `DELETE /formularios/delete/<id>/` → Marca um formulário como inativo (soft delete)
> - `POST /formularios/<id>/respostas/` → Submete uma resposta para o formulário identificado
>
> ---
>
> ## 🏗️ Estrutura do Backend
>
> ```
> backend/
> ├── manage.py
> ├── backend/             ← Configurações do projeto Django
> └── forms/               ← App principal dos formulários
> ```
>
> ### Arquivos-chave do App `forms/`
> | Arquivo                   | Função principal                                     |
> |--------------------------|------------------------------------------------------|
> | `models.py`              | Estrutura dos dados e regras do banco                |
> | `serializers.py`         | Validações, conversão e lógica dos dados da API      |
> | `views.py`               | Endpoints e regras de negócios                       |
> | `urls.py`                | Definições de rotas da API                           |
> | `filters.py`             | Filtros para listagens dinâmicas                     |
> | `pagination.py`          | Paginação personalizada para listas                  |
> | `admin.py`               | Configuração do Django Admin                         |
> | `tests.py`               | Testes automatizados                                 |
>
> ---
>
> ## 🧠 Padrão de Projeto: Strategy
> - Utilizado para isolar a lógica dos tipos de campo, fórmulas e dependências.
> - Facilita a adição de novos comportamentos sem alterar a estrutura existente.
> - Implementado de forma distribuída em `serializers.py`, `models.py` e possíveis extensões.
>
> ---
>
> ## 🛠️ Onde Alterar o Código
>
> | Deseja alterar...               | Arquivo / Local                            |
> |--------------------------------|---------------------------------------------|
> | Validações de campos           | `forms/serializers.py` ou `forms/models.py` |
> | Regras e lógica de negócio     | `forms/views.py`                            |
> | Estrutura de dados do modelo   | `forms/models.py`                           |
> | Filtros                        | `forms/filters.py`                          |
> | Paginação                      | `forms/pagination.py`                       |
> | URLs da API                    | `forms/urls.py`                             |
> | Visualização no Admin          | `forms/admin.py`                            |
>
> ---
>
> ## 🧪 Testes
> - Testes automatizados estão em `forms/tests.py`
> - Para executar:
>
> ```
> cd backend
> python manage.py test
> ```
>
> ---
>
> ## 🐳 Como Rodar com Docker
> 1. Clone o repositório:
>     ```
>     git clone https://github.com/seu-usuario/forms-logic.git
>     ```
> 2. Suba os containers:
>     ```
>     docker-compose up --build
>     ```
> 3. Acesse:
>     - Backend: `http://localhost:8000`
>     - Frontend: `http://localhost:3000`
>
> ---
>## 🔐 Fluxo de Autenticação da API
>
>O sistema utiliza autenticação por token (TokenAuthentication), permitindo que o usuário se registre, faça login e depois utilize o token nas requisições protegidas.
>
>---
>
>### 🔁 Fluxo Geral
>
>1. **Registro de novo usuário**
>2. **Login com usuário registrado**
>3. **Recebimento do token de autenticação**
>4. **Uso do token em todas as requisições protegidas**
>
>---
>
>### 📥 1. Registro de Usuário
>
>- **Endpoint:** `/api/v1/auth/register/`
>- **Método:** `POST`
>- **Corpo (JSON):**
>  ```json
>  {
>    "username": "novo_usuario",
>    "password": "senha_segura",
>    "password2": "senha_segura"
>  }
>````
>
>* **Resposta esperada (201 Created):**
>
>  ```json
>  {
>    "message": "Usuário criado com sucesso.",
>    "user": {
>      "id": 3,
>      "username": "novo_usuario"
>    }
>  }
>  ```
>
>---
>
>### 🔐 2. Login
>
>* **Endpoint:** `/api/v1/auth/login/`
>
>* **Método:** `POST`
>
>* **Corpo (JSON):**
>
>  ```json
>  {
>    "username": "novo_usuario",
>    "password": "senha_segura"
>  }
>  ```
>
>* **Resposta esperada:**
>
>  ```json
>  {
>    "user": {
>      "id": 3,
>      "username": "novo_usuario"
>    },
>    "token": "34a91ab80fa814b01a56bf6818ccc5c8ab8d820e"
>  }
>  ```
>
>---
>
>### 📤 3. Usando o Token nas Requisições
>
>Após obter o token, ele deve ser adicionado no cabeçalho (**Header**) de **todas as requisições autenticadas**, como criar, listar, editar e deletar formulários.
>
>#### 🧾 Header obrigatório:
>
>| Chave         | Valor                                          |
>| ------------- | ---------------------------------------------- |
>| Authorization | Token 34a91ab80fa814b01a56bf6818ccc5c8ab8d820e |
>
> ⚠️ Atenção: Deve conter a palavra `Token`, seguida de espaço e o valor do token.
>
>---
>
>### 📌 Exemplo de Requisição Autenticada
>
>```http
>POST /api/v1/formularios/save/ HTTP/1.1
>Host: localhost:8000
>Authorization: Token 34a91ab80fa814b01a56bf6818ccc5c8ab8d820e
>Content-Type: application/json
>
>{
>  "nome": "Formulário Teste",
>  "descricao": "Criado via API com token"
>}
>```
>
>---
>
>### 🛡️ Segurança
>
>* O token identifica o usuário autenticado em todas as ações.
>* Se o token estiver ausente ou inválido, o sistema retorna `401 Unauthorized`.
>* O usuário autenticado será acessível no backend via `request.user`.
>
>---
>
>### ✅ Dica
>
>Use ferramentas como **Insomnia** ou **Postman** para testar os endpoints, adicionando o token na aba **"Headers"** ou **"Auth"** conforme explicado acima.
>
>---
>
> ## 📚 Notas Finais
> > O sistema foi projetado para ser extensível, seguro e fácil de manter.
> > Novos desenvolvedores devem iniciar entendendo os modelos (`models.py`), os serializers e views.
> > A lógica condicional e campos calculados são exemplos claros do uso de Strategy Pattern aplicado.
