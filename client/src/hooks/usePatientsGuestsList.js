import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import xanoGet from "../api/xanoCRUD/xanoGet";
import { toLocalDate } from "../utils/formatDates";

const usePatientsGuestsList = (search, paging, patients_guests_ids) => {
  const [patientsDemographics, setPatientsDemographics] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setPatientsDemographics([]);
  }, [search, patients_guests_ids]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPatientsDemographics = async () => {
      const patientsGuestsIds = patients_guests_ids
        ? patients_guests_ids.length > 0
          ? patients_guests_ids
              .filter((item) => item)
              .map(({ patient_infos }) => patient_infos.patient_id)
          : []
        : [];
      try {
        setLoading(true);
        setErr(false);
        const response = await xanoGet(
          "/demographics_search",
          "staff",
          {
            paging,
            search,
          },
          abortController
        );
        //Because we can't filter those things in Xano
        const filteredDatas = response.data.items.filter(
          (item) =>
            toLocalDate(item.DateOfBirth).includes(search.birth) &&
            (item.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber.includes(search.phone) ||
              item.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "R"
              )?.phoneNumber.includes(search.phone) ||
              item.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "W"
              )?.phoenNumber.includes(search.phone)) &&
            !patientsGuestsIds.includes(item.patient_id)
        );
        if (abortController.signal.aborted) return;
        setPatientsDemographics((prevDatas) => [
          ...prevDatas,
          ...filteredDatas,
        ]);
        setHasMore(filteredDatas.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(
            `Error: unable to get patients demographics: ${err.message}`,
            {
              containerId: "A",
            }
          );
          setErr(true);
        }
        setLoading(false);
      }
    };
    fetchPatientsDemographics();
    return () => abortController.abort();
  }, [paging, patients_guests_ids, search]);

  return {
    loading,
    err,
    patientsDemographics,
    setPatientsDemographics,
    hasMore,
  };
};

export default usePatientsGuestsList;
