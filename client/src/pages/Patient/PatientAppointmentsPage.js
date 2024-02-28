import { Helmet } from "react-helmet";
import PatientAppointments from "../../components/Patient/AppointmentsPatient/PatientAppointments";
import useTitle from "../../hooks/useTitle";

const PatientAppointmentsPage = () => {
  useTitle("Appointments");
  return (
    <>
      <Helmet>
        <title>Appointments</title>
      </Helmet>
      <section className="patient-appointments-section">
        <div className="patient-appointments-section-content">
          <PatientAppointments />
        </div>
      </section>
    </>
  );
};

export default PatientAppointmentsPage;
