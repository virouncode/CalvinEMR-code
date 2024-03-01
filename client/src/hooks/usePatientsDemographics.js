import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoAdmin } from "../api/xanoAdmin";
import { axiosXanoStaff } from "../api/xanoStaff";
import { toLocalDate } from "../utils/formatDates";
import useAuthContext from "./useAuthContext";
import useUserContext from "./useUserContext";

const usePatientsDemographics = (search, paging) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const [patientsDemographics, setPatientsDemographics] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const axiosXanoInstance =
    user.access_level === "Admin" ? axiosXanoAdmin : axiosXanoStaff;

  useEffect(() => {
    setPatientsDemographics([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchPatientsDemographics = async () => {
      try {
        setLoading(true);
        setErr(false);
        const response = await axiosXanoInstance.get(
          "/demographics_search_paging",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              paging,
              search,
            },
            signal: abortController.signal,
          }
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
              )?.phoenNumber.includes(search.phone))
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
  }, [auth.authToken, paging, search]);

  return {
    loading,
    err,
    patientsDemographics,
    setPatientsDemographics,
    hasMore,
  };
};

export default usePatientsDemographics;
