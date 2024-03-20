import React from "react";

import ReferenceEdocs from "./ReferenceEdocs";
import ReferenceLinks from "./ReferenceLinks";

const Reference = () => {
  return (
    <div className="reference">
      <ReferenceLinks />
      <ReferenceEdocs />
    </div>
  );
};

export default Reference;
