import { CircularProgress } from "@mui/material";
import React from "react";
import AddressesList from "../../../../All/UI/Lists/AddressesList";

const PrescriptionActions = ({
  handlePrint,
  handleFax,
  handleCancel,
  handleSiteChange,
  sites,
  siteSelectedId,
  progress,
}) => {
  return (
    <div className="prescription__actions">
      <button onClick={handlePrint} disabled={progress}>
        Generate & Print
      </button>
      <button onClick={handleFax} disabled={progress}>
        Generate & Fax
      </button>
      <button onClick={handleCancel} disabled={progress}>
        Cancel
      </button>
      <AddressesList
        handleSiteChange={handleSiteChange}
        siteSelectedId={siteSelectedId}
        sites={sites}
      />
      {progress && <CircularProgress />}
    </div>
  );
};

export default PrescriptionActions;
