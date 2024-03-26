import { useState } from "react";
import { Helmet } from "react-helmet";
import CredentialsFormAdmin from "../../components/Admin/CredentialsAdmin/CredentialsFormAdmin";
import VerifyPasswordAdmin from "../../components/Admin/CredentialsAdmin/VerifyPasswordAdmin";
import useTitle from "../../hooks/useTitle";

const AdminCredentialsPage = () => {
  const [verified, setVerified] = useState(false);
  useTitle("Change email/password");

  return (
    <>
      <Helmet>
        <title>Credentials</title>
      </Helmet>
      <section className="credentials-section">
        {!verified ? (
          <VerifyPasswordAdmin setVerified={setVerified} />
        ) : (
          <CredentialsFormAdmin />
        )}
      </section>
    </>
  );
};

export default AdminCredentialsPage;
