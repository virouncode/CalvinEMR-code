import { useState } from "react";
import { Helmet } from "react-helmet";
import CredentialsFormPatient from "../../components/Patient/Credentials/CredentialsFormPatient";
import VerifyPasswordPatient from "../../components/Patient/Credentials/VerifyPasswordPatient";
import useTitle from "../../hooks/useTitle";

const PatientCredentialsPage = () => {
  const [verified, setVerified] = useState(false);
  useTitle("Change email/password");

  return (
    <>
      <Helmet>
        <title>Credentials</title>
      </Helmet>
      <section className="credentials-section">
        {!verified ? (
          <VerifyPasswordPatient setVerified={setVerified} />
        ) : (
          <CredentialsFormPatient />
        )}
      </section>
    </>
  );
};

export default PatientCredentialsPage;
