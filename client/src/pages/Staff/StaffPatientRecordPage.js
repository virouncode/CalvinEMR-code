import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import PatientRecord from "../../components/Staff/Record/Sections/PatientRecord";
import usePatientDemoSocket from "../../hooks/socket/usePatientDemoSocket";
import useFetchDatas from "../../hooks/useFetchDatas";
import useTitle from "../../hooks/useTitle";
import { toPatientName } from "../../utils/names/toPatientName";

const StaffPatientRecordPage = () => {
  const { id } = useParams();
  const [demographicsInfos, setDemographicsInfos, loading, err] = useFetchDatas(
    `/demographics/${parseInt(id)}`,
    "staff",
    null,
    null,
    true
  );
  usePatientDemoSocket(demographicsInfos, setDemographicsInfos);
  useTitle("Patient Medical Record");
  return (
    demographicsInfos && (
      <>
        <Helmet>
          <title>{`EMR: ${toPatientName(demographicsInfos)}`}</title>
        </Helmet>
        <section className="patient-record-section">
          <PatientRecord
            demographicsInfos={demographicsInfos}
            setDemographicsInfos={setDemographicsInfos}
            loadingPatient={loading}
            errPatient={err}
            patientId={parseInt(id)}
          />
        </section>
      </>
    )
  );
};

export default StaffPatientRecordPage;
