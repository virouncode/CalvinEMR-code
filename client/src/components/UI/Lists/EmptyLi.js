import React from "react";

const EmptyLi = ({ text, paddingLateral = 0 }) => {
  return (
    <li style={{ padding: `0 ${paddingLateral}px` }} className="empty-li">
      {text}
    </li>
  );
};

export default EmptyLi;
