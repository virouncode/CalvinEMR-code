import dateFormat from "dateformat";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useAuthContext from "../../../hooks/useAuthContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { exportPatientEMR } from "../../../utils/exports/exportsXML.";
import { recordCategories } from "../../../utils/exports/recordCategories";

import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import usePatientsDemographics from "../../../hooks/usePatientsDemographics";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/staffIdToName";
import {
  toPatientFirstName,
  toPatientLastName,
} from "../../../utils/toPatientName";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import MigrationPatientSearchForm from "./MigrationPatientSearchForm";
import MigrationPatientsList from "./MigrationPatientsList";
import MigrationRecordsList from "./MigrationRecordsList";

const MigrationExport = () => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });
  const {
    loading,
    err,
    patientsDemographics,
    setPatientsDemographics,
    hasMore,
  } = usePatientsDemographics(search, paging);

  const [checkedPatientsIds, setCheckedPatientsIds] = useState([]);
  const [allPatientsIdsChecked, setAllPatientsIdsChecked] = useState(false);
  const [checkedRecordsIds, setCheckedRecordsIds] = useState([1]);
  const [allRecordsIdsChecked, setAllRecordsIdsChecked] = useState(false);
  const [progress, setProgress] = useState(false);

  const isPatientIdChecked = (id) => {
    return checkedPatientsIds.includes(parseInt(id)) ? true : false;
  };
  const isRecordIdChecked = (id) => {
    return checkedRecordsIds.includes(parseInt(id)) ? true : false;
  };
  const handleCheckPatientId = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    if (checked) {
      setCheckedPatientsIds([...checkedPatientsIds, id]);
    } else {
      setAllPatientsIdsChecked(false);
      setCheckedPatientsIds(
        checkedPatientsIds.filter((patientId) => patientId !== id)
      );
    }
  };
  const handleCheckRecordId = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    if (checked) {
      setCheckedRecordsIds([...checkedRecordsIds, id]);
    } else {
      setAllRecordsIdsChecked(false);
      setCheckedRecordsIds(
        checkedRecordsIds.filter((recordId) => recordId !== id)
      );
    }
  };
  const isAllPatientsIdsChecked = () => {
    return allPatientsIdsChecked ? true : false;
  };
  const isAllRecordsIdsChecked = () => {
    return allRecordsIdsChecked ? true : false;
  };

  const handleCheckAllPatientsIds = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      const allPatients = (
        await xanoGet("/demographics", axiosXanoAdmin, auth.authToken)
      ).data;
      setPatientsDemographics(allPatients);
      setAllPatientsIdsChecked(true);
      setCheckedPatientsIds(allPatients.map(({ patient_id }) => patient_id));
    } else {
      setCheckedPatientsIds([]);
      setPatientsDemographics([]);
      setPaging({ ...paging, page: 1 });
      setAllPatientsIdsChecked(false);
    }
  };
  const handleCheckAllRecordsIds = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setAllRecordsIdsChecked(true);
      setCheckedRecordsIds(recordCategories.map(({ id }) => id));
    } else {
      setCheckedRecordsIds([1]);
      setAllRecordsIdsChecked(false);
    }
  };

  const handleExport = async () => {
    if (checkedPatientsIds.length === 0) {
      alert("Please choose at least 1 patient !");
      return;
    }
    setProgress(true);
    const dateOfExport = dateFormat(Date.now(), "yyyy-mm-dd_HH-MM-TT");
    try {
      for (let patientId of checkedPatientsIds) {
        const patientInfos = patientsDemographics.find(
          ({ patient_id }) => patient_id === patientId
        );
        const patientFirstName = toPatientFirstName(patientInfos);
        const patientLastName = toPatientLastName(patientInfos);
        const patientDob = dateFormat(patientInfos.DateOfBirth, "ddmmyyyy");
        const doctorFirstName = staffIdToFirstName(
          staffInfos,
          patientInfos.assigned_staff_id
        );
        const doctorLastName = staffIdToLastName(
          staffInfos,
          patientInfos.assigned_staff_id
        );
        const doctorOHIP = staffIdToOHIP(
          staffInfos,
          patientInfos.assigned_staff_id
        );

        const sortedCheckedRecordsIds = [...checkedRecordsIds].sort(
          (a, b) => a - b
        );

        await exportPatientEMR(
          auth.authToken,
          sortedCheckedRecordsIds,
          patientFirstName,
          patientLastName,
          patientId,
          patientDob,
          doctorFirstName,
          doctorLastName,
          doctorOHIP,
          user.name,
          dateOfExport,
          patientInfos
        );
      }
      setProgress(false);
      toast.success("EMR exported successfully in your Downloads folder", {
        containerId: "A",
        autoClose: 5000,
      });
    } catch (err) {
      console.log(err.message);
      setProgress(false);
      toast.error(`EMR export fail, please contact CalvinEMR: ${err.message}`, {
        containerId: "A",
        autoClose: 5000,
      });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
    setPaging({ ...paging, page: 1 });
  };

  return (
    <div className="migration-export">
      <div className="migration-export__form">
        <div className="migration-export__patients">
          <p className="migration-export__patients-title">Patients</p>
          <MigrationPatientSearchForm
            search={search}
            handleSearch={handleSearch}
          />
          <MigrationPatientsList
            isPatientIdChecked={isPatientIdChecked}
            handleCheckPatientId={handleCheckPatientId}
            handleCheckAllPatientsIds={handleCheckAllPatientsIds}
            isAllPatientsIdsChecked={isAllPatientsIdsChecked}
            progress={progress}
            patientsDemographics={patientsDemographics}
            loading={loading}
            err={err}
            hasMore={hasMore}
            setPaging={setPaging}
          />
        </div>
        <div className="migration-export__records">
          <p className="migration-export__records-title">Records</p>
          <MigrationRecordsList
            isRecordIdChecked={isRecordIdChecked}
            handleCheckRecordId={handleCheckRecordId}
            handleCheckAllRecordsIds={handleCheckAllRecordsIds}
            isAllRecordsIdsChecked={isAllRecordsIdsChecked}
            progress={progress}
          />
        </div>
      </div>
      <div className="migration-export__btn">
        <button onClick={handleExport} disabled={progress}>
          Export
        </button>
        {progress && <CircularProgressMedium />}
      </div>
    </div>
  );
};

export default MigrationExport;
