import React, { useRef, useState } from "react";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useFetchDatas from "../../../../hooks/useFetchDatas";
import useTopicSocket from "../../../../hooks/useTopicSocket";
import { isObjectEmpty } from "../../../../utils/isObjectEmpty";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import CircularProgressMedium from "../../../All/UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import PharmaciesList from "../Topics/Pharmacies/PharmaciesList";
import PharmacyCard from "../Topics/Pharmacies/PharmacyCard";

const PharmaciesPU = ({
  patientId,
  topicDatas,
  loading,
  errMsg,
  hasMore,
  setPaging,
  setPopUpVisible,
  demographicsInfos,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const { auth } = useAuthContext();
  const [
    preferredPharmacy,
    setPreferredPharmacy,
    loadingPharmacy,
    errPharmacy,
  ] = useFetchDatas(
    `/preferred_pharmacy_of_patient`,
    axiosXanoStaff,
    auth.authToken,
    "patient_id",
    patientId,
    true
  );

  useTopicSocket(
    "PREFERRED PHARMACY",
    preferredPharmacy,
    setPreferredPharmacy,
    patientId
  );

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
    setAddVisible((v) => !v);
  };

  return (
    <>
      <h1 className="pharmacies__title">
        Patient preferred pharmacy{" "}
        <i className="fa-solid fa-prescription-bottle-medical"></i>
      </h1>
      {loadingPharmacy ? (
        <CircularProgressMedium />
      ) : errPharmacy ? (
        <p className="pharmacies__err">{errPharmacy}</p>
      ) : !isObjectEmpty(preferredPharmacy) ? (
        <PharmacyCard
          pharmacy={preferredPharmacy}
          demographicsInfos={demographicsInfos}
        />
      ) : (
        <p>No preferred pharmacy</p>
      )}
      <div className="pharmacies__btn-container">
        {isObjectEmpty(preferredPharmacy) ? (
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
          topicDatas={topicDatas}
          loading={loading}
          errMsg={errMsg}
          hasMore={hasMore}
          setPaging={setPaging}
          editCounter={editCounter}
          demographicsInfos={demographicsInfos}
        />
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default PharmaciesPU;
