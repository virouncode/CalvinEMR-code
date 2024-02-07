import { CircularProgress } from "@mui/material";
import dateFormat from "dateformat";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { exportPatientEMR } from "../../../utils/exports/exportsXML.";
import { recordCategories } from "../../../utils/exports/recordCategories";
import {
  patientIdToFirstName,
  patientIdToLastName,
} from "../../../utils/patientIdToName";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/staffIdToName";
import MigrationPatientSearchForm from "./MigrationPatientSearchForm";
import MigrationPatientsList from "./MigrationPatientsList";
import MigrationRecordsList from "./MigrationRecordsList";

const MigrationExport = () => {
  const { auth, clinic, user } = useAuth();
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    sin: "",
  });
  const [checkedPatientsIds, setCheckedPatientsIds] = useState([]);
  const [allPatientsIdsChecked, setAllPatientsIdsChecked] = useState(false);
  const [checkedRecordsIds, setCheckedRecordsIds] = useState([1]);
  const [allRecordsIdsChecked, setAllRecordsIdsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCheckAllPatientsIds = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setAllPatientsIdsChecked(true);
      setCheckedPatientsIds(
        clinic.demographicsInfos.map(({ patient_id }) => patient_id)
      );
    } else {
      setCheckedPatientsIds([]);
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
    setIsLoading(true);
    const dateOfExport = dateFormat(Date.now(), "yyyy-mm-dd_HH-MM-TT");
    try {
      for (let patientId of checkedPatientsIds) {
        const patientFirstName = patientIdToFirstName(
          clinic.demographicsInfos,
          patientId
        );
        const patientLastName = patientIdToLastName(
          clinic.demographicsInfos,
          patientId
        );
        const patientDob = dateFormat(
          clinic.demographicsInfos.find(
            ({ patient_id }) => patient_id === patientId
          ).DateOfBirth,
          "ddmmyyyy"
        );
        const doctorFirstName = staffIdToFirstName(
          clinic.staffInfos,
          clinic.demographicsInfos.find(
            ({ patient_id }) => patient_id === patientId
          ).assigned_staff_id
        );
        const doctorLastName = staffIdToLastName(
          clinic.staffInfos,
          clinic.demographicsInfos.find(
            ({ patient_id }) => patient_id === patientId
          ).assigned_staff_id
        );
        const doctorOHIP = staffIdToOHIP(
          clinic.staffInfos,
          clinic.demographicsInfos.find(
            ({ patient_id }) => patient_id === patientId
          ).assigned_staff_id
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
          clinic.demographicsInfos
        );
      }
      setIsLoading(false);
      toast.success("EMR exported successfully in your Downloads folder", {
        containerId: "A",
        autoClose: 5000,
      });
    } catch (err) {
      console.log(err.message);
      setIsLoading(false);
      toast.error(`EMR export fail, please contact CalvinEMR: ${err.message}`, {
        containerId: "A",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="migration-export">
      <div className="migration-export__form">
        <div className="migration-export__patients">
          <p className="migration-export__patients-title">Patients</p>
          <MigrationPatientSearchForm search={search} setSearch={setSearch} />
          <MigrationPatientsList
            isPatientIdChecked={isPatientIdChecked}
            handleCheckPatientId={handleCheckPatientId}
            search={search}
            handleCheckAllPatientsIds={handleCheckAllPatientsIds}
            isAllPatientsIdsChecked={isAllPatientsIdsChecked}
            isLoading={isLoading}
          />
        </div>
        <div className="migration-export__records">
          <p className="migration-export__records-title">Records</p>
          <MigrationRecordsList
            isRecordIdChecked={isRecordIdChecked}
            handleCheckRecordId={handleCheckRecordId}
            search={search}
            handleCheckAllRecordsIds={handleCheckAllRecordsIds}
            isAllRecordsIdsChecked={isAllRecordsIdsChecked}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="migration-export__btn">
        <button onClick={handleExport} disabled={isLoading}>
          Export
        </button>
        {isLoading && (
          <CircularProgress size="1rem" style={{ margin: "5px" }} />
        )}
      </div>
    </div>
  );
};

export default MigrationExport;
