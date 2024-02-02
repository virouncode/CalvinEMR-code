import React, { useState } from "react";
import {
  dosageUnitCT,
  frequencyCT,
  strengthUnitCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { isMedicationActive } from "../../../../../utils/isMedicationActive";
import FakeWindow from "../../../../All/UI/Windows/FakeWindow";
import SignCell from "../SignCell";
import MedicationDetails from "./MedicationDetails";

const MedicationItem = ({ item, patientId }) => {
  //HOOKS
  const { clinic } = useAuth();
  const [detailVisible, setDetailVisible] = useState(false);

  //HANDLERS
  const handleDetailClick = (e) => {
    setDetailVisible((v) => !v);
  };

  return (
    item && (
      <>
        <tr
          className="medications__event"
          style={{
            backgroundColor: isMedicationActive(item.StartDate, item.duration)
              ? "#FEFEFE"
              : "#cecdcd",
          }}
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
          <SignCell item={item} staffInfos={clinic.staffInfos} />
          <td>
            <div className="medications__event-btn-container">
              <button onClick={handleDetailClick}>See details</button>
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
                <MedicationDetails
                  item={item}
                  setDetailVisible={setDetailVisible}
                  patientId={patientId}
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
