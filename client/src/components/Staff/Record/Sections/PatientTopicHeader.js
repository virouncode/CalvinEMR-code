import React from "react";
import PopUpButton from "../Buttons/PopUpButton";
import TriangleButton from "../Buttons/TriangleButton";

const PatientTopicHeader = ({
  topic,
  handleTriangleClick,
  handlePopUpClick,
  allContentsVisible,
  popUpButton = true,
}) => {
  return (
    <>
      <TriangleButton
        handleTriangleClick={handleTriangleClick}
        className={
          allContentsVisible ? "triangle triangle--active" : "triangle"
        }
        color="#FEFEFE"
      />
      {topic}
      {popUpButton ? (
        <PopUpButton handlePopUpClick={handlePopUpClick} />
      ) : (
        <div></div>
      )}
    </>
  );
};

export default PatientTopicHeader;
