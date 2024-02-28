import React from "react";
import { Helmet } from "react-helmet";
import LoginForm from "../../components/All/Login/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Calvin EMR Login</title>
      </Helmet>
      <section className="login-section">
        {/* <LoginCard /> */}
        <LoginForm />
      </section>
    </>
  );
};

export default LoginPage;
