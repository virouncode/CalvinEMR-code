import React from "react";
import { Helmet } from "react-helmet";
import useTitle from "../../hooks/useTitle";
import SignupStaffForm from "../components/Signup/SignupStaffForm";

const SignupStaffPage = () => {
  useTitle("Create a new staff member account");
  return (
    <>
      <Helmet>
        <title>New Staff Member</title>
      </Helmet>
      <section className="signup-section">
        <SignupStaffForm />
      </section>
    </>
  );
};

export default SignupStaffPage;
