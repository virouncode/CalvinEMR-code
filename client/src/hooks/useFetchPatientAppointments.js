import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../api/xanoCRUD/xanoGet";
import { axiosXanoPatient } from "../api/xanoPatient";
import useAuthContext from "./useAuthContext";
import useUserContext from "./useUserContext";

const useFetchPatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const { auth } = useAuthContext();
  const { user } = useUserContext();

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await xanoGet(
          "/appointments_of_patient",
          axiosXanoPatient,
          auth.authToken,
          { patient_id: user.id },
          abortController
        );
        if (abortController.signal.aborted) return;
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable fetch your account infos: ${err.message}`,
            {
              containerId: "A",
            }
          );
        setErr(true);
      }
    };
    fetchAppointments();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  return { appointments, setAppointments, loading, err };
};

export default useFetchPatientAppointments;
