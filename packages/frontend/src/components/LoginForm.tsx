import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { setCookie } from "nookies";
import { useRouter } from "next/router";

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

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("desafio@bondy.com.br");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const router = useRouter();

  const [login] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      const errorMessages = error.message.split(", ");
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
      const { token } = data.login;

      // Set the JWT token as a cookie with HttpOnly and other attributes
      setCookie(null, "token", token, {
        path: "/",
        secure: true,
      });
    } catch (error) {
      console.error("Login error:", error.message);
    }

    router.push("/");
  };

  const showPasswordClickHandler = () => {
    const passwordInput = document.querySelector(
      ".password",
    ) as HTMLInputElement;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      document.querySelectorAll(".hand").forEach((hand) => {
        hand.classList.add("peek");
        hand.classList.remove("hide");
      });
    } else if (passwordInput.type === "text") {
      passwordInput.type = "password";
      document.querySelectorAll(".hand").forEach((hand) => {
        hand.classList.remove("peek");
        hand.classList.add("hide");
      });
    }
  };

  const handleUsernameFocus = (e) => {
    const length = Math.min(e.target.value.length - 16, 19);
    document.querySelectorAll(".hand").forEach((hand) => {
      hand.classList.remove("hide");
      hand.classList.remove("peek");
    });

    document
      .querySelector(".face")
      .style.setProperty("--rotate-head", `${-length}deg`);
  };

  const handleUsernameBlur = () => {
    document.querySelector(".face").style.setProperty("--rotate-head", "0deg");
  };

  const handleUsernameInput = (e) => {
    const length = Math.min(e.target.value.length - 16, 19);
    document
      .querySelector(".face")
      .style.setProperty("--rotate-head", `${-length}deg`);
  };

  const handlePasswordFocus = () => {
    document.querySelectorAll(".hand").forEach((hand) => {
      hand.classList.add("hide");
    });
    document.querySelector(".tongue").classList.remove("breath");
  };

  const handlePasswordBlur = () => {
    document.querySelectorAll(".hand").forEach((hand) => {
      hand.classList.remove("hide");
      hand.classList.remove("peek");
    });
    document.querySelector(".tongue").classList.add("breath");
  };

  return (
    <form onSubmit={handleSubmit} className="login">
      <label>
        <div className="fa fa-phone"></div>
        <input
          className="email"
          value={email}
          onFocus={handleUsernameFocus}
          onBlur={handleUsernameBlur}
          onInput={handleUsernameInput}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="on"
          placeholder="Your Email"
        />
      </label>
      {errors.email && <p className="error-message">{errors.email}</p>}

      <label>
        <div className="fa fa-commenting"></div>
        <input
          className="password"
          value={password}
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="off"
          placeholder="Your Password"
        />
        <button
          type="button"
          className="password-button"
          onClick={showPasswordClickHandler}
        >
          View
        </button>
      </label>
      {errors.password && <p className="error-message">{errors.password}</p>}
      <button type="submit" className="login-button">
        Login
      </button>
      {errors.general && <p className="error-message">{errors.general}</p>}
    </form>
  );
};

export default LoginForm;
