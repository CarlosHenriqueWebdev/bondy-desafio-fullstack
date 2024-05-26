import React, { useState } from "react";
import { ApolloProvider, useMutation, gql } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useNavigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Welcome from "./Welcome";

// Apollo client configuration
const client = new ApolloClient({
  uri: "http://localhost:3000/local/desafio",
  cache: new InMemoryCache(),
});

// GraphQL mutation for logging in
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      name
      email
      company
      password
    }
  }
`;

// Login form component
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      console.log("Login successful!", data.login);
      navigate('/welcome');
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div id="login-form">
      <div className="fieldset">
        <legend>Login Page</legend>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="E-mail"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error">Error: {errorMessage}</p>}
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

// Main App component
function App() {
  return (
    <ApolloProvider client={client}>
      <Routes>
        <Route exact path="/" element={<LoginForm />} />
        <Route exact path="/welcome" element={<Welcome />} />
      </Routes>
    </ApolloProvider>
  );
}

export default App;
