import React from "react";
import Face from "../components/Face";
import LoginForm from "../components/LoginForm";
import Head from "next/head";
import withAuthRedirect from "../hoc/withAuthRedirect";

const Login = () => {
  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <main className="center">
        <Face />
        <LoginForm />
      </main>
    </>
  );
};

export default withAuthRedirect(Login);
