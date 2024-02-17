import React from "react";

const LoadingRow = ({ colSpan }) => {
  return (
    <tr className="loading-row">
      <td colSpan={colSpan}>Loading...</td>
    </tr>
  );
};

export default LoadingRow;
