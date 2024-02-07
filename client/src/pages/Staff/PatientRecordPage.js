import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import PatientRecord from "../../components/Staff/Record/Sections/PatientRecord";
import useAuth from "../../hooks/useAuth";
import { patientIdToName } from "../../utils/patientIdToName";

const PatientRecordPage = () => {
  const params = useParams();
  const { clinic } = useAuth();
  return (
    <>
      <Helmet>
        <title>
          EMR: {patientIdToName(clinic.demographicsInfos, parseInt(params.id))}
        </title>
      </Helmet>
      <section className="patient-record-section">
        <h2 className="patient-record-section__title">
          Patient Medical Record
        </h2>
        <PatientRecord />
      </section>
    </>
  );
};

export default PatientRecordPage;
