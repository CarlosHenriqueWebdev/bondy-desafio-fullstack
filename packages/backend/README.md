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
npm test
```