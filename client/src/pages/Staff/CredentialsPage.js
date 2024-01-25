import React, { useState } from "react";
import { Helmet } from "react-helmet";
import CredentialsForm from "../../components/Staff/Credentials/CredentialsForm";
import VerifyPassword from "../../components/Staff/Credentials/VerifyPassword";

const CredentialsPage = () => {
  const [verified, setVerified] = useState(false);
  return (
    <>
      <Helmet>
        <title>Credentials</title>
      </Helmet>
      <section className="credentials-section">
        <h2 className="credentials-section-title">Change email/password</h2>
        {!verified ? (
          <VerifyPassword setVerified={setVerified} />
        ) : (
          <CredentialsForm />
        )}
      </section>
    </>
  );
};

export default CredentialsPage;
