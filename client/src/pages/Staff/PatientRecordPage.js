import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { axiosXanoStaff } from "../../api/xanoStaff";
import PatientRecord from "../../components/Staff/Record/Sections/PatientRecord";
import useAuthContext from "../../hooks/useAuthContext";
import useFetchDatas from "../../hooks/useFetchDatas";
import usePatientDemoSocket from "../../hooks/usePatientDemoSocket";
import useTitle from "../../hooks/useTitle";
import { toPatientName } from "../../utils/toPatientName";

const PatientRecordPage = () => {
  const { id } = useParams();
  const { auth } = useAuthContext();
  const [demographicsInfos, setDemographicsInfos, loading, err] = useFetchDatas(
    `/demographics/${parseInt(id)}`,
    axiosXanoStaff,
    auth.authToken,
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
          />
        </section>
      </>
    )
  );
};

export default PatientRecordPage;
