import React from "react";
import { Helmet } from "react-helmet";
import LoginCard from "../../components/All/Login/LoginCard";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Calvin EMR Login</title>
      </Helmet>
      <section className="login-section">
        <LoginCard />
      </section>
    </>
  );
};

export default LoginPage;
