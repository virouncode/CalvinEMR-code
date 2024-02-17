import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import { getAvailableRooms } from "../../../../../api/getAvailableRooms";
import useAuthContext from "../../../../../hooks/useAuthContext";
import {
  firstLetterOfFirstWordUpper,
  firstLetterUpper,
} from "../../../../../utils/firstLetterUpper";
import {
  fromLocalToISOStringNoMs,
  toLocalAMPM,
  toLocalDate,
  toLocalHours,
  toLocalMinutes,
  toLocalTimeWithSeconds,
} from "../../../../../utils/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { statuses } from "../../../../../utils/statuses";
import { toSiteName } from "../../../../../utils/toSiteName";
import { appointmentSchema } from "../../../../../validation/appointmentValidation";
import { toRoomTitle } from "../../../../../validation/toRoomTitle";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import TimePicker from "../../../../All/UI/Pickers/TimePicker";
import HostsList from "../../../EventForm/HostsList";
import RoomsList from "../../../EventForm/RoomsList";
import SelectSite from "../../../EventForm/SelectSite";
import StatusList from "../../../EventForm/StatusList";
import SignCell from "../SignCell";

const AppointmentEvent = ({
  event,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  sites,
}) => {
  //HOOKS
  const { auth, clinic, user, socket } = useAuthContext();
  const [editVisible, setEditVisible] = useState(false);
  const [eventInfos, setEventInfos] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const previousStartDate = useRef(toLocalDate(event.start));
  const previousEndDate = useRef(toLocalDate(event.end));
  const previousStartHours = useRef(toLocalHours(event.start));
  const previousEndHours = useRef(toLocalHours(event.end));
  const previousStartMin = useRef(toLocalMinutes(event.start));
  const previousEndMin = useRef(toLocalMinutes(event.end));
  const previousStartAMPM = useRef(toLocalAMPM(event.start));
  const previousEndAMPM = useRef(toLocalAMPM(event.end));
  const startDateInput = useRef(null);
  const endDateInput = useRef(null);
  const startHourInput = useRef(null);
  const endHourInput = useRef(null);
  const startMinInput = useRef(null);
  const endMinInput = useRef(null);
  const startAMPMInput = useRef(null);
  const endAMPMInput = useRef(null);
  const minEndDate = useRef(toLocalDate(event.start));

  useEffect(() => {
    setEventInfos(event);
  }, [event]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAvailableRooms = async () => {
      try {
        const availableRoomsResult = await getAvailableRooms(
          parseInt(event.id),
          event.start,
          event.end,
          sites,
          event.site_id,
          auth.authToken,
          abortController
        );
        if (abortController.signal.aborted) return;
        setAvailableRooms(availableRoomsResult);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to get available rooms: ${err.message}`, {
            containerId: "B",
          });
      }
    };
    fetchAvailableRooms();
    return () => {
      abortController.abort();
    };
  }, [
    auth.authToken,
    event.end,
    event.host_id,
    event.id,
    event.site_id,
    event.start,
    sites,
  ]);

  //HANDLERS
  const isSecretary = () => {
    return user.title === "Secretary";
  };

  const handleSiteChange = async (e) => {
    const value = parseInt(e.target.value);
    setEventInfos({ ...eventInfos, site_id: value, room_id: "z" });
    if (eventInfos.start && eventInfos.end) {
      const availableRoomsResult = await getAvailableRooms(
        parseInt(event.id),
        eventInfos.start,
        eventInfos.end,
        sites,
        value,
        auth.authToken
      );
      setAvailableRooms(availableRoomsResult);
    }
  };

  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value = e.target.value;
    setEventInfos({ ...eventInfos, [name]: value });
  };

  const handleHostChange = async (e) => {
    setErrMsgPost(false);
    const value = parseInt(e.target.value);
    setEventInfos({
      ...eventInfos,
      host_id: value,
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(clinic.staffInfos, value),
          LastName: staffIdToLastName(clinic.staffInfos, value),
        },
        OHIPPhysicianId: staffIdToOHIP(clinic.staffInfos, value),
      },
    });
  };

  const handleRoomChange = async (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    const value = e.target.value;
    if (
      (isRoomOccupied(value) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            eventInfos.site_id,
            value
          )} will be occupied at this time slot, choose this room anyway ?`,
        }))) ||
      !isRoomOccupied(value)
    ) {
      setEventInfos({ ...eventInfos, [name]: value });
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
      setEventInfos({ ...eventInfos, start: null });
      return;
    }

    if (name === "date" && eventInfos.all_day) {
      const startAllDay = new Date(startDateInput.current.value).setHours(
        0,
        0,
        0,
        0
      );
      let endAllDay = new Date(startAllDay);
      endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);
      setEventInfos({ ...eventInfos, start: startAllDay, end: endAllDay });
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
      new Date(value) > new Date(eventInfos.end) ? value : eventInfos.end;

    let hypotheticAvailableRooms;

    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        event.id,
        value,
        rangeEnd,
        sites,
        eventInfos.site_id,
        auth.authToken
      );

      if (
        eventInfos.room === "To be determined" ||
        hypotheticAvailableRooms.includes(eventInfos.room) ||
        (!hypotheticAvailableRooms.includes(eventInfos.room) &&
          (await confirmAlert({
            content: `${eventInfos.room} will be occupied at this time slot, book it anyway ?`,
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

        if (new Date(value) > new Date(eventInfos.end)) {
          setEventInfos({
            ...eventInfos,
            start: value,
            end: value,
            Duration: 0,
          });
          endHourInput.value = startHourInput.value;
          endMinInput.value = startMinInput.value;
          endAMPMInput.value = startAMPMInput.value;
        } else {
          setEventInfos({
            ...eventInfos,
            start: value,
            Duration: Math.floor((eventInfos.end - value) / (1000 * 60)),
          });
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
      toast.error(`Error: unable to save start date: ${err.message}`, {
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
      setEventInfos({ ...eventInfos, end: null });
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
        event.id,
        eventInfos.start,
        value,
        sites,
        eventInfos.site_id,
        auth.authToken
      );
      if (
        eventInfos.room === "To be determined" ||
        hypotheticAvailableRooms.includes(eventInfos.room) ||
        (!hypotheticAvailableRooms.includes(eventInfos.room) &&
          (await confirmAlert({
            content: `${eventInfos.room} will be occupied at this time slot, book it anyway ?`,
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
        setEventInfos({
          ...eventInfos,
          end: value,
          duration: Math.floor((value - eventInfos.start) / (1000 * 60)),
        });
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
      toast.error(`Error: unable to save end date: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleAllDayChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    value = value === "true"; //cast to boolean
    if (value) {
      if (eventInfos.start === null) {
        setErrMsgPost("Please choose a start date first");
        return;
      }
      const startAllDay = new Date(eventInfos.start).setHours(0, 0, 0, 0);
      let endAllDay = new Date(startAllDay);
      endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);

      setEventInfos({
        ...eventInfos,
        all_day: true,
        start: startAllDay,
        end: endAllDay,
        Duration: 1440,
      });
    } else {
      setEventInfos({
        ...eventInfos,
        all_day: false,
        Duration: Math.floor((eventInfos.end - eventInfos.start) / (1000 * 60)),
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setEventInfos(event);
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...eventInfos,
      AppointmentPurpose: firstLetterUpper(eventInfos.AppointmentPurpose),
      AppointmentTime: toLocalTimeWithSeconds(eventInfos.start),
      AppointmentDate: toLocalDate(eventInfos.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            clinic.staffInfos,
            parseInt(eventInfos.host_id)
          ),
          LastName: staffIdToLastName(
            clinic.staffInfos,
            parseInt(eventInfos.host_id)
          ),
        },
        OHIPPhysicianId: staffIdToOHIP(
          clinic.staffInfos,
          parseInt(eventInfos.host_id)
        ),
      },
      AppointmentNotes: firstLetterOfFirstWordUpper(
        eventInfos.AppointmentNotes
      ),
    };

    //Validation
    try {
      await appointmentSchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    try {
      await putPatientRecord(
        "/appointments",
        event.id,
        user.id,
        auth.authToken,
        datasToPut,
        socket,
        "APPOINTMENTS"
      );

      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save appointment: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost(false);
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord(
          "/appointments",
          event.id,
          auth.authToken,
          socket,
          "APPOINTMENTS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to delete appointment: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  const isRoomOccupied = (roomId) => {
    if (roomId === "z") {
      return false;
    }
    return availableRooms.includes(roomId) ? false : true;
  };

  return (
    eventInfos && (
      <tr
        className="appointments__event"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
      >
        <td style={{ minWidth: "170px" }}>
          {editVisible && isSecretary() ? (
            <HostsList
              staffInfos={clinic.staffInfos}
              handleHostChange={handleHostChange}
              hostId={eventInfos.host_id}
            />
          ) : (
            <p>
              {staffIdToTitleAndName(clinic.staffInfos, event.host_id, true)}
            </p>
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="AppointmentPurpose"
              value={eventInfos.AppointmentPurpose}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            event.AppointmentPurpose
          )}
        </td>
        <td>
          {editVisible ? (
            <div className="appointments__event-date-container">
              <input
                type="date"
                value={
                  eventInfos.start !== null ? toLocalDate(eventInfos.start) : ""
                }
                onChange={handleStartChange}
                ref={startDateInput}
                name="date"
              />
              <TimePicker
                handleChange={handleStartChange}
                dateTimeValue={eventInfos.start}
                passingRefHour={startHourInput}
                passingRefMin={startMinInput}
                passingRefAMPM={startAMPMInput}
                readOnly={eventInfos.all_day || !toLocalDate(eventInfos.start)}
              />
            </div>
          ) : event.start !== null ? (
            new Date(event.start).toLocaleString("en-CA", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          ) : (
            ""
          )}
        </td>
        <td>
          {editVisible ? (
            <div className="appointments__event-date-container">
              <input
                type="date"
                value={
                  eventInfos.end !== null ? toLocalDate(eventInfos.end) : ""
                }
                onChange={handleEndChange}
                min={minEndDate.current}
                ref={endDateInput}
                readOnly={eventInfos.all_day}
                name="date"
              />
              <TimePicker
                handleChange={handleEndChange}
                dateTimeValue={eventInfos.end}
                passingRefHour={endHourInput}
                passingRefMin={endMinInput}
                passingRefAMPM={endAMPMInput}
                readOnly={eventInfos.all_day || !toLocalDate(eventInfos.end)}
              />
            </div>
          ) : event.end !== null ? (
            new Date(event.end).toLocaleString("en-CA", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          ) : (
            ""
          )}
        </td>
        <td>
          {editVisible ? (
            <select
              name="all_day"
              value={eventInfos.all_day.toString()}
              onChange={handleAllDayChange}
              style={{ width: "50px" }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : event.all_day ? (
            "Yes"
          ) : (
            "No"
          )}
        </td>
        <td>
          {editVisible ? (
            <SelectSite
              handleSiteChange={handleSiteChange}
              sites={sites}
              value={eventInfos.site_id}
              label={false}
            />
          ) : (
            toSiteName(sites, event.site_id)
          )}
        </td>
        <td>
          {editVisible ? (
            <RoomsList
              handleRoomChange={handleRoomChange}
              roomSelectedId={eventInfos.room_id}
              rooms={sites
                .find(({ id }) => id === eventInfos.site_id)
                ?.rooms.sort((a, b) => a.id.localeCompare(b.id))}
              isRoomOccupied={isRoomOccupied}
              label={false}
            />
          ) : (
            toRoomTitle(sites, event.site_id, event.room_id)
          )}
        </td>
        <td>
          {editVisible ? (
            <StatusList
              handleChange={handleChange}
              statuses={statuses}
              selectedStatus={eventInfos.AppointmentStatus}
              label={false}
            />
          ) : (
            event.AppointmentStatus
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="AppointmentNotes"
              value={eventInfos.AppointmentNotes}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            event.AppointmentNotes
          )}
        </td>
        <SignCell item={event} staffInfos={clinic.staffInfos} />
        <td>
          {(isSecretary() || user.id === eventInfos.host_id) && (
            <div className="appointments__event-btn-container">
              {!editVisible ? (
                <>
                  <button onClick={handleEditClick}>Edit</button>
                  <button onClick={handleDeleteClick}>Delete</button>
                </>
              ) : (
                <>
                  <input type="submit" value="Save" onClick={handleSubmit} />
                  <button type="button" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </td>
      </tr>
    )
  );
};

export default AppointmentEvent;
