import React, { useState } from "react";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import AvailabilityEditor from "./AvailabilityEditor";

const Availability = ({
  scheduleMorning,
  setScheduleMorning,
  scheduleAfternoon,
  setScheduleAfternoon,
  unavailability,
  setUnavailability,
  availabilityId,
  setAvailabilityId,
  defaultDurationHours,
  setDefaultDurationHours,
  defaultDurationMin,
  setDefaultDurationMin,
}) => {
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
          <AvailabilityEditor
            setEditVisible={setEditVisible}
            scheduleMorning={scheduleMorning}
            setScheduleMorning={setScheduleMorning}
            scheduleAfternoon={scheduleAfternoon}
            setScheduleAfternoon={setScheduleAfternoon}
            unavailability={unavailability}
            setUnavailability={setUnavailability}
            availabilityId={availabilityId}
            setAvailabilityId={setAvailabilityId}
            defaultDurationHours={defaultDurationHours}
            setDefaultDurationHours={setDefaultDurationHours}
            defaultDurationMin={defaultDurationMin}
            setDefaultDurationMin={setDefaultDurationMin}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default Availability;
