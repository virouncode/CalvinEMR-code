import { Helmet } from "react-helmet";
import MyAccountPatient from "../../components/Patient/MyAccount/MyAccountPatient";
import useTitle from "../../hooks/useTitle";

const PatientMyAccountPage = () => {
  useTitle("My personal informations");
  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>
      <section className="patient-account-section">
        <MyAccountPatient />
      </section>
    </>
  );
};

export default PatientMyAccountPage;
