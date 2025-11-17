Pokedex-tec – Sistema Integrado com Autenticação

Projeto AV3 da disciplina de Técnicas de Integração de Sistemas

Consiste em uma aplicação web, onde o front-end e o back-end se comunicam entre si, utilizando uma arquitetura MVC e integração com APIs externas.

1. Objetivo do Projeto
Desenvolver uma aplicação integrada composta por:
- Comunicação real via HTTP (JSON)
- Autenticação de usuários
- Deploy funcional acessível externamente
- Repositório público e versionamento colaborativo
- Entrega de arquitetura + sistema funcional
 _________________________________________________________

2. Arquitetura do Sistema
O projeto segue o padrão MVC — Model, View e Controller:

Front-end (View)
- HTML
- JavaScript
- CSS  
- Bootstrap  
- Faz requisições ao back-end para buscar dados e autenticar usuários.

Back-end (Model + Controller)
- Python + Flask  
- Controller: Rotas, autenticação e integração com API externa  
- Model: Consumo de API de Pokémons (PokéAPI) e API do Gemini

Integração Entre Sistemas
O sistema possui três níveis de integração:

1. Integração interna:  
   Front-end ⇆ Back-end (Flask)  

2. Integração externa:  
   Back-end ⇆ API pública de Pokémons

3. Integração externa:  
   Back-end ⇆ API Gemini

Deploy
- Plataforma: Render 
- Aplicação do Flask hospedada e acessível externamente  

Ferramentas
- VSCode  
- GitHub  
- Render  
_________________________________________________

3. Autenticação e Segurança

O sistema utiliza autenticação de usuário para controlar o acesso a funcionalidades específicas da aplicação.  
A autenticação é baseada em:
- Envio de credenciais via POST (email e senha)
- Validação no servidor Flask  
- Retorno de token
_________________________________________________

4. Fluxo de Integração:

1. Usuário acessa o front-end
2. Realiza login  
3. O front-end envia os dados ao back-end Flask
4. SQL Alchemy valida o usuário  
5. Após logado, o usuário pode buscar Pokémons  
6. Flask faz requisição para API externa
7. Retorna dados para o front-end
9. Interface exibe nome, imagem e uma descrição gerada pela API do Gemini


