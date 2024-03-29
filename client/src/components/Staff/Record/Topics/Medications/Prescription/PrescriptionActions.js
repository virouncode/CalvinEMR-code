import React from "react";
import CircularProgressMedium from "../../../../../UI/Progress/CircularProgressMedium";
import SiteSelect from "../../../../EventForm/SiteSelect";

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
      <SiteSelect
        handleSiteChange={handleSiteChange}
        value={siteSelectedId}
        sites={sites}
      />
      {progress && <CircularProgressMedium />}
    </div>
  );
};

export default PrescriptionActions;
