import React from "react";
import CircularProgressSmall from "../Progress/CircularProgressSmall";

const LoadingLi = ({ paddingLateral }) => {
  return (
    <li className="loading-li" style={{ padding: `0 ${paddingLateral}px` }}>
      Loading...
      <CircularProgressSmall />
    </li>
  );
};

export default LoadingLi;
