import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../api/xanoStaff";
import { toLocalDate } from "../utils/formatDates";
import useAuthContext from "./useAuthContext";

const usePatientsGuestsList = (search, paging, patients_guests_ids) => {
  const { auth } = useAuthContext();
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
          ? patients_guests_ids.map(
              ({ patient_infos }) => patient_infos.patient_id
            )
          : []
        : [];
      try {
        setLoading(true);
        setErr(false);
        const response = await axiosXanoStaff.get("/demographics_search", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          params: {
            paging,
            search,
          },
          signal: abortController.signal,
        });
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
  }, [auth.authToken, paging, patients_guests_ids, search]);

  return {
    loading,
    err,
    patientsDemographics,
    setPatientsDemographics,
    hasMore,
  };
};

export default usePatientsGuestsList;
