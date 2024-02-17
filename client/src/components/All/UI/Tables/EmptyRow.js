import React from "react";

const EmptyRow = ({ colSpan, text }) => {
  return (
    <tr className="empty-row">
      <td colSpan={colSpan}>{text}</td>
    </tr>
  );
};

export default EmptyRow;
