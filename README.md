# Instruções de Configuração

## Pré-requisitos

- Node.js (versão 18v ou superior)

### Passos para Executar o Projeto

Clone ou baixe repositório para sua máquina local

Navegue até o diretório do projeto

Instale as dependências do frontend e do backend:

```
cd ./packages/frontend
npm install
```
```
cd ../backend
npm install
```

Inicie o servidor backend **primeiro**:

Para Windows:

Package.json Script de inicialização windows "start-windows": "set NODE_ENV=local&& serverless offline --stage local",

Côdigo:

```
npm run start-windows
```

Caso não esteja no Windows, troque o script de start no package.json para outra coisa se necessário:

Package.json Script de inicialização "start": "NODE_ENV=local serverless offline --stage local"

Côdigo atual se não estiver usando windows:

```
 npm run start
```

Em outra janela do terminal, inicie o frontend:

```
cd ./packages/frontend
npm start
```

Abra seu navegador e acesse http://localhost:3000/local/desafio [Apollo Server] | http://localhost:3001 [Frontend] para visualizar o aplicativo.


# API Documentation

## GraphQL Playground Queries

**Login**: Para fazer login e obter um token, você pode usar a seguinte mutação. Você deve substituir o email e a senha pelos valores corretos que já estão na Query. Use um email e senha inválidos para ver os erros.

```
mutation {
  login(email: "desafio@bondy.com.br", password: "123456") {
    token
    user {
      name
      email
    }
  }
}
```

**Locked Query**: Para testar uma query que só pode ser acessada por usuários logados, você pode usar a seguinte query. Certifique-se de incluir o token recebido no header, com os valores de: Authorization | Bearer [seu-token].
```
query {
  isAuthorized
}
```

**Logout**: Para fazer logout e invalidar o token atual, você pode usar a seguinte mutação.

```
mutation {
  logout
}
```

# Jest

## Executando Testes

### Se você está vendo o projeto backend, pode rodar os testes usando o seguinte comando no diretório raiz:

Para iniciar o servidor:

```
npm run start
```

Para iniciar os testes:

```
npm run test
```

# Extra

## Menssagem

Oi, bom dia! 😊 Este é o projeto Bondy Dev Full Stack que fiz rapidamente.

Por estar no Windows, tive que ajustar o script de inicialização[backend]. Não sei bem qual era a complexidade esperada para este projeto, então, se houver qualquer problema, por favor, me avisem. Gostaria também de saber mais sobre as expectativas de vocês e o que poderia adicionar.

Apreciaria muito um feedback sobre o meu teste. Estou realmente precisando de um emprego e posso trabalhar por um valor menor do que o original da vaga. 💦

Obrigado pela atenção.