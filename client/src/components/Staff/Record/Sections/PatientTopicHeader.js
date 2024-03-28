import React from "react";
import PaperPlaneButton from "../../../UI/Buttons/PaperPlaneButton";
import PopUpButton from "../../../UI/Buttons/PopUpButton";
import TriangleButton from "../../../UI/Buttons/TriangleButton";

const PatientTopicHeader = ({
  topic,
  handleTriangleClick,
  handlePopUpClick,
  contentsVisible,
  popUpButton,
  triangleRef,
}) => {
  return (
    <>
      <TriangleButton
        handleTriangleClick={handleTriangleClick}
        className={contentsVisible ? "triangle triangle--active" : "triangle"}
        color="#FEFEFE"
        triangleRef={triangleRef}
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
