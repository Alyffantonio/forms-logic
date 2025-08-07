> ### 🎯 Objetivo Geral da História
>
> Desenvolver a funcionalidade principal do sistema **Forms-Logic**, que permite a um usuário criar e gerenciar formulários dinâmicos e inteligentes.  
> A funcionalidade deve oferecer uma **interface visual** para a construção de formulários com diversos tipos de campos, validações complexas, lógica condicional para exibição de campos e a capacidade de criar campos cujo valor é calculado a partir de outros.  
> O sistema deve garantir a **integridade dos dados** através de um robusto sistema de validação e **versionamento**, onde cada alteração em um formulário gera uma nova versão, preservando o histórico e a estrutura à qual as respostas estão vinculadas.
>
> ### 🧩 Título da História: Criação e Versionamento de Formulários Dinâmicos
>
> **Como um administrador do sistema Forms-Logic**,  
> **Eu quero** criar e atualizar formulários dinâmicos com múltiplos tipos de campos, validações customizadas e lógica condicional,  
> **Para que** eu possa coletar dados de forma estruturada e inteligente, adaptando-se a diversas necessidades de negócio e garantindo a integridade das informações coletadas.
>
> ### ✅ Critérios de Aceitação
>
> - **Formulário de Criação**: Deve existir uma interface (modal) para a criação de um novo formulário, contendo campos para "Nome" e "Descrição".
> - **Construtor de Campos**: O usuário deve poder adicionar múltiplos campos ao formulário. Cada campo deve possuir um "ID" (único por formulário), um "Rótulo" (Label) e um "Tipo".
> - **Tipos de Campos Suportados**: Texto, Número, Data, Seleção (Select), Booleano (Sim/Não) e Calculado.
> - **Configuração de Validações**: Para cada campo, deve ser possível adicionar regras de validação específicas ao seu tipo (ex: `tamanho_mínimo` e `regex` para texto; `valor_mínimo` e `valor_máximo` para número).
> - **Lógica Condicional**: Deve ser possível configurar um campo para ser exibido somente se uma ou mais condições baseadas nos valores de outros campos forem atendidas.
> - **Campos Calculados**: Um campo do tipo "Calculado" deve permitir a definição de uma fórmula que utiliza os valores de outros campos como variáveis. O sistema deve validar e impedir a criação de dependências circulares.
> - **Preview em Tempo Real**: A interface de criação deve exibir uma pré-visualização do formulário em tempo real, refletindo as configurações de campos, validações e lógicas condicionais à medida que são aplicadas.
> - **Validação de Estrutura**: Antes de salvar, o backend deve validar a estrutura completa do formulário, incluindo a unicidade dos IDs dos campos, a validade das dependências e a sintaxe das expressões condicionais.
> - **Confirmação de Ações**: Após criar ou atualizar um formulário com sucesso, o sistema deve exibir uma mensagem de confirmação para o usuário.
> - **Versionamento Automático**: Ao atualizar um formulário existente, o sistema não deve modificar a versão atual. Em vez disso, deve criar um novo "schema" com um número de versão incrementado, preservando o histórico. A versão anterior é mantida e a nova se torna a ativa.
> - **Visualização de Respostas**: Os usuários finais devem poder preencher e submeter respostas apenas para a versão ativa de um formulário.
