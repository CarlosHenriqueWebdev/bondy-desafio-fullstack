import React, { useState, useEffect } from "react";
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
      token
      user {
        name
        email
        company
      }
    }
  }
`;

// Login form component
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // useEffect to redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Delay the redirect
      setTimeout(() => {
        navigate('/welcome');
      }, 777);
    }
  }, [navigate]);

  const [login] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      const errorMessages = error.message.split(', ');
      const newErrors = { email: "", password: "", general: "" };

      errorMessages.forEach((errorMessage) => {
        if (errorMessage.includes("Email")) {
          newErrors.email = errorMessage;
        } else if (errorMessage.includes("Email")) {
          newErrors.email = errorMessage;
        } else if (errorMessage.includes("found")) {
          newErrors.email = errorMessage;
        } else if (errorMessage.includes("Password")) {
          newErrors.password = errorMessage;
        } else if (errorMessage.includes("Invalid")) {
          newErrors.password = errorMessage;
        } else {
          newErrors.general = errorMessage;
        }
      });

      setErrors(newErrors);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });

      localStorage.setItem('token', data.login.token);
      navigate('/welcome');
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div id="login-form">
      <div className="fieldset">
        <div className="cool-heading">
          <img src="logo.png" alt="Logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={`row ${errors.email ? "error" : ""}`}>
            <label htmlFor="email">E-mail</label>
            <div className="input-inner-group">

            <input
              id="email"
              type="email"
              placeholder="E-mail"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          </div>
          <div className={`row ${errors.password ? "error" : ""}`}>
            <label htmlFor="password">Password</label>
              <div className="input-inner-group">
            <input
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "input-error" : ""}
            />

            {errors.password && <p className="error-message">{errors.password}</p>}
             </div>
          </div>
          <div className="input-inner-group">
          <input type="submit" value="Login" />
          {errors.general && <p className="error-message">{errors.general}</p>}
      </div>
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
