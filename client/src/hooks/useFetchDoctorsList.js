import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoAdmin } from "../api/xanoAdmin";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";
import useUserContext from "./useUserContext";

const useFetchDoctorsList = (search, paging) => {
  const { user } = useUserContext();
  const { auth } = useAuthContext();
  const [doctors, setDoctors] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const axiosXanoInstance =
    user.access_level === "Admin" ? axiosXanoAdmin : axiosXanoStaff;

  useEffect(() => {
    setDoctors([]);
  }, [search]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await xanoGet(
          "/doctors_search",
          axiosXanoInstance,
          auth.authToken,
          {
            search,
            paging,
          },
          abortController
        );
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
  }, [auth.authToken, axiosXanoInstance, paging, search]);

  return { doctors, setDoctors, loading, err, hasMore };
};

export default useFetchDoctorsList;
