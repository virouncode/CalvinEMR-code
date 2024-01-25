import React from "react";

const PopUpButton = ({ handlePopUpClick }) => {
  return (
    <i
      className="fa-solid fa-arrow-up-right-from-square fa-sm"
      style={{ color: "#FEFEFE" }}
      onClick={handlePopUpClick}
    ></i>
  );
};

export default PopUpButton;
