//Libraries
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getAvailableRooms } from "../../../api/getAvailableRooms";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";
import { useEventForm } from "../../../hooks/useEventForm";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import {
  toLocalDate,
  toLocalTimeWithSeconds,
} from "../../../utils/formatDates";
import { rooms } from "../../../utils/rooms";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { statuses } from "../../../utils/statuses";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import DurationPicker from "../../All/UI/Pickers/DurationPicker";
import EditGuests from "./EditGuests";
import FlatpickrEnd from "./FlatpickrEnd";
import FlatpickrStart from "./FlatpickrStart";
import HostsList from "./HostsList";
import Invitation from "./Invitation";
import RoomsRadio from "./RoomsRadio";
import StatusesRadio from "./StatusesRadio";
var _ = require("lodash");

//MY COMPONENT
const EventForm = ({
  staffInfos,
  demographicsInfos,
  currentEvent,
  setFormVisible,
  remainingStaff,
  setCalendarSelectable,
  setFormColor,
  hostsIds,
  setHostsIds,
}) => {
  //=========================== HOOKS =================================//
  const [{ formDatas, tempFormDatas }, , setTempFormDatas] = useEventForm(
    currentEvent.current.id
  );
  const [availableRooms, setAvailableRooms] = useState([]);
  const { auth, user, clinic, socket } = useAuth();
  const [staffGuestsInfos, setStaffGuestsInfos] = useState([]);
  const [patientsGuestsInfos, setPatientsGuestsInfos] = useState([]);
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [hostSettings, setHostSettings] = useState(null);
  const fpStart = useRef(null); //flatpickr start date
  const fpEnd = useRef(null); //flatpickr end date
  const previousStart = useRef(currentEvent.current.start);
  const previousEnd = useRef(currentEvent.current.end);
  const initialColor = useRef(currentEvent.current.backgroundColor);
  const initialTextColor = useRef(currentEvent.current.textColor);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchSettings = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/settings_for_staff?staff_id=${currentEvent.current.extendedProps.host}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setHostSettings(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch settings: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchSettings();
    return () => abortController.abort();
  }, [auth.authToken, currentEvent]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAvailableRooms = async () => {
      try {
        const response = await getAvailableRooms(
          parseInt(currentEvent.current.id),
          Date.parse(currentEvent.current.start),
          Date.parse(currentEvent.current.end),
          auth.authToken,
          abortController
        );
        if (abortController.signal.aborted) return;
        setAvailableRooms(response);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to get available rooms ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchAvailableRooms();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, currentEvent]);

  //============================ HANDLERS ==========================//

  const handlePurposeChange = (e) => {
    const value = e.target.value;
    currentEvent.current.setExtendedProp("purpose", value);
    setTempFormDatas({ ...tempFormDatas, AppointmentPurpose: value });
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    currentEvent.current.setExtendedProp("notes", value);
    setTempFormDatas({ ...tempFormDatas, AppointmentNotes: value });
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    currentEvent.current.setExtendedProp("status", value);
    setTempFormDatas({ ...tempFormDatas, AppointmentStatus: value });
  };

  const handleHostChange = async (e) => {
    const name = e.target.name;
    const value = parseInt(e.target.value);
    //Change event on calendar
    currentEvent.current.setExtendedProp("host", value);

    if (value === user.id) {
      currentEvent.current.setProp("color", "#6490D2");
      currentEvent.current.setProp("textColor", "#FEFEFE");
      setFormColor("#6490D2");
    } else {
      const host = remainingStaff.find(({ id }) => id === value);
      currentEvent.current.setProp("color", host.color);
      currentEvent.current.setProp("textColor", host.textColor);
      setFormColor(host.color);
      //CHECK HOST IN THE FILTER !!!!!!!!!!
    }
    //Update form datas
    setTempFormDatas({ ...tempFormDatas, [name]: value });
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
      //Change event on calendar
      currentEvent.current.setExtendedProp("room", value);
      currentEvent.current.setResources([
        rooms[_.findIndex(rooms, { title: value })].id,
      ]);
      //Update form datas
      setTempFormDatas({ ...tempFormDatas, [name]: value });
    }
  };

  const handleStartChange = async (selectedDates, dateStr, instance) => {
    if (selectedDates.length === 0) return; //if the flatpickr is cleared
    const date = Date.parse(selectedDates[0]);
    const endPicker = fpEnd.current.flatpickr;

    const rangeEnd =
      selectedDates[0] > new Date(tempFormDatas.end) ? date : tempFormDatas.end;
    let hypotheticAvailableRooms;

    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        date,
        rangeEnd,
        auth.authToken
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    if (
      tempFormDatas.room === "To be determined" ||
      hypotheticAvailableRooms.includes(tempFormDatas.room) ||
      (!hypotheticAvailableRooms.includes(tempFormDatas.room) &&
        (await confirmAlert({
          content: `${tempFormDatas.room} will be occupied at this time slot, change start time anyway ?`,
        })))
    ) {
      //Change event start on calendar
      currentEvent.current.setStart(date);
      previousStart.current = date;
      endPicker.config.minDate = date;
      if (selectedDates[0] > new Date(tempFormDatas.end)) {
        //Change event end on calendar
        currentEvent.current.setEnd(date);
        endPicker.setDate(date); //Change flatpickr end
        //Update form datas
        setTempFormDatas({
          ...tempFormDatas,
          start: date,
          end: date,
          Duration: 0,
        });
      } else {
        //Update form datas
        setTempFormDatas({
          ...tempFormDatas,
          start: date,
          Duration: Math.floor((tempFormDatas.end - date) / (1000 * 60)),
        });
      }
    } else {
      instance.setDate(previousStart.current); //Put instance back to previous start if user cancel
    }
  };

  const handleEndChange = async (selectedDates, dateStr, instance) => {
    if (selectedDates.length === 0) return; //if the flatpickr is cleared
    const date = Date.parse(selectedDates[0]); //remove ms for compareValues
    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        tempFormDatas.start,
        date,
        auth.authToken
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
    }
    if (
      tempFormDatas.room === "To be determined" ||
      hypotheticAvailableRooms.includes(tempFormDatas.room) ||
      (!hypotheticAvailableRooms.includes(tempFormDatas.room) &&
        (await confirmAlert({
          content: `${tempFormDatas.room} will be occupied at this time slot, change end time anyway ?`,
        })))
    ) {
      currentEvent.current.setEnd(date); //re-render
      previousEnd.current = date;
      setTempFormDatas({
        ...tempFormDatas,
        end: date,
        Duration: Math.floor((date - tempFormDatas.start) / (1000 * 60)),
      });
    } else {
      instance.setDate(previousEnd.current);
    }
  };

  const handleCheckAllDay = (e) => {
    if (e.target.checked) {
      //Change event on calendar
      currentEvent.current.setAllDay(true);
      //Update form datas
      setTempFormDatas({
        ...tempFormDatas,
        all_day: true,
        duration: 1440,
      });
      //Clear flatpickr start and end
      fpStart.current.flatpickr.clear();
      fpEnd.current.flatpickr.clear();
    } else {
      //Change event on calendar
      currentEvent.current.setAllDay(false);
      currentEvent.current.setStart(tempFormDatas.start);
      currentEvent.current.setEnd(tempFormDatas.end);
      //get the original dates back on flatpickr start and end
      fpStart.current.flatpickr.setDate(tempFormDatas.start);
      fpEnd.current.flatpickr.setDate(tempFormDatas.end);
      //update form datas
      setTempFormDatas({
        ...tempFormDatas,
        all_day: false,
        duration: Math.floor(
          (tempFormDatas.end - tempFormDatas.start) / (1000 * 60)
        ),
      });
    }
  };

  const handleDurationHoursChange = (e) => {
    const value = e.target.value;
    const hoursInt = value === "" ? 0 : parseInt(value);
    const minInt = parseInt(tempFormDatas.Duration % 60);
    //change event on calendar
    currentEvent.current.setEnd(
      tempFormDatas.start + hoursInt * 3600000 + minInt * 60000
    );
    //update form datas
    setTempFormDatas({
      ...tempFormDatas,
      Duration: hoursInt * 60 + minInt,
      end: tempFormDatas.start + hoursInt * 3600000 + minInt * 60000,
    });
  };

  const handleDurationMinChange = (e) => {
    const value = e.target.value;
    const hoursInt = parseInt(tempFormDatas.Duration / 60);
    const minInt = value === "" ? 0 : parseInt(value);
    //change event on calendar
    currentEvent.current.setEnd(
      tempFormDatas.start + hoursInt * 3600000 + minInt * 60000
    );
    //update form datas
    setTempFormDatas({
      ...tempFormDatas,
      Duration: hoursInt * 60 + minInt,
      end: tempFormDatas.start + hoursInt * 3600000 + minInt * 60000,
    });
  };

  const handleInvitation = async (e) => {
    e.preventDefault();
    setInvitationVisible(true);
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (_.isEqual(tempFormDatas, formDatas)) {
      setTempFormDatas(formDatas);
      currentEvent.current.setExtendedProp("host", formDatas.host_id);
      currentEvent.current.setExtendedProp(
        "purpose",
        formDatas.AppointmentPurpose
      );
      currentEvent.current.setExtendedProp(
        "status",
        formDatas.AppointmentStatus
      );
      currentEvent.current.setStart(formDatas.start);
      currentEvent.current.setEnd(formDatas.end);
      currentEvent.current.setAllDay(formDatas.all_day);
      currentEvent.current.setExtendedProp("room", formDatas.room);
      currentEvent.current.setResources([
        rooms[_.findIndex(rooms, { title: formDatas.room })].id,
      ]);
      currentEvent.current.setExtendedProp(
        "staffGuestsIds",
        formDatas.staff_guests_ids
      );
      currentEvent.current.setExtendedProp(
        "patientsGuestsIds",
        formDatas.patients_guests_ids
      );
      currentEvent.current.setProp("color", initialColor.current);
      currentEvent.current.setProp("textColor", initialTextColor.current);
      setFormVisible(false);
      setCalendarSelectable(true);
    } else {
      if (
        await confirmAlert({
          content:
            "You didn't save the appointment since your last changes, close anyway ?",
        })
      ) {
        setTempFormDatas(formDatas);
        currentEvent.current.setExtendedProp("host", formDatas.host_id);
        currentEvent.current.setExtendedProp(
          "purpose",
          formDatas.AppointmentPurpose
        );
        currentEvent.current.setExtendedProp(
          "status",
          formDatas.AppointmentStatus
        );
        currentEvent.current.setStart(formDatas.start);
        currentEvent.current.setEnd(formDatas.end);
        currentEvent.current.setAllDay(formDatas.all_day);
        currentEvent.current.setExtendedProp("room", formDatas.room);
        currentEvent.current.setResources([
          rooms[_.findIndex(rooms, { title: formDatas.room })].id,
        ]);
        currentEvent.current.setExtendedProp(
          "staffGuestsIds",
          formDatas.staff_guests_ids
        );
        currentEvent.current.setExtendedProp(
          "patientsGuestsIds",
          formDatas.patients_guests_ids
        );
        currentEvent.current.setProp("color", initialColor.current);
        currentEvent.current.setProp("textColor", initialTextColor.current);
        setFormVisible(false);
        setCalendarSelectable(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (_.isEqual(tempFormDatas, formDatas)) {
      //if formDatas didn't change we close the form
      setFormVisible(false);
      setCalendarSelectable(true);
      toast.success("Appointment saved successfully", { containerId: "A" });
      return;
    }
    const startAllDay = new Date(tempFormDatas.start).setHours(0, 0, 0, 0);
    let endAllDay = new Date(startAllDay);
    endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);

    const datas = {
      host_id: tempFormDatas.host_id,
      start: tempFormDatas.all_day ? startAllDay : tempFormDatas.start,
      end: tempFormDatas.all_day ? endAllDay : tempFormDatas.end,
      patients_guests_ids: tempFormDatas.patients_guests_ids,
      staff_guests_ids: tempFormDatas.staff_guests_ids,
      room: tempFormDatas.room,
      all_day: tempFormDatas.all_day,
      date_created: tempFormDatas.date_created,
      created_by_id: tempFormDatas.created_by_id,
      updates: [
        ...tempFormDatas.updates,
        { updated_by_id: user.id, date_updated: Date.now() },
      ],
      AppointmentTime: tempFormDatas.all_day
        ? toLocalTimeWithSeconds(startAllDay)
        : toLocalTimeWithSeconds(tempFormDatas.start),
      Duration: tempFormDatas.Duration,
      AppointmentStatus: tempFormDatas.AppointmentStatus,
      AppointmentDate: tempFormDatas.all_day
        ? toLocalDate(startAllDay)
        : toLocalDate(tempFormDatas.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            clinic.staffInfos,
            parseInt(tempFormDatas.host_id)
          ),
          LastName: staffIdToLastName(
            clinic.staffInfos,
            parseInt(tempFormDatas.host_id)
          ),
        },
        OHIPPhysicianId: staffIdToOHIP(
          clinic.staffInfos,
          parseInt(tempFormDatas.host_id)
        ),
      },
      AppointmentPurpose: firstLetterUpper(tempFormDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(tempFormDatas.AppointmentNotes),
    };
    try {
      await axiosXanoStaff.put(
        `/appointments/${currentEvent.current.id}`,
        datas,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      setHostsIds([...hostsIds, tempFormDatas.host_id]);
      socket.emit("message", {
        route: "EVENTS",
        action: "update",
        content: {
          id: currentEvent.current.id,
          data: { id: currentEvent.current.id, ...datas },
        },
      });
      socket.emit("message", {
        route: "APPOINTMENTS",
        action: "update",
        content: {
          id: currentEvent.current.id,
          data: { id: currentEvent.current.id, ...datas },
        },
      });
      setFormVisible(false);
      setCalendarSelectable(true);
      toast.success("Appointment saved successfully", { containerId: "A" });
    } catch (err) {
      if (err.name !== "CanceledError")
        toast.error(`Error: unable to save appointment: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  //========================== FUNCTIONS ======================//
  const isRoomOccupied = (roomName) => {
    if (roomName === "To be determined") {
      return false;
    }
    return availableRooms.includes(roomName) ? false : true;
  };

  const isSecretary = () => {
    return user.title === "Secretary" ? true : false;
  };

  return (
    formDatas &&
    (!invitationVisible ? (
      <form
        className={
          isSecretary() || currentEvent.current.extendedProps.host === user.id
            ? "event-form"
            : "event-form event-form--uneditable"
        }
        onSubmit={handleSubmit}
      >
        <div className="event-form__row">
          <div className="event-form__item">
            <label>Host </label>
            {isSecretary() ? (
              <HostsList
                staffInfos={staffInfos}
                handleHostChange={handleHostChange}
                hostId={tempFormDatas.host_id}
              />
            ) : (
              <p>
                {staffIdToTitleAndName(
                  clinic.staffInfos,
                  tempFormDatas.host_id,
                  true
                )}
              </p>
            )}
          </div>
          <div className="event-form__item">
            <label htmlFor="purpose">Purpose</label>
            <input
              type="text"
              value={tempFormDatas.AppointmentPurpose}
              onChange={handlePurposeChange}
              name="AppointmentPurpose"
              id="purpose"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="event-form__row">
          <div className="event-form__item">
            <FlatpickrStart
              fpStart={fpStart}
              startTime={tempFormDatas.start}
              handleStartChange={handleStartChange}
              allDay={tempFormDatas.all_day}
            />
          </div>
          <div className="event-form__item">
            <FlatpickrEnd
              fpEnd={fpEnd}
              start={currentEvent.current.start}
              endTime={tempFormDatas.end}
              allDay={currentEvent.current.allDay}
              handleEndChange={handleEndChange}
            />
          </div>
          <div className="event-form__item">
            <DurationPicker
              durationHours={
                tempFormDatas.all_day
                  ? ""
                  : parseInt(tempFormDatas.Duration / 60).toString()
              }
              durationMin={
                tempFormDatas.all_day
                  ? ""
                  : parseInt(tempFormDatas.Duration % 60).toString()
              }
              disabled={tempFormDatas.all_day}
              handleDurationHoursChange={handleDurationHoursChange}
              handleDurationMinChange={handleDurationMinChange}
            />
          </div>
          <div className="event-form__item">
            <label>All Day</label>
            <input
              type="checkbox"
              className="all-day-checkbox"
              checked={tempFormDatas.all_day}
              onChange={handleCheckAllDay}
            />
          </div>
        </div>
        <div className="event-form__row event-form__row--guest">
          <EditGuests
            staffInfos={staffInfos}
            demographicsInfos={demographicsInfos}
            tempFormDatas={tempFormDatas}
            setTempFormDatas={setTempFormDatas}
            currentEvent={currentEvent}
            editable={isSecretary() || user.id === tempFormDatas.host_id}
            hostId={tempFormDatas.host_id}
            staffGuestsInfos={staffGuestsInfos}
            setStaffGuestsInfos={setStaffGuestsInfos}
            patientsGuestsInfos={patientsGuestsInfos}
            setPatientsGuestsInfos={setPatientsGuestsInfos}
          />
        </div>
        <div className="event-form__row event-form__row--radio">
          <RoomsRadio
            handleRoomChange={handleRoomChange}
            roomSelected={tempFormDatas.room}
            rooms={rooms}
            isRoomOccupied={isRoomOccupied}
          />
        </div>
        <div className="event-form__row event-form__row--radio">
          <StatusesRadio
            handleStatusChange={handleStatusChange}
            statuses={statuses}
            selectedStatus={tempFormDatas.AppointmentStatus}
          />
        </div>
        <div className="event-form__row">
          <div className="event-form__item">
            <label>Notes</label>
            <textarea
              value={tempFormDatas.AppointmentNotes}
              onChange={handleNotesChange}
              name="AppointmentNotes"
              id="notes"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="event-form__btns">
          {isSecretary() ||
          currentEvent.current.extendedProps.host === user.id ? (
            <>
              <input type="submit" value="Save" />
              <button onClick={handleCancel}>Cancel</button>
              <button
                onClick={handleInvitation}
                disabled={
                  (!staffGuestsInfos.length && !patientsGuestsInfos.length) ||
                  !tempFormDatas.host_id
                }
              >
                Send invitation
              </button>
            </>
          ) : (
            <button onClick={handleCancel}>Close</button>
          )}
        </div>
      </form>
    ) : (
      <Invitation
        setInvitationVisible={setInvitationVisible}
        hostId={tempFormDatas.host_id}
        staffInfos={staffInfos}
        start={tempFormDatas.start}
        end={tempFormDatas.end}
        patientsGuestsInfos={patientsGuestsInfos}
        staffGuestsInfos={staffGuestsInfos}
        settings={hostSettings}
      />
    ))
  );
};

export default EventForm;
