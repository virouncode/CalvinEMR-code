import React from "react";
import { Helmet } from "react-helmet";
import SignupPatientForm from "../../components/Staff/Signup/SignupPatientForm";
import useTitle from "../../hooks/useTitle";

const StaffSignupPatientPage = () => {
  useTitle("Create a new patient account");
  return (
    <>
      <Helmet>
        <title>New Patient</title>
      </Helmet>
      <section className="signup-section">
        <SignupPatientForm />
      </section>
    </>
  );
};

export default StaffSignupPatientPage;
