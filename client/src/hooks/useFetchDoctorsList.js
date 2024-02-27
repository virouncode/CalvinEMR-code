import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchDoctorsList = (search, paging) => {
  const [doctors, setDoctors] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { auth } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setDoctors([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axiosXanoStaff.get(`/doctors_search`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          params: {
            search,
            paging,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) {
          setLoading(false);
          return;
        }
        setDoctors((prevDatas) => [...prevDatas, ...response.data.items]);
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(`Unable to fetch referring MDs: ${err.message}`, {
            containerId: "A",
          });
          setErr(true);
        }
        setLoading(false);
      }
    };
    fetchDoctors();
    return () => abortController.abort();
  }, [auth.authToken, paging, search]);

  return { doctors, setDoctors, loading, err, hasMore };
};

export default useFetchDoctorsList;
