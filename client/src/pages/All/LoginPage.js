import React from "react";
import { Helmet } from "react-helmet";
import LoginNewCard from "../../components/All/Login/LoginNewCard";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Calvin EMR Login</title>
      </Helmet>
      <section className="login-section">
        {/* <LoginCard /> */}
        <LoginNewCard />
      </section>
    </>
  );
};

export default LoginPage;
