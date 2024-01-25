import React from "react";
import { Helmet } from "react-helmet";
import SignupPatientForm from "../../components/Staff/Signup/SignupPatientForm";

const SignupPatientPage = () => {
  return (
    <>
      <Helmet>
        <title>New Patient</title>
      </Helmet>
      <section className="signup-section">
        <h2 className="signup-section__title">Create a new patient account</h2>
        <SignupPatientForm />
      </section>
    </>
  );
};

export default SignupPatientPage;
