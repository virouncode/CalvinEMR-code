import React from "react";
import CircularProgressSmall from "../Progress/CircularProgressSmall";

const LoadingRow = ({ colSpan }) => {
  return (
    <tr className="loading-row">
      <td colSpan={colSpan}>
        Loading...
        <CircularProgressSmall />
      </td>
    </tr>
  );
};

export default LoadingRow;
