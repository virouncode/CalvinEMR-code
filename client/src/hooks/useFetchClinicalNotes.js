import { useEffect, useState } from "react";

import xanoGet from "../api/xanoCRUD/xanoGet";
import useUserContext from "./useUserContext";

const useFetchClinicalNotes = (patientId) => {
  const { user } = useUserContext();
  const [addVisible, setAddVisible] = useState(false);
  const [order, setOrder] = useState(user.settings.clinical_notes_order);
  const [search, setSearch] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [paging, setPaging] = useState({ page: 1, perPage: 5, offset: 0 });

  useEffect(() => {
    setClinicalNotes([]);
  }, [order, search, addVisible]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchClinicalNotes = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        if (addVisible && order === "asc") {
          let hasMoreForAll = true;
          let i = 1;
          while (hasMoreForAll) {
            const response = await xanoGet(
              "/clinical_notes_of_patient",
              "staff",
              {
                patient_id: patientId,
                paging: { page: i, perPage: 40, offset: 0 },
                orderBy: order,
                columnName: "date_created",
                search,
              }
            );
            if (abortController.signal.aborted) return;
            setClinicalNotes((prevDatas) => [
              ...prevDatas,
              ...response.data.items,
            ]);
            hasMoreForAll = response.data.items.length > 0;
            ++i;
          }
        } else {
          const response = await xanoGet(
            "/clinical_notes_of_patient",
            "staff",
            {
              patient_id: patientId,
              paging,
              orderBy: order,
              columnName: "date_created",
              search,
            }
          );
          if (abortController.signal.aborted) return;
          setClinicalNotes((prevDatas) => [
            ...prevDatas,
            ...response.data.items,
          ]);
          setHasMore(response.data.items.length > 0);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.name !== "CanceledError") {
          setErrMsg(err.message);
        }
      }
    };
    fetchClinicalNotes();
    return () => abortController.abort();
  }, [addVisible, order, paging, patientId, search]);

  return {
    addVisible,
    setAddVisible,
    order,
    setOrder,
    search,
    setSearch,
    clinicalNotes,
    setClinicalNotes,
    loading,
    errMsg,
    hasMore,
    setPaging,
    paging,
  };
};

export default useFetchClinicalNotes;
