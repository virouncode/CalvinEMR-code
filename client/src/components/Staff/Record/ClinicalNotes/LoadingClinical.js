import React from "react";
import CircularProgressSmall from "../../../UI/Progress/CircularProgressSmall";

const LoadingClinical = () => {
  return (
    <div style={{ padding: "10px" }}>
      Loading...
      <CircularProgressSmall />
    </div>
  );
};

export default LoadingClinical;
