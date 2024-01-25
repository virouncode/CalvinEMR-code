import { Helmet } from "react-helmet";
import AccountPatientForm from "../../components/Patient/AccountPatient/AccountPatientForm";

const PatientAccountPage = () => {
  return (
    <>
      <Helmet>
        <title>My account</title>
      </Helmet>
      <section className="patient-account-section">
        <h2 className="patient-account-section-title">
          My personal informations
        </h2>
        <AccountPatientForm />
      </section>
    </>
  );
};

export default PatientAccountPage;
