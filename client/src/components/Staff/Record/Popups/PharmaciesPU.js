import React, { useEffect, useRef, useState } from "react";
import useTopicSocket from "../../../../hooks/useTopicSocket";
import { isObjectEmpty } from "../../../../utils/isObjectEmpty";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import PharmaciesList from "../Topics/Pharmacies/PharmaciesList";
import PharmacyCard from "../Topics/Pharmacies/PharmacyCard";

const PharmaciesPU = ({
  topicDatas,
  setTopicDatas,
  loading,
  setLoading,
  errMsg,
  setErrMsg,
  hasMore,
  setHasMore,
  paging,
  setPaging,
  patientId,
  setPopUpVisible,
  demographicsInfos,
}) => {
  //HOOKS
  const editCounter = useRef(0);
  const [addVisible, setAddVisible] = useState(false);
  const [preferredPharmacy, setPreferredPharmacy] = useState({});

  useEffect(() => {
    setPreferredPharmacy(demographicsInfos.preferred_pharmacy);
  }, [demographicsInfos.preferred_pharmacy]);

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
      {!isObjectEmpty(preferredPharmacy) ? (
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
          setTopicDatas={setTopicDatas}
          loading={loading}
          setLoading={setLoading}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
          hasMore={hasMore}
          setHasMore={setHasMore}
          paging={paging}
          setPaging={setPaging}
          patientId={patientId}
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
