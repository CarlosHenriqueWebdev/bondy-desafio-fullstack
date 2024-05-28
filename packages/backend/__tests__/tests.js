/* eslint-disable prettier/prettier */
const axios = require('axios')

describe('Apollo Server', () => {
  const endpoint = process.env.ENDPOINT

  it('should respond to a simple unathorized query', async () => {
    const query = {
      query: `
        query {
          isAuthorized
        }
      `,
    }

    const response = await axios.post(endpoint, query, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(response.data).toHaveProperty('data.isAuthorized', null)
  })

  it("should give a error with a message if information isn't correct on login", async () => {
    // Perform a login mutation to get a valid token
    const loginMutation = {
      query: `
        mutation {
          login(email: "unknownUser@gmail.com", password: "wrongPassword") {
            token
            user {
              name
              email
            }
          }
        }
      `,
    }

    const loginResponse = await axios.post(endpoint, loginMutation, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Check the login response for errors
    expect(loginResponse.data).toHaveProperty('errors')
    expect(loginResponse.data.errors[0]).toHaveProperty('message')
  })

  it('should give login info on sucessfull login, access unathorized space, and be able to logout', async () => {
    // Perform a login mutation to get a valid token
    const loginMutation = {
      query: `
        mutation {
          login(email: "desafio@bondy.com.br", password: "123456") {
            token
            user {
              name
              email
            }
          }
        }
      `,
    }

    const loginResponse = await axios.post(endpoint, loginMutation, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Check the login response
    expect(loginResponse.data).toHaveProperty('data.login')
    expect(loginResponse.data.data.login).toHaveProperty('token')
    expect(loginResponse.data.data.login).toHaveProperty('user')
    expect(loginResponse.data.data.login.user).toHaveProperty(
      'name',
      'Usuário teste'
    )
    expect(loginResponse.data.data.login.user).toHaveProperty(
      'email',
      'desafio@bondy.com.br'
    )

    const accessQuery = {
      query: `
        query {
          isAuthorized
        }
      `,
    }

    const accessResponse = await axios.post(endpoint, accessQuery, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginResponse.data.data.login.token}`,
      },
    })

    expect(accessResponse.data).toHaveProperty('data.isAuthorized', true)

    // Perform a logout mutation
    const logoutMutation = {
      query: `
        mutation {
          logout
        }
      `,
    }

    const logoutResponse = await axios.post(endpoint, logoutMutation, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginResponse.data.data.login.token}`,
      },
    })

    expect(logoutResponse.data).toHaveProperty('data.logout', true)
  })
})
