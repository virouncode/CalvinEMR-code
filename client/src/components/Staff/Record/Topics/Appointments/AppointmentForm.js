import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { getAvailableRooms } from "../../../../../api/getAvailableRooms";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import {
  fromLocalToISOStringNoMs,
  toLocalDate,
  toLocalTimeWithSeconds,
} from "../../../../../utils/formatDates";
import { rooms } from "../../../../../utils/rooms";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { statuses } from "../../../../../utils/statuses";
import { appointmentSchema } from "../../../../../validation/appointmentValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import TimePicker from "../../../../All/UI/Pickers/TimePicker";
import HostsList from "../../../EventForm/HostsList";
import RoomsList from "../../../EventForm/RoomsList";
import StatusList from "../../../EventForm/StatusList";

const AppointmentForm = ({
  patientId,
  editCounter,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { auth, clinic, user, socket } = useAuth();
  const [formDatas, setFormDatas] = useState({
    host_id: user.title === "Secretary" ? 0 : user.id,
    start: null,
    end: null,
    patients_guests_ids: [patientId],
    staff_guests_ids: [],
    room: "To be determined",
    all_day: false,
    Duration: 0,
    AppointmentStatus: "Scheduled",
    AppointmentPurpose: "Appointment",
    AppointmentNotes: "",
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const previousStartDate = useRef(toLocalDate(Date.now()));
  const previousEndDate = useRef(toLocalDate(Date.now()));
  const previousStartHours = useRef("");
  const previousEndHours = useRef("");
  const previousStartMin = useRef("");
  const previousEndMin = useRef("");
  const previousStartAMPM = useRef("");
  const previousEndAMPM = useRef("");
  const startDateInput = useRef("");
  const endDateInput = useRef("");
  const startHourInput = useRef("");
  const endHourInput = useRef("");
  const startMinInput = useRef("");
  const endMinInput = useRef("");
  const startAMPMInput = useRef("");
  const endAMPMInput = useRef("");
  const minStartDate = useRef(toLocalDate(Date.now()));
  const minEndDate = useRef(toLocalDate(Date.now()));

  //STYLE

  //HANDLERS
  const isSecretary = () => {
    return user.title === "Secretary";
  };

  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleHostChange = async (e) => {
    setErrMsgPost(false);
    const value = parseInt(e.target.value);
    setFormDatas({ ...formDatas, host_id: value });
  };

  const handleRoomChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (
      (isRoomOccupied(value) &&
        (await confirmAlert({
          content: `${value} will be occupied at this time slot, choose this room anyway ?`,
        }))) ||
      !isRoomOccupied(value)
    ) {
      setFormDatas({ ...formDatas, [name]: value });
    }
  };

  const handleStartChange = async (e) => {
    setErrMsgPost(false);
    const dateValue = startDateInput.current.value; //choosen local date YYYY:MM:DD
    const hourValue = startHourInput.current.value; //choosen local hour
    const minValue = startMinInput.current.value; //choosen local min
    const ampmValue = startAMPMInput.current.value; //choosen local ampm
    const name = e.target.name;

    if (name === "date" && dateValue === "") {
      setFormDatas({ ...formDatas, start: null });
      return;
    }

    let value = fromLocalToISOStringNoMs(
      dateValue,
      hourValue,
      minValue,
      ampmValue
    );

    value = Date.parse(new Date(value));

    const rangeEnd =
      new Date(value) > new Date(formDatas.end) ? value : formDatas.end;

    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        0,
        value,
        rangeEnd,
        auth.authToken
      );
      if (
        formDatas.room === "To be determined" ||
        hypotheticAvailableRooms.includes(formDatas.room) ||
        (!hypotheticAvailableRooms.includes(formDatas.room) &&
          (await confirmAlert({
            content: `${formDatas.room} will be occupied at this time slot, book it anyway ?`,
          })))
      ) {
        switch (name) {
          case "date":
            previousStartDate.current = dateValue;
            minEndDate.current = dateValue;
            break;
          case "hour":
            previousStartHours.current = hourValue;
            break;
          case "min":
            previousStartMin.current = minValue;
            break;
          case "ampm":
            previousStartAMPM.current = ampmValue;
            break;
          default:
            break;
        }
        if (new Date(value) > new Date(formDatas.end)) {
          setFormDatas({
            ...formDatas,
            start: value,
            end: value,
            Duration: 0,
          });
          endHourInput.value = startHourInput.value;
          endMinInput.value = startMinInput.value;
          endAMPMInput.vzalue = startAMPMInput.value;
          setAvailableRooms(
            await getAvailableRooms(0, value, value, auth.authToken)
          );
        } else {
          setFormDatas({
            ...formDatas,
            start: value,
            Duration: Math.floor((formDatas.end - value) / (1000 * 60)),
          });
          setAvailableRooms(
            await getAvailableRooms(0, value, formDatas.end, auth.authToken)
          );
        }
      } else {
        //set input value to previous start
        switch (name) {
          case "date":
            e.target.value = previousStartDate.current;
            break;
          case "hour":
            e.target.value = previousStartHours.current;
            break;
          case "min":
            e.target.value = previousStartMin.current;
            break;
          case "ampm":
            e.target.value = previousStartAMPM.current;
            break;
          default:
            break;
        }
      }
    } catch (err) {
      toast.error(`Error unable to change start date: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleEndChange = async (e) => {
    setErrMsgPost(false);
    const dateValue = endDateInput.current.value;
    const hourValue = endHourInput.current.value; //choosen local hour
    const minValue = endMinInput.current.value; //choosen local min
    const ampmValue = endAMPMInput.current.value; //choosen local ampm
    const name = e.target.name;

    if (name === "date" && dateValue === "") {
      setFormDatas({ ...formDatas, end: null });
      return;
    }

    let value = fromLocalToISOStringNoMs(
      dateValue,
      hourValue,
      minValue,
      ampmValue
    );

    value = Date.parse(new Date(value));

    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        0,
        formDatas.start,
        value,
        auth.authToken
      );
      if (
        formDatas.room === "To be determined" ||
        hypotheticAvailableRooms.includes(formDatas.room) ||
        (!hypotheticAvailableRooms.includes(formDatas.room) &&
          (await confirmAlert({
            content: `${formDatas.room} will be occupied at this time slot, book it anyway ?`,
          })))
      ) {
        switch (name) {
          case "date":
            previousEndDate.current = dateValue;
            break;
          case "hour":
            previousEndHours.current = hourValue;
            break;
          case "min":
            previousEndMin.current = minValue;
            break;
          case "ampm":
            previousEndAMPM.current = ampmValue;
            break;
          default:
            break;
        }
        setFormDatas({
          ...formDatas,
          end: value,
          Duration: Math.floor((value - formDatas.start) / (1000 * 60)),
        });
        setAvailableRooms(
          await getAvailableRooms(0, formDatas.start, value, auth.authToken)
        );
      } else {
        switch (name) {
          case "date":
            e.target.value = previousEndDate.current;
            break;
          case "hour":
            e.target.value = previousEndHours.current;
            break;
          case "min":
            e.target.value = previousEndMin.current;
            break;
          case "ampm":
            e.target.value = previousEndAMPM.current;
            break;
          default:
            break;
        }
      }
    } catch (err) {
      toast.error(`Error unable to change end date: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleAllDayChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    value = value === "true"; //cast to boolean
    if (value) {
      if (formDatas.start === null) {
        setErrMsgPost("Please choose a start date first");
        return;
      }
      const startAllDay = new Date(formDatas.start).setHours(0, 0, 0, 0);
      let endAllDay = new Date(startAllDay);
      endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);

      setFormDatas({
        ...formDatas,
        all_day: true,
        start: startAllDay,
        end: endAllDay,
        Duration: 1440,
      });
    } else {
      setFormDatas({
        ...formDatas,
        all_day: false,
        Duration: Math.floor((formDatas.end - formDatas.start) / (1000 * 60)),
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      AppointmentPurpose: firstLetterOfFirstWordUpper(
        formDatas.AppointmentPurpose
      ),
      AppointmentTime: toLocalTimeWithSeconds(formDatas.start),
      AppointmentDate: toLocalDate(formDatas.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            clinic.staffInfos,
            parseInt(formDatas.host_id)
          ),
          LastName: staffIdToLastName(
            clinic.staffInfos,
            parseInt(formDatas.host_id)
          ),
        },
        OHIPPhysicianId: staffIdToOHIP(
          clinic.staffInfos,
          parseInt(formDatas.host_id)
        ),
      },
      AppointmentNotes: firstLetterOfFirstWordUpper(formDatas.AppointmentNotes),
    };

    //Validation
    try {
      await appointmentSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    try {
      await postPatientRecord(
        "/appointments",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "APPOINTMENTS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save appointment: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const isRoomOccupied = (roomName) => {
    if (roomName === "To be determined") {
      return false;
    }
    return availableRooms.includes(roomName) ? false : true;
  };

  return (
    <tr
      className="appointments__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td style={{ minWidth: "170px" }}>
        {isSecretary() ? (
          <HostsList
            staffInfos={clinic.staffInfos}
            handleHostChange={handleHostChange}
            hostId={formDatas.host_id}
          />
        ) : (
          <p>{staffIdToTitleAndName(clinic.staffInfos, user.id, true)}</p>
        )}
      </td>
      <td>
        <input
          type="text"
          name="AppointmentPurpose"
          value={formDatas.AppointmentPurpose}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <div className="appointments__event-date-container">
          <input
            type="date"
            value={formDatas.start !== null ? toLocalDate(formDatas.start) : ""}
            onChange={handleStartChange}
            ref={startDateInput}
            name="date"
            min={minStartDate.current}
          />
          <TimePicker
            handleChange={handleStartChange}
            dateTimeValue={formDatas.start}
            passingRefHour={startHourInput}
            passingRefMin={startMinInput}
            passingRefAMPM={startAMPMInput}
            readOnly={formDatas.all_day || !toLocalDate(formDatas.start)}
          />
        </div>
      </td>
      <td>
        <div className="appointments__event-date-container">
          <input
            type="date"
            value={formDatas.end !== null ? toLocalDate(formDatas.end) : ""}
            onChange={handleEndChange}
            min={minEndDate.current}
            ref={endDateInput}
            readOnly={formDatas.all_day}
            name="date"
          />
          <TimePicker
            handleChange={handleEndChange}
            dateTimeValue={formDatas.end}
            passingRefHour={endHourInput}
            passingRefMin={endMinInput}
            passingRefAMPM={endAMPMInput}
            readOnly={formDatas.all_day || !toLocalDate(formDatas.end)}
          />
        </div>
      </td>
      <td>
        <select
          name="all_day"
          value={formDatas.all_day.toString()}
          onChange={handleAllDayChange}
          style={{ width: "50px" }}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <RoomsList
          handleRoomChange={handleRoomChange}
          roomSelected={formDatas.room}
          rooms={rooms}
          isRoomOccupied={isRoomOccupied}
          label={false}
        />
      </td>
      <td>
        <StatusList
          handleChange={handleChange}
          statuses={statuses}
          selectedStatus={formDatas.AppointmentStatus}
          label={false}
        />
      </td>
      <td>
        <input
          type="text"
          name="AppointmentNotes"
          value={formDatas.AppointmentNotes}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(clinic.staffInfos, user.id, true)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.now())}</em>
      </td>
      <td>
        <div className="appointments__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AppointmentForm;
