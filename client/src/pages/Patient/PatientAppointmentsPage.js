import { Helmet } from "react-helmet";
import PatientAppointments from "../../components/Patient/AppointmentsPatient/PatientAppointments";

const PatientAppointmentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Appointments</title>
      </Helmet>
      <section className="patient-appointments-section">
        <h2 className="patient-appointments-section-title">Appointments</h2>
        <div className="patient-appointments-section-content">
          <PatientAppointments />
        </div>
      </section>
    </>
  );
};

export default PatientAppointmentsPage;
