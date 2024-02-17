import React from "react";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";
import SelectSite from "../../../EventForm/SelectSite";

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
      <SelectSite
        handleSiteChange={handleSiteChange}
        value={siteSelectedId}
        sites={sites}
      />
      {progress && <CircularProgressMedium />}
    </div>
  );
};

export default PrescriptionActions;
