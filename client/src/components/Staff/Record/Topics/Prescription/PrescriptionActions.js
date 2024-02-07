import { CircularProgress } from "@mui/material";
import React from "react";
import SelectSite from "../../../EventForm/SelectSite";

const PrescriptionActions = ({
  handlePrint,
  handleFax,
  handleCancel,
  handleChangeSite,
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
      <SelectSite
        handleChangeSite={handleChangeSite}
        value={siteSelectedId}
        sites={sites}
      />
      {progress && <CircularProgress size="1rem" style={{ margin: "5px" }} />}
    </div>
  );
};

export default PrescriptionActions;
