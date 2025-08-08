ºJustifique escolhas técnicas: A principal e melhor decisão arquitetónica que tomei foi a separação de responsabilidades, distribuindo a lógicas de negocios entre front e back, optei por python e django com Django REST framework
por dois motivos, é a linguagem no momento que digamos eu esteja com a mente 'fresca' e é a linguam e framework que é o meu ponto forte, eu posicionei juntamente como fonte central de responsabilidades
para admnistrar as regras de negocio, utilizei o classed base views junto com o strategy pattern, na minha opnião é a melhor combinação para se usar em desenvolvimento web com py e django
classed base view eu consigo manter muitplas classes digamos que atuando junto com o mesmo proposito de manipular os dados do models e o strategy pattern entra em ação justamente com os serializers
que é o ponto chave para vadidação de regras de negocios. com a experiencia que eu tenho dessa forma melhora significativamente a usabilidade e manutenção do codigo 
A escolha de usar Docker e Docker Compose desde o início mitiga riscos de ambiente e trata a infraestrutura como código, uma prática recomendada que simplifica a implementação e a escalabilidade.


ºExplique o raciocínio de arquitetura: A minha primeira grande sacada foi separar a ideia do formulário de suas versões, um formulario é a entidade principal como relatório de despesas. Mas cada vez que eu mudo um campo nele, 
eu não altero o passado, eu crio uma nova foto daquele momento, um FormularioSchemas. Isso foi muito imnportante porque garante que as respostas antigas continuem fazendo sentido,
 amarradas à versão exata do formulário que a pessoa preencheu.
Para a parte das validações, a ideia era não criar um monstro de ifs e elses. Em vez disso usei uma abordagem onde cada tipo de campo texto, número, etc. e cada lógica complexa 
como checar dependências ou condicionais tem sua própria caixinha de regras digamos assim, seus próprios arquivos de validação em backend/forms/validations/. Isso torna o sistema 
muito mais fácil de manter e expandir. Se amanhã eu quiser criar um campo de "upload de arquivo", eu só preciso criar a sua própria lógica de validação sem mexer no resto do código.


º Destaque pontos críticos do sistema: pensando nos pontos onde o sistema precisa ser a prova de bala, eu destacaria algumas áreas . Não são necessariamente problemas, mas são as partes mais importantes que, 
se falharem, comprometem todo o resto o primeiro e mais óbvio é toda a lógica de validação no backend. Os ficheiros dentro de backend/forms/validations/ e principalmente 
a forma como são orquestrados em backend/forms/serializers.py são o cérebro do sistema. Se um utilizador conseguir submeter um formulário com uma dependência circular ou 
uma regra mal formada, a aplicação pode começar a comportar-se de forma errada e o  segundo ponto é o processo de versionamento. A lógica em FormularioUpdateView, que cria
uma nova versão em vez de simplesmente alterar a existente,  um bug aqui poderia corromper o histórico de um formulário ou desassociar respostas das suas versões corretas
É por isso que eu usei o transaction.atomic para garantir que a criação de uma nova versão seja uma operação de "tudo ou nada".

ºConsidere possíveis melhorias e otimizações:  eu acredito que para suportar um grande volumes de dados um sistema de cache via redis evitando lentidão, criar testes e essa é provavelmente a melhoria mais importante.
mudar o banco de dados para produção Como já apontei no README.md, o SQLite é ótimo para desenvolver mas para um ambiente real o ideal seria migrar para algo mais robusto como o PostgreSQL, 
que lida melhor com múltiplos acessos em simultâneo. no front end seria Melhorar o feedback de erros: Atualmente, quando a API retorna um erro, eu estou a mostrá-lo com um alert, o que não é muito amigável.
o ideal seria interpretar o erro que o backend envia e mostrar uma mensagem clara junto ao campo que falhou a validação. Centralizar as chamadas à API As chamadas fetch estão espalhadas pelos componentes 
como o Modal.jsx e o Lista.jsx. Seria mais organizado criar um único local, acabei pecando um pouco nesse quesito. não por falta de conhecimento mas por falta de tempo, optei por deixar as apis funcionais
e o ultimo ponto de melhoria seria melhorar o formularioPreview

º Avalie trade-offs entre simplicidade e complexidade:  acredito que a validação em s,. Eu poderia ter criado uma função gigante cheia de ifs para cada tipo de campo. 
Seria mais rápido de escrever no início, mas seria um pesadelo para dar manutenção em vez disso optei por uma estrutura mais complexa, o padrão Strategy, onde cada lógica de 
validação fica no seu próprio ficheiro. O trade-off foi gastar mais tempo a planear a arquitetura, mas ganhei uma simplicidade enorme para futuras refatoraçã pore exemplo agora, 
adicionar um novo tipo de campo é fácil e não quebra nada do que já existe.
