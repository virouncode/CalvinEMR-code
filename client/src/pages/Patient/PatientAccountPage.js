import { Helmet } from "react-helmet";
import MyAccountPatient from "../../components/Patient/AccountPatient/MyAccountPatient";
import useTitle from "../../hooks/useTitle";

const PatientAccountPage = () => {
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

export default PatientAccountPage;
