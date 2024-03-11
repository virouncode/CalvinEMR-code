import React from "react";
import PaperPlaneButton from "../Buttons/PaperPlaneButton";
import PopUpButton from "../Buttons/PopUpButton";
import TriangleButton from "../Buttons/TriangleButton";

const PatientTopicHeader = ({
  topic,
  handleTriangleClick,
  handlePopUpClick,
  contentsVisible,
  popUpButton,
}) => {
  return (
    <>
      <TriangleButton
        handleTriangleClick={handleTriangleClick}
        className={contentsVisible ? "triangle triangle--active" : "triangle"}
        color="#FEFEFE"
      />
      {topic}
      {popUpButton === "popUp" ? (
        <PopUpButton handlePopUpClick={handlePopUpClick} />
      ) : popUpButton === "paperPlane" ? (
        <PaperPlaneButton handlePopUpClick={handlePopUpClick} />
      ) : (
        <div></div>
      )}
    </>
  );
};

export default PatientTopicHeader;
