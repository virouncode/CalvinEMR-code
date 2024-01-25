import React, { useState } from "react";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import AvailabilityEditor from "./AvailabilityEditor";

const Availability = () => {
  const [editVisible, setEditVisible] = useState(false);
  const handleEdit = (e) => {
    setEditVisible((v) => !v);
  };
  return (
    <>
      <div className="calendar__availability">
        <label>Availability</label>
        <i
          onClick={handleEdit}
          style={{ cursor: "pointer" }}
          className="fa-regular fa-pen-to-square"
        ></i>
      </div>
      {editVisible && (
        <FakeWindow
          title="MY AVAILABILITY"
          width={1000}
          height={400}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 400) / 2}
          color={"#94bae8"}
          setPopUpVisible={setEditVisible}
        >
          <AvailabilityEditor setEditVisible={setEditVisible} />
        </FakeWindow>
      )}
    </>
  );
};

export default Availability;
