import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useBillingSocket from "../../../hooks/useBillingSocket";
import useFetchBillings from "../../../hooks/useFetchBillings";
import useFetchDatas from "../../../hooks/useFetchDatas";
import useUserContext from "../../../hooks/useUserContext";
import BillingFilter from "./BillingFilter";
import BillingForm from "./BillingForm";
import BillingTable from "./BillingTable";

const Billing = () => {
  const { pid } = useParams();
  const { user } = useUserContext();
  const [addVisible, setAddVisible] = useState(false); //Add form
  const [errMsgPost, setErrMsgPost] = useState("");
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const {
    billings,
    setBillings,
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    hasMore,
    loading,
    errMsg,
  } = useFetchBillings(
    paging,
    user.access_level === "Admin" ? "admin" : "staff"
  );

  const [sites] = useFetchDatas(
    "/sites",
    user.access_level === "Admin" ? "admin" : "staff"
  );

  useBillingSocket(billings, setBillings);

  useEffect(() => {
    if (pid) {
      setAddVisible(true);
    }
  }, [pid]);

  const handleAdd = () => {
    setAddVisible(true);
  };

  return (
    <div className="billing">
      {errMsgPost && <p className="billing__err">{errMsgPost}</p>}
      <div className="billing__btn-container">
        {user.title !== "Secretary" && (
          <button onClick={handleAdd} disabled={addVisible}>
            Add Billing
          </button>
        )}
      </div>
      {addVisible && (
        <BillingForm
          setAddVisible={setAddVisible}
          setErrMsgPost={setErrMsgPost}
          sites={sites}
        />
      )}
      <BillingFilter
        billings={billings}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        paging={paging}
        setPaging={setPaging}
      />
      <BillingTable
        billings={billings}
        errMsgPost={errMsgPost}
        setErrMsgPost={setErrMsgPost}
        setPaging={setPaging}
        hasMore={hasMore}
        loading={loading}
        errMsg={errMsg}
        sites={sites}
      />
    </div>
  );
};

export default Billing;
