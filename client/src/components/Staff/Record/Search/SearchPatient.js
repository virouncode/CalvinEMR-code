import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { onMessageSearchPatients } from "../../../../utils/socketHandlers/onMessageSearchPatients";
import PatientSearchForm from "./PatientSearchForm";
import PatientSearchResult from "./PatientSearchResult";

const SearchPatient = () => {
  const { clinic, socket, setClinic } = useAuth();
  const [sortedPatientsInfos, setSortedPatientsInfos] = useState(
    clinic.demographicsInfos
  );
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageSearchPatients(
        message,
        sortedPatientsInfos,
        setSortedPatientsInfos,
        clinic,
        setClinic
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [clinic, setClinic, socket, sortedPatientsInfos]);

  return (
    <>
      <PatientSearchForm setSearch={setSearch} search={search} />
      <PatientSearchResult
        search={search}
        sortedPatientsInfos={sortedPatientsInfos}
      />
    </>
  );
};

export default SearchPatient;
