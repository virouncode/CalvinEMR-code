import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import { toLocalDate } from "../../../utils/formatDates";
import { onMessageBilling } from "../../../utils/socketHandlers/onMessageBilling";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import BillingFilter from "./BillingFilter";
import BillingForm from "./BillingForm";
import BillingTable from "./BillingTable";

const Billing = () => {
  const { pid, date } = useParams();
  const { user, auth, socket } = useAuthContext();
  const [addVisible, setAddVisible] = useState(false); //Add form
  const [billings, setBillings] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [rangeStart, setRangeStart] = useState(
    toLocalDate(
      Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    )
  ); //start of the month
  const [rangeEnd, setRangeEnd] = useState(
    toLocalDate(
      Date.parse(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      )
    )
  ); //end of the month

  useEffect(() => {
    if (pid && date) {
      setAddVisible(true);
    }
  }, [pid, date]);

  const handleAdd = () => {
    setAddVisible(true);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchBillings = async () => {
      try {
        let response;
        if (user.title !== "Secretary") {
          //billings concerning the user in range
          response = await axiosXanoStaff.post(
            `/billings_for_staff_in_range`,
            { range_start: rangeStart, range_end: rangeEnd, staff_id: user.id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
              signal: abortController.signal,
            }
          );
        } else {
          //all billings
          response = await axiosXanoStaff.post(
            `/billings_in_range`,
            { range_start: rangeStart, range_end: rangeEnd },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
              signal: abortController.signal,
            }
          );
        }
        if (abortController.signal.aborted) return;
        setBillings(response.data.sort((a, b) => b.date - a.date));
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(`Unable to fetch billings: ${err.message}`, {
            containerId: "A",
          });
        }
      }
    };
    fetchBillings();
    return () => abortController.abort();
  }, [auth.authToken, rangeEnd, rangeStart, user.id, user.title]);

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
            billings={billings}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            setRangeStart={setRangeStart}
            setRangeEnd={setRangeEnd}
          />
          <BillingTable
            billings={billings}
            errMsg={errMsg}
            setErrMsg={setErrMsg}
          />
        </>
      ) : (
        <CircularProgressMedium />
      )}
    </div>
  );
};

export default Billing;
