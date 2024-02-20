import React, { useState } from "react";
import { toast } from "react-toastify";
import { deletePatientRecord } from "../../../../../api/fetchRecords";
import {
  dosageUnitCT,
  frequencyCT,
  strengthUnitCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { isMedicationActive } from "../../../../../utils/isMedicationActive";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../../All/UI/Windows/FakeWindow";
import SignCell from "../SignCell";
import MedicationDetails from "./MedicationDetails";

const MedicationItem = ({ item, lastItemRef = null }) => {
  //HOOKS
  const { user } = useUserContext();
  const { auth } = useAuthContext();
  const { socket } = useSocketContext();
  const [detailVisible, setDetailVisible] = useState(false);

  //HANDLERS
  const handleDetailClick = (e) => {
    setDetailVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord(
          "/medications",
          item.id,
          auth.authToken,
          socket,
          "MEDICATIONS AND TREATMENTS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete medication item: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  return (
    item && (
      <>
        <tr
          className="medications__item"
          style={{
            backgroundColor: isMedicationActive(item.StartDate, item.duration)
              ? "#FEFEFE"
              : "#cecdcd",
          }}
          ref={lastItemRef}
        >
          <td>
            {isMedicationActive(item.StartDate, item.duration)
              ? "Active"
              : "Inactive"}
          </td>
          <td>{item.DrugName}</td>
          <td>
            {item.Strength.Amount}{" "}
            {toCodeTableName(strengthUnitCT, item.Strength.UnitOfMeasure) ||
              item.Strength.UnitOfMeasure}
          </td>
          <td>
            {item.Dosage}{" "}
            {toCodeTableName(dosageUnitCT, item.DosageUnitOfMeasure) ||
              item.DosageUnitOfMeasure}
          </td>
          <td>
            {toCodeTableName(frequencyCT, item.Frequency) || item.Frequency}
          </td>
          <td>{item.Duration}</td>
          <SignCell item={item} />
          <td>
            <div className="medications__item-btn-container">
              <button onClick={handleDetailClick}>See details</button>
              {user.title === "Doctor" && (
                <button onClick={handleDeleteClick}>Delete</button>
              )}
            </div>
          </td>
        </tr>
        {detailVisible && (
          <tr>
            <td>
              <FakeWindow
                title="MEDICATION DETAILS"
                width={600}
                height={750}
                x={(window.innerWidth - 600) / 2}
                y={(window.innerHeight - 750) / 2}
                color="#931621"
                setPopUpVisible={setDetailVisible}
              >
                <MedicationDetails item={item} />
              </FakeWindow>
            </td>
          </tr>
        )}
      </>
    )
  );
};

export default MedicationItem;
