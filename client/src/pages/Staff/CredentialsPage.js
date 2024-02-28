import React, { useState } from "react";
import { Helmet } from "react-helmet";
import CredentialsForm from "../../components/Staff/Credentials/CredentialsForm";
import VerifyPassword from "../../components/Staff/Credentials/VerifyPassword";
import useTitle from "../../hooks/useTitle";

const CredentialsPage = () => {
  const [verified, setVerified] = useState(false);
  useTitle("Change email/password");
  return (
    <>
      <Helmet>
        <title>Credentials</title>
      </Helmet>
      <section className="credentials-section">
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
