import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import useAuth from "../../../hooks/useAuth";
import { toLocalDate } from "../../../utils/formatDates";
import { onMessageBilling } from "../../../utils/socketHandlers/onMessageBilling";

import BillingFilter from "../../Staff/Billing/BillingFilter";
import BillingForm from "../../Staff/Billing/BillingForm";
import BillingTable from "../../Staff/Billing/BillingTable";

const BillingAdmin = () => {
  const { user, auth, socket } = useAuth();
  const [addVisible, setAddVisible] = useState(false); //Add form
  const [billings, setBillings] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [filterDatas, setFilterDatas] = useState({
    date_start: toLocalDate(
      Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    ),
    date_end: toLocalDate(
      Date.parse(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      )
    ),
  }); //current month

  const handleAdd = () => {
    setAddVisible(true);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchBillings = async () => {
      try {
        //all billings
        const response = await axiosXanoAdmin.get(`/billings`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setBillings(response.data.sort((a, b) => b.date - a.date));
      } catch (err) {
        toast.error(`Unable to fetch billings: ${err.message}`, {
          containerId: "A",
        });
      }
    };
    fetchBillings();
    return () => abortController.abort();
  }, [auth.authToken, user.id, user.title]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageBilling(
        message,
        billings,
        setBillings,
        user.id,
        user.title === "Secretary"
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [socket, user.id, user.title, billings]);

  return (
    <div className="billing">
      {errMsg && <p className="billing__err">{errMsg}</p>}
      <div className="billing__btn-container">
        {user.title !== "Secretary" && (
          <button onClick={handleAdd} disabled={addVisible}>
            Add Billing
          </button>
        )}
      </div>
      {addVisible && (
        <BillingForm setAddVisible={setAddVisible} setErrMsg={setErrMsg} />
      )}
      {billings ? (
        <>
          <BillingFilter
            filterDatas={filterDatas}
            setFilterDatas={setFilterDatas}
            billings={billings}
          />
          <BillingTable
            billings={billings}
            setBillings={setBillings}
            setErrMsg={setErrMsg}
            filterDatas={filterDatas}
          />
        </>
      ) : (
        <CircularProgress size="1rem" style={{ margin: "5px" }} />
      )}
    </div>
  );
};

export default BillingAdmin;
