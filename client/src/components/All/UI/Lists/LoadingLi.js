import React from "react";
import CircularProgressSmall from "../Progress/CircularProgressSmall";

const LoadingLi = () => {
  return (
    <li className="loading-li">
      Loading...
      <CircularProgressSmall />
    </li>
  );
};

export default LoadingLi;
