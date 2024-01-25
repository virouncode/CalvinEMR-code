import React from "react";
import { Helmet } from "react-helmet";
import SignupStaffForm from "../components/Signup/SignupStaffForm";

const SignupStaffPage = () => {
  return (
    <>
      <Helmet>
        <title>New Staff Member</title>
      </Helmet>
      <section className="signup-section">
        <h2 className="signup-section__title">
          Create a new staff member account
        </h2>
        <SignupStaffForm />
      </section>
    </>
  );
};

export default SignupStaffPage;
