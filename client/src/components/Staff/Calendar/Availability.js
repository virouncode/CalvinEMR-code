import React from "react";
import FakeWindow from "../../UI/Windows/FakeWindow";
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
  editAvailabilityVisible,
  setEditAvailabilityVisible,
}) => {
  const handleEdit = (e) => {
    setEditAvailabilityVisible((v) => !v);
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
      {editAvailabilityVisible && (
        <FakeWindow
          title="MY AVAILABILITY"
          width={1000}
          height={400}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 400) / 2}
          color={"#94bae8"}
          setPopUpVisible={setEditAvailabilityVisible}
        >
          <AvailabilityEditor
            setEditAvailabilityVisible={setEditAvailabilityVisible}
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
