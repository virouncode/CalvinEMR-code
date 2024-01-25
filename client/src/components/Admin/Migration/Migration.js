import React, { useState } from "react";
import MigrationExport from "./MigrationExport";
import MigrationImport from "./MigrationImport";
import MigrationToggle from "./MigrationToggle";

const Migration = () => {
  const [type, setType] = useState("Export");
  const isTypeChecked = (option) => (option === type ? true : false);
  const handleMigrationTypeChanged = (e) => {
    setType(e.target.value);
  };

  return (
    <>
      <MigrationToggle
        isTypeChecked={isTypeChecked}
        handleMigrationTypeChanged={handleMigrationTypeChanged}
      />
      {type === "Export" ? <MigrationExport /> : <MigrationImport />}
    </>
  );
};

export default Migration;
