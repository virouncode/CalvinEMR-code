import { recordCategories } from "../../../utils/migration/exports/recordCategories";
import MigrationRecordItem from "./MigrationRecordItem";

const MigrationRecordsList = ({
  isRecordIdChecked,
  handleCheckRecordId,
  handleCheckAllRecordsIds,
  isAllRecordsIdsChecked,
  isLoading,
}) => {
  return (
    <ul className="migration-export__records-list">
      <li className="migration-export__records-list-item">
        <input
          type="checkbox"
          onChange={handleCheckAllRecordsIds}
          checked={isAllRecordsIdsChecked()}
          disabled={isLoading}
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
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
};

export default MigrationRecordsList;
