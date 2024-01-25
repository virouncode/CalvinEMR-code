import React from "react";
import LoginCarousel from "./LoginCarousel";
import LoginForm from "./LoginForm";

const LoginCard = () => {
  return (
    <section className="login-card">
      <LoginCarousel />
      <LoginForm />
    </section>
  );
};

export default LoginCard;
