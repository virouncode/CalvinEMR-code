import { recordCategories } from "../../../utils/exports/recordCategories";
import MigrationRecordItem from "./MigrationRecordItem";

const MigrationRecordsList = ({
  isRecordIdChecked,
  handleCheckRecordId,
  handleCheckAllRecordsIds,
  isAllRecordsIdsChecked,
}) => {
  return (
    <ul className="migration-export__records-list">
      <li className="migration-export__records-list-item">
        <input
          type="checkbox"
          onChange={handleCheckAllRecordsIds}
          checked={isAllRecordsIdsChecked()}
        />
        <label>All</label>
      </li>
      {recordCategories.map((record) => (
        <MigrationRecordItem
          key={record.id}
          name={record.name}
          label={record.label}
          handleCheckRecord={handleCheckRecordId}
          isRecordChecked={isRecordIdChecked}
          recordId={record.id}
        />
      ))}
    </ul>
  );
};

export default MigrationRecordsList;
