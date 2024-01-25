import React from "react";

const MigrationToggle = ({ isTypeChecked, handleMigrationTypeChanged }) => {
  return (
    <div className="migration-toggle">
      <div className="migration-toggle__radio">
        <input
          type="radio"
          value="Export"
          name="Export"
          checked={isTypeChecked("Export")}
          onChange={handleMigrationTypeChanged}
          id="export"
        />
        <label htmlFor="export">Export</label>
      </div>
      <div className="messages-toggle__radio">
        <input
          type="radio"
          value="Import"
          name="Import"
          checked={isTypeChecked("Import")}
          onChange={handleMigrationTypeChanged}
          id="import"
        />
        <label htmlFor="import">Import</label>
      </div>
    </div>
  );
};

export default MigrationToggle;
