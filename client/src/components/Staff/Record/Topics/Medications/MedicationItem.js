import React, { useEffect, useState } from "react";
import {
  dosageUnitCT,
  frequencyCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { toLocalDate } from "../../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import FakeWindow from "../../../../All/UI/Windows/FakeWindow";
import MedicationDetails from "./MedicationDetails";

const MedicationItem = ({
  item,
  editCounter,
  setErrMsgPost,
  presVisible,
  setPresVisible,
  medsRx,
  setMedsRx,
  patientId,
}) => {
  //HOOKS
  const { user, clinic } = useAuth();
  const [detailVisible, setDetailVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleDetailClick = (e) => {
    setErrMsgPost("");
    editCounter.current += 1;
    setDetailVisible((v) => !v);
  };

  const handleAddToRxClick = (e) => {
    if (!presVisible) {
      setMedsRx([...medsRx, item]);
      setPresVisible(true);
    } else {
      setMedsRx([...medsRx, item]);
    }
  };
  const handleRemoveFromRxClick = (e) => {
    let newMedsRx = [...medsRx];
    newMedsRx = newMedsRx.filter(({ id }) => id !== item.id);
    setMedsRx(newMedsRx);
  };

  return (
    itemInfos && (
      <>
        <tr className="medications__event">
          <td>{itemInfos.PrescriptionStatus}</td>
          <td>{itemInfos.DrugName}</td>
          <td>{itemInfos.Dosage}</td>
          <td>
            {toCodeTableName(dosageUnitCT, itemInfos.DosageUnitOfMeasure)}
          </td>
          <td>
            {toCodeTableName(frequencyCT, itemInfos.Frequency) ||
              itemInfos.Frequency}
          </td>
          <td>{itemInfos.Duration}</td>
          <td>
            <em>
              {isUpdated(item)
                ? staffIdToTitleAndName(
                    clinic.staffInfos,
                    getLastUpdate(item).updated_by_id,
                    true
                  )
                : staffIdToTitleAndName(
                    clinic.staffInfos,
                    item.created_by_id,
                    true
                  )}
            </em>
          </td>
          <td>
            <em>
              {isUpdated(item)
                ? toLocalDate(getLastUpdate(item).date_updated)
                : toLocalDate(item.date_created)}
            </em>
          </td>
          <td>
            <div className="medications__event-btn-container">
              <button onClick={handleDetailClick}>See details</button>
              {user.title === "Doctor" &&
                (presVisible ? (
                  medsRx.find(({ id }) => id === item.id) ? (
                    <button
                      onClick={handleRemoveFromRxClick}
                      style={{ minWidth: "90px" }}
                    >
                      Rmv From Rx
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToRxClick}
                      style={{ minWidth: "90px" }}
                      disabled={item.PrescriptionStatus !== "Active"}
                    >
                      Add To RX
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleAddToRxClick}
                    style={{ minWidth: "90px" }}
                    disabled={item.PrescriptionStatus !== "Active"}
                  >
                    Add To RX
                  </button>
                ))}
            </div>
          </td>
        </tr>
        {detailVisible && (
          <tr>
            <td>
              <FakeWindow
                title="MEDICATION DETAILS"
                width={900}
                height={600}
                x={(window.innerWidth - 900) / 2}
                y={(window.innerHeight - 600) / 2}
                color="#931621"
                setPopUpVisible={setDetailVisible}
              >
                <MedicationDetails
                  itemInfos={itemInfos}
                  setItemInfos={setItemInfos}
                  setDetailVisible={setDetailVisible}
                  editCounter={editCounter}
                  patientId={patientId}
                  item={item}
                />
              </FakeWindow>
            </td>
          </tr>
        )}
      </>
    )
  );
};

export default MedicationItem;
