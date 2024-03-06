import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";
import { availabilitySchema } from "../../../validation/availabilityValidation";
import DurationPicker from "../../All/UI/Pickers/DurationPicker";
import AvailabilityItem from "./AvailabilityItem";

const AvailabilityEditor = ({
  setEditVisible,
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
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [progress, setProgress] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    const datasToPut = {
      staff_id: user.id,
      schedule_morning: scheduleMorning,
      schedule_afternoon: scheduleAfternoon,
      unavailability: unavailability,
      default_duration_hours: defaultDurationHours,
      default_duration_min: defaultDurationMin,
      date_created: Date.now(),
    };
    try {
      await availabilitySchema.validate(datasToPut);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      await xanoPut(
        "/availability",
        axiosXanoStaff,
        auth.authToken,
        datasToPut,
        availabilityId
      );
      socket.emit("message", {
        route: "AVAILABILITY",
        action: "update",
        content: { data: datasToPut },
      });
      setEditVisible(false);
      toast.success("Availability saved successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Unable to save availability : ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };
  const handleStartMorningChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleMorningUpdated = { ...scheduleMorning };
    scheduleMorningUpdated[day][0][name] = value;
    setScheduleMorning(scheduleMorningUpdated);
  };
  const handleEndMorningChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleMorningUpdated = { ...scheduleMorning };
    scheduleMorningUpdated[day][1][name] = value;
    setScheduleMorning(scheduleMorningUpdated);
  };

  const handleStartAfternoonChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleAfternoonUpdated = { ...scheduleAfternoon };
    scheduleAfternoonUpdated[day][0][name] = value;
    setScheduleAfternoon(scheduleAfternoonUpdated);
  };
  const handleEndAfternoonChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleAfternoonUpdated = { ...scheduleAfternoon };
    scheduleAfternoonUpdated[day][1][name] = value;
    setScheduleAfternoon(scheduleAfternoonUpdated);
  };
  const handleCheck = (e, day) => {
    const checked = e.target.checked;
    let unavailabilityUpdated = { ...unavailability };
    if (checked) {
      unavailabilityUpdated[day] = true;
    } else {
      unavailabilityUpdated[day] = false;
    }
    setUnavailability(unavailabilityUpdated);
  };
  const handleDurationHoursChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    if (value === "") value = 0;
    setDefaultDurationHours(parseInt(value));
  };
  const handleDurationMinChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    if (value === "") value = 0;
    setDefaultDurationMin(parseInt(value));
  };

  const handleCancel = () => {
    setEditVisible(false);
  };

  return (
    scheduleAfternoon &&
    scheduleMorning &&
    unavailability && (
      <div>
        {errMsg && <p className="availability__err">{errMsg}</p>}
        <div className="availability__heads">
          <p>Morning</p>
          <p>Afternoon</p>
        </div>
        <form className="availability__form" onSubmit={handleSubmit}>
          {days.map((day) => (
            <AvailabilityItem
              day={day}
              handleStartMorningChange={handleStartMorningChange}
              handleEndMorningChange={handleEndMorningChange}
              handleStartAfternoonChange={handleStartAfternoonChange}
              handleEndAfternoonChange={handleEndAfternoonChange}
              handleCheck={handleCheck}
              scheduleMorning={scheduleMorning[day]}
              scheduleAfternoon={scheduleAfternoon[day]}
              unavailable={unavailability[day]}
              key={day}
            />
          ))}
          <div className="availability__duration">
            <label>Default appointment duration</label>
            <DurationPicker
              durationHours={defaultDurationHours.toString()}
              durationMin={defaultDurationMin.toString()}
              handleDurationHoursChange={handleDurationHoursChange}
              handleDurationMinChange={handleDurationMinChange}
              disabled={false}
              title={false}
            />
          </div>
          <div className="availability__btns">
            <input type="submit" value="Save" disabled={progress} />
            <button onClick={handleCancel} disabled={progress}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default AvailabilityEditor;
