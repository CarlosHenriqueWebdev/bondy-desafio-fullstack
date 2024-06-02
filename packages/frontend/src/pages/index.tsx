import React from "react";
import { destroyCookie } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import withAuthProtection from "../hoc/withAuthProtection";

const Home = () => {
  const router = useRouter();

  const handleLogout = () => {
    try {
      // Remove the JWT token cookie
      destroyCookie(null, "token");

      // Redirect to the login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Welcome Page</title>
        <style>{`
          body {
            position: relative !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            height: 100vh !important;
            margin: 0 !important;
            background-color: #A4EEF7 !important;
          }
        `}</style>
      </Head>

      <main>
        <div className="welcome-group">
          <h1>Welcome 👋</h1>
          <p onClick={handleLogout}>Logout</p>
        </div>
        <div className="store">
          <div className="awning"></div>
          <div className="window"></div>
          <div className="door"></div>
        </div>
        <div className="cloud"></div>
      </main>
    </>
  );
};

export default withAuthProtection(Home);
