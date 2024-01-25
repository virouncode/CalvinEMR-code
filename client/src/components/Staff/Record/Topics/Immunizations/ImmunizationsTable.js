import React, { useState } from "react";
import ImmunizationForm from "./ImmunizationForm";
import ImmunizationItem from "./ImmunizationItem";

const ImmunizationsTable = ({
  demographicsInfos,
  datas,
  setErrMsgPost,
  patientId,
}) => {
  const [addVisible, setAddVisible] = useState(false);

  const handleAdd = () => {
    setAddVisible(true);
  };
  return (
    <>
      <table className="immunizations__table">
        <thead>
          <tr>
            <th>Immunization type</th>
            <th>Immunization brand name</th>
            <th>Manufacturer</th>
            <th>Lot#</th>
            <th>Route</th>
            <th>Site</th>
            <th>Dose</th>
            <th>Date</th>
            <th>Instructions</th>
            <th>Notes</th>
            <th>Updated by</th>
            <th>Updated on</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {addVisible && (
            <ImmunizationForm
              // editCounter={editCounter}
              setAddVisible={setAddVisible}
              patientId={patientId}
              setErrMsgPost={setErrMsgPost}
              // setDatas={setDatas}
              datas={datas}
            />
          )}
          {datas.map((item) => (
            <ImmunizationItem
              key={item.id}
              item={item}
              demographicsInfos={demographicsInfos}
              patientId={patientId}
              setErrMsgPost={setErrMsgPost}
            />
          ))}
        </tbody>
      </table>
      <div className="immunizations__btn-container">
        <button onClick={handleAdd} disabled={addVisible}>
          Add
        </button>
      </div>
    </>
  );
};

export default ImmunizationsTable;
