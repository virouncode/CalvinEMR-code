import React from "react";

const MigrationRecordItem = ({
  label,
  handleCheckRecord,
  isRecordChecked,
  recordId,
  isLoading,
}) => {
  return (
    <li className="migration-export__records-list-item">
      <input
        type="checkbox"
        onChange={handleCheckRecord}
        id={recordId}
        checked={isRecordChecked(recordId)}
        disabled={recordId === 1 || isLoading}
      />
      <label>{label}</label>
    </li>
  );
};

export default MigrationRecordItem;
