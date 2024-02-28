import { Helmet } from "react-helmet";
import AccountPatientForm from "../../components/Patient/AccountPatient/AccountPatientForm";
import useTitle from "../../hooks/useTitle";

const PatientAccountPage = () => {
  useTitle("My personal informations");
  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>
      <section className="patient-account-section">
        <AccountPatientForm />
      </section>
    </>
  );
};

export default PatientAccountPage;
