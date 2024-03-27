import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../api/xanoCRUD/xanoGet";
import useUserContext from "./context/useUserContext";

const useFetchPatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await xanoGet(
          "/appointments_of_patient",
          "patient",
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
  }, [user.id]);

  return { appointments, setAppointments, loading, err };
};

export default useFetchPatientAppointments;
