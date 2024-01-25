import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import PharmaciesList from "../Topics/Pharmacies/PharmaciesList";
import PharmacyCard from "../Topics/Pharmacies/PharmacyCard";

const PharmaciesPU = ({
  patientId,
  setPopUpVisible,
  datas,
  isLoading,
  errMsg,
  demographicsInfos,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //HANDLERS
  const handleClose = async (e) => {
    if (
      editCounter.current === 0 ||
      (editCounter.current > 0 &&
        (await confirmAlert({
          content: "Do you really want to close the window ?",
        })))
    ) {
      setPopUpVisible(false);
    }
  };

  const handleAdd = (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      <h1 className="pharmacies__title">
        Patient preferred pharmacy{" "}
        <i className="fa-solid fa-prescription-bottle-medical"></i>
      </h1>
      {errMsgPost && <div className="pharmacies__err">{errMsgPost}</div>}
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="pharmacies__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            {datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
              ?.Name && (
              <PharmacyCard
                datas={datas}
                demographicsInfos={demographicsInfos}
              />
            )}
            <div className="pharmacies__btn-container">
              {!datas.find(
                ({ id }) => id === demographicsInfos.PreferredPharmacy
              )?.Name ? (
                <button onClick={handleAdd} disabled={addVisible}>
                  Add a preferred pharmacy
                </button>
              ) : (
                <button onClick={handleAdd} disabled={addVisible}>
                  Change
                </button>
              )}
              <button onClick={handleClose}>Close</button>
            </div>
            {addVisible && (
              <PharmaciesList
                datas={datas}
                setErrMsgPost={setErrMsgPost}
                patientId={patientId}
                editCounter={editCounter}
                demographicsInfos={demographicsInfos}
                errMsgPost={errMsgPost}
              />
            )}
          </>
        )
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </>
  );
};

export default PharmaciesPU;
