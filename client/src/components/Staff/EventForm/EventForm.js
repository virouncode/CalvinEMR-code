//Libraries
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

import { DateTime } from "luxon";
import { getAvailableRooms } from "../../../api/getAvailableRooms";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import useAvailableRooms from "../../../hooks/useAvailableRooms";
import { useEventForm } from "../../../hooks/useEventForm";
import usePatientsGuestsList from "../../../hooks/usePatientsGuestsList";
import { statuses } from "../../../utils/appointments/statuses";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
  tzComponentsToTimestamp,
} from "../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toRoomTitle } from "../../../utils/names/toRoomTitle";
import { toSiteName } from "../../../utils/names/toSiteName";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import DateTimePicker from "../../UI/Pickers/DateTimePicker";
import DurationPicker from "../../UI/Pickers/DurationPicker";
import EditGuests from "./Guests/EditGuests";
import HostsSelect from "./Host/HostsSelect";
import Invitation from "./Invitation/Invitation";
import RoomsRadio from "./Rooms/RoomsRadio";
import SiteSelect from "./SiteSelect";
import StatusesRadio from "./Status/StatusesRadio";

var _ = require("lodash");

//MY COMPONENT
const EventForm = ({
  currentEvent,
  setFormVisible,
  remainingStaff,
  setCalendarSelectable,
  setFormColor,
  hostsIds,
  setHostsIds,
  sites,
  setTimelineSiteId,
  sitesIds,
  setSitesIds,
}) => {
  //=========================== HOOKS =================================//
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });
  const {
    formDatas,
    tempFormDatas,
    setTempFormDatas,
    loadingEvent,
    errMsg,
    previousStart,
    setPreviousStart,
    previousEnd,
    setPreviousEnd,
  } = useEventForm(currentEvent.current.id);

  const { loading, err, patientsDemographics, hasMore } = usePatientsGuestsList(
    search,
    paging,
    tempFormDatas?.patients_guests_ids
  );
  const [availableRooms, setAvailableRooms] = useAvailableRooms(
    parseInt(currentEvent.current.id),
    DateTime.fromJSDate(currentEvent.current.start, {
      zone: "America/Toronto",
    }).toMillis(),
    DateTime.fromJSDate(currentEvent.current.end, {
      zone: "America/Toronto",
    }).toMillis(),
    sites,
    currentEvent.current.extendedProps.siteId
  );
  const [invitationVisible, setInvitationVisible] = useState(false);
  const initialColor = useRef(currentEvent.current.backgroundColor);
  const initialTextColor = useRef(currentEvent.current.textColor);
  const [progress, setProgress] = useState(false);

  const refDateStart = useRef(null);
  const refHoursStart = useRef(null);
  const refMinutesStart = useRef(null);
  const refAMPMStart = useRef(null);
  const refDateEnd = useRef(null);
  const refHoursEnd = useRef(null);
  const refMinutesEnd = useRef(null);
  const refAMPMEnd = useRef(null);

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
    const value = parseInt(e.target.value);
    //Change event on calendar
    currentEvent.current.setExtendedProp("host", value);
    currentEvent.current.setExtendedProp(
      "hostName",
      staffIdToTitleAndName(staffInfos, value)
    );
    if (value === user.id) {
      currentEvent.current.setProp("color", "#93B5E9");
      currentEvent.current.setProp("textColor", "#3D375A");
      setFormColor("#93B5E9");
    } else {
      const host = remainingStaff.find(({ id }) => id === value);
      currentEvent.current.setProp("color", host.color);
      currentEvent.current.setProp("textColor", host.textColor);
      setFormColor(host.color);
      //CHECK HOST IN THE FILTER !!!!!!!!!!
    }
    //Update form datas
    setTempFormDatas({ ...tempFormDatas, host_id: value });
  };

  const handleSiteChange = async (e) => {
    const value = parseInt(e.target.value);
    currentEvent.current.setExtendedProp("siteId", value);
    currentEvent.current.setExtendedProp("siteName", toSiteName(sites, value));
    currentEvent.current.setExtendedProp("roomId", "z");
    currentEvent.current.setExtendedProp("roomTitle", "To Be Determined");
    currentEvent.current.setResources(["z"]);
    setTempFormDatas({ ...tempFormDatas, site_id: value, room_id: "z" });
    if (tempFormDatas.start && tempFormDatas.end) {
      const availableRoomsResult = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        tempFormDatas.start,
        tempFormDatas.end,
        sites,
        value
      );
      setAvailableRooms(availableRoomsResult);
    }
  };

  const handleRoomChange = async (e) => {
    const value = e.target.value;
    if (
      (isRoomOccupied(value) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            tempFormDatas.site_id,
            value
          )} will be occupied at this time slot, choose this room anyway ?`,
        }))) ||
      !isRoomOccupied(value)
    ) {
      //Change event on calendar
      currentEvent.current.setExtendedProp("roomId", value);
      currentEvent.current.setExtendedProp(
        "roomTitle",
        toRoomTitle(sites, tempFormDatas.site_id, value)
      );
      currentEvent.current.setResources([value]);
      //Update form datas
      setTempFormDatas({ ...tempFormDatas, room_id: value });
    }
  };

  const handleStartChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return;
    const dateStr = refDateStart.current.value;
    const hoursStr = refHoursStart.current.value;
    const minutesStr = refMinutesStart.current.value;
    const ampmStr = refAMPMStart.current.value;
    let timestampStart;
    switch (name) {
      case "date":
        timestampStart = tzComponentsToTimestamp(
          value,
          hoursStr,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "hours":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          value,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "minutes":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          value,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "ampm":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          minutesStr,
          value,
          "America/Toronto",
          "en-CA"
        );
        break;
      default:
        break;
    }

    const rangeEnd =
      timestampStart > tempFormDatas.end ? timestampStart : tempFormDatas.end;
    let hypotheticAvailableRooms;

    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        timestampStart,
        rangeEnd,
        sites,
        tempFormDatas.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }

    if (
      tempFormDatas.room_id === "z" ||
      hypotheticAvailableRooms.includes(tempFormDatas.room_id) ||
      (!hypotheticAvailableRooms.includes(tempFormDatas.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            tempFormDatas.site_id,
            tempFormDatas.room_id
          )} will be occupied at this time slot, change start time anyway ?`,
        })))
    ) {
      //Change event start on calendar
      currentEvent.current.setStart(timestampStart);
      if (timestampStart > tempFormDatas.end) {
        //Change event end on calendar
        currentEvent.current.setEnd(timestampStart);
        // endPicker.setDate(date); //Change flatpickr end
        //Update form datas
        setTempFormDatas({
          ...tempFormDatas,
          start: timestampStart,
          end: timestampStart,
          Duration: 0,
        });
        setPreviousStart(timestampStart);
        setPreviousEnd(timestampStart);
      } else {
        //Update form datas
        setTempFormDatas({
          ...tempFormDatas,
          start: timestampStart,
          Duration: Math.floor(
            (tempFormDatas.end - timestampStart) / (1000 * 60)
          ),
        });
        setPreviousStart(timestampStart);
      }
    }
  };

  const handleEndChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return;
    const dateStr = refDateEnd.current.value;
    const hoursStr = refHoursEnd.current.value;
    const minutesStr = refMinutesEnd.current.value;
    const ampmStr = refAMPMEnd.current.value;
    let timestampEnd;
    switch (name) {
      case "date":
        timestampEnd = tzComponentsToTimestamp(
          value,
          hoursStr,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "hours":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          value,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "minutes":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          value,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "ampm":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          minutesStr,
          value,
          "America/Toronto",
          "en-CA"
        );
        break;
      default:
        break;
    }

    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        tempFormDatas.start,
        timestampEnd,
        sites,
        tempFormDatas.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
    }
    if (
      tempFormDatas.room_id === "z" ||
      hypotheticAvailableRooms.includes(tempFormDatas.room_id) ||
      (!hypotheticAvailableRooms.includes(tempFormDatas.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            tempFormDatas.site_id,
            tempFormDatas.room_id
          )} will be occupied at this time slot, change end time anyway ?`,
        })))
    ) {
      //Change event end on calendar
      currentEvent.current.setEnd(timestampEnd);
      // previousEnd.current = date;
      //Update form datas
      setTempFormDatas({
        ...tempFormDatas,
        end: timestampEnd,
        Duration: Math.floor(
          (timestampEnd - tempFormDatas.start) / (1000 * 60)
        ),
      });
      setPreviousEnd(timestampEnd);
    }
  };

  const handleCheckAllDay = (e) => {
    if (e.target.checked) {
      //Change event on calendar
      currentEvent.current.setAllDay(true);
      const startAllDay = DateTime.fromMillis(tempFormDatas.start, {
        zone: "America/Toronto",
      })
        .set({ hour: 0, minute: 0, second: 0 })
        .toMillis();
      const endAllDay = startAllDay + 24 * 3600 * 1000;
      currentEvent.current.setStart(startAllDay);
      currentEvent.current.setEnd(endAllDay);
      //Update form datas
      setTempFormDatas({
        ...tempFormDatas,
        start: startAllDay,
        end: endAllDay,
        all_day: true,
        Duration: 1440,
      });
    } else {
      //Change event on calendar
      currentEvent.current.setAllDay(false);
      currentEvent.current.setStart(previousStart);
      currentEvent.current.setEnd(previousEnd);
      //update form datas
      setTempFormDatas({
        ...tempFormDatas,
        start: previousStart,
        end: previousEnd,
        all_day: false,
        Duration: Math.floor((previousEnd - previousStart) / (1000 * 60)),
      });
    }
  };

  const handleDurationChange = async (e) => {
    const value = e.target.value;
    const name = e.target.name;
    let hoursInt;
    let minInt;
    switch (name) {
      case "hoursDuration":
        hoursInt = value === "" ? 0 : parseInt(value);
        minInt = parseInt(tempFormDatas.Duration % 60);
        break;
      case "minutesDuration":
        hoursInt = parseInt(tempFormDatas.Duration / 60);
        minInt = value === "" ? 0 : parseInt(value);
        break;
      default:
        return;
    }
    const rangeEnd = tempFormDatas.start + hoursInt * 3600000 + minInt * 60000;
    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        tempFormDatas.start,
        rangeEnd,
        sites,
        tempFormDatas.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    if (
      tempFormDatas.room_id === "z" ||
      hypotheticAvailableRooms.includes(tempFormDatas.room_id) ||
      (!hypotheticAvailableRooms.includes(tempFormDatas.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            tempFormDatas.site_id,
            tempFormDatas.room_id
          )} will be occupied at this time slot, change end time anyway ?`,
        })))
    ) {
      //change event on calendar
      currentEvent.current.setEnd(rangeEnd);
      //update form datas
      setTempFormDatas({
        ...tempFormDatas,
        Duration: hoursInt * 60 + minInt,
        end: rangeEnd,
      });
    }
  };

  const handleInvitation = async (e) => {
    e.preventDefault();
    setInvitationVisible(true);
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    currentEvent.current.setExtendedProp("host", formDatas.host_id);
    currentEvent.current.setExtendedProp(
      "hostName",
      staffIdToTitleAndName(staffInfos, formDatas.host_id)
    );
    currentEvent.current.setExtendedProp(
      "purpose",
      formDatas.AppointmentPurpose
    );
    currentEvent.current.setExtendedProp("status", formDatas.AppointmentStatus);
    currentEvent.current.setStart(formDatas.start);
    currentEvent.current.setEnd(formDatas.end);
    currentEvent.current.setAllDay(formDatas.all_day);
    currentEvent.current.setExtendedProp("roomId", formDatas.room_id);
    currentEvent.current.setExtendedProp(
      "roomTitle",
      toRoomTitle(sites, formDatas.site_id, formDatas.room_id)
    );
    currentEvent.current.setExtendedProp("siteId", formDatas.site_id);
    currentEvent.current.setExtendedProp(
      "siteName",
      toSiteName(sites, formDatas.site_id)
    );
    currentEvent.current.setResources([formDatas.room_id]);
    currentEvent.current.setExtendedProp(
      "staffGuestsIds",
      formDatas.staff_guests_ids
    );
    currentEvent.current.setExtendedProp(
      "patientsGuestsIds",
      formDatas.patients_guests_ids
    );
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
    currentEvent.current.setExtendedProp("notes", formDatas.AppointmentNotes);
    setFormVisible(false);
    setCalendarSelectable(true);
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
    setProgress(true);
    const startAllDay = DateTime.fromMillis(tempFormDatas.start, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    const datasToPut = {
      host_id: tempFormDatas.host_id,
      start: tempFormDatas.all_day ? startAllDay : tempFormDatas.start,
      end: tempFormDatas.all_day ? endAllDay : tempFormDatas.end,
      patients_guests_ids: tempFormDatas.patients_guests_ids.map(
        ({ patient_infos }) => patient_infos.patient_id
      ),
      staff_guests_ids: tempFormDatas.staff_guests_ids.map(
        ({ staff_infos }) => staff_infos.id
      ),
      room_id: tempFormDatas.room_id,
      all_day: tempFormDatas.all_day,
      date_created: tempFormDatas.date_created,
      created_by_id: tempFormDatas.created_by_id,
      updates: [
        ...tempFormDatas.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      AppointmentTime: tempFormDatas.all_day
        ? timestampToTimeISOTZ(startAllDay)
        : timestampToTimeISOTZ(tempFormDatas.start),
      Duration: tempFormDatas.Duration,
      AppointmentStatus: tempFormDatas.AppointmentStatus,
      AppointmentDate: tempFormDatas.all_day
        ? timestampToDateISOTZ(startAllDay, "America/Toronto")
        : timestampToDateISOTZ(tempFormDatas.start, "America/Toronto"),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            staffInfos,
            parseInt(tempFormDatas.host_id)
          ),
          LastName: staffIdToLastName(
            staffInfos,
            parseInt(tempFormDatas.host_id)
          ),
        },
        OHIPPhysicianId: staffIdToOHIP(
          staffInfos,
          parseInt(tempFormDatas.host_id)
        ),
      },
      AppointmentPurpose: firstLetterUpper(tempFormDatas.AppointmentPurpose),
      AppointmentNotes: firstLetterUpper(tempFormDatas.AppointmentNotes),
      site_id: tempFormDatas.site_id,
    };
    try {
      const response = await xanoPut(
        `/appointments/${currentEvent.current.id}`,
        "staff",
        datasToPut
      );
      setHostsIds([...hostsIds, tempFormDatas.host_id]);
      socket.emit("message", {
        route: "EVENTS",
        action: "update",
        content: {
          id: currentEvent.current.id,
          data: response.data,
        },
      });
      socket.emit("message", {
        route: "APPOINTMENTS",
        action: "update",
        content: {
          id: currentEvent.current.id,
          data: response.data,
        },
      });
      setFormVisible(false);
      setTimelineSiteId(response.data.site_id);
      if (!sitesIds.includes(response.data.site_id)) {
        setSitesIds([...sitesIds, response.data.site_id]);
      }
      setCalendarSelectable(true);
      toast.success("Appointment saved successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      if (err.name !== "CanceledError")
        toast.error(`Error: unable to save appointment: ${err.message}`, {
          containerId: "A",
        });
      setProgress(false);
    }
  };

  //========================== FUNCTIONS ======================//
  const isRoomOccupied = (roomId) => {
    if (roomId === "z") {
      return false;
    }
    return availableRooms.includes(roomId) ? false : true;
  };

  return (
    <div className="event-form__container">
      {errMsg && (
        <div style={{ textAlign: "center" }}>
          <p className="event-form__err">{errMsg}</p>{" "}
          <button onClick={handleCancel} disabled={progress}>
            Close
          </button>
        </div>
      )}
      {!errMsg &&
        formDatas &&
        tempFormDatas &&
        (!invitationVisible ? (
          <form
            className={
              user.title === "Secretary" ||
              currentEvent.current.extendedProps.host === user.id
                ? "event-form"
                : "event-form event-form--uneditable"
            }
            onSubmit={handleSubmit}
          >
            <div className="event-form__row">
              <div className="event-form__item">
                <label>Host </label>
                {user.title === "Secretary" ? (
                  <HostsSelect
                    handleHostChange={handleHostChange}
                    hostId={tempFormDatas.host_id}
                  />
                ) : (
                  <p>
                    {staffIdToTitleAndName(staffInfos, tempFormDatas.host_id)}
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
                <DateTimePicker
                  value={tempFormDatas.start}
                  refDate={refDateStart}
                  refHours={refHoursStart}
                  refMinutes={refMinutesStart}
                  refAMPM={refAMPMStart}
                  timezone="America/Toronto"
                  locale="en-CA"
                  handleChange={handleStartChange}
                  label="Start"
                  // readOnlyTime,
                  // readOnlyDate
                />
              </div>
              <div className="event-form__item">
                <DateTimePicker
                  value={tempFormDatas.end}
                  refDate={refDateEnd}
                  refHours={refHoursEnd}
                  refMinutes={refMinutesEnd}
                  refAMPM={refAMPMEnd}
                  timezone="America/Toronto"
                  locale="en-CA"
                  handleChange={handleEndChange}
                  label="End"
                  // readOnlyTime,
                  // readOnlyDate
                />
              </div>
              <div className="event-form__item">
                <DurationPicker
                  durationHours={
                    tempFormDatas.all_day
                      ? "24"
                      : parseInt(tempFormDatas.Duration / 60)
                          .toString()
                          .padStart(2, "0")
                  }
                  durationMin={
                    tempFormDatas.all_day
                      ? "00"
                      : parseInt(tempFormDatas.Duration % 60)
                          .toString()
                          .padStart(2, "0")
                  }
                  disabled={tempFormDatas.all_day}
                  handleChange={handleDurationChange}
                  label="Duration"
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
                tempFormDatas={tempFormDatas}
                setTempFormDatas={setTempFormDatas}
                currentEvent={currentEvent}
                editable={
                  user.title === "Secretary" ||
                  user.id === tempFormDatas.host_id
                }
                hostId={tempFormDatas.host_id}
                search={search}
                setSearch={setSearch}
                paging={paging}
                setPaging={setPaging}
                loading={loading}
                err={err}
                hasMore={hasMore}
                patientsDemographics={patientsDemographics}
              />
            </div>
            <div className="event-form__row event-form__row--radio">
              <div style={{ marginBottom: "5px" }}>
                <SiteSelect
                  handleSiteChange={handleSiteChange}
                  sites={sites}
                  value={tempFormDatas.site_id}
                />
              </div>
              <RoomsRadio
                handleRoomChange={handleRoomChange}
                roomSelectedId={tempFormDatas.room_id}
                rooms={sites
                  .find(({ id }) => id === tempFormDatas.site_id)
                  ?.rooms.sort((a, b) => a.id.localeCompare(b.id))}
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
              {user.title === "Secretary" ||
              currentEvent.current.extendedProps.host === user.id ? (
                <>
                  <input type="submit" value="Save" />
                  <button onClick={handleCancel} disabled={progress}>
                    Cancel
                  </button>
                  <button
                    onClick={handleInvitation}
                    disabled={
                      (!tempFormDatas.staff_guests_ids.length &&
                        !tempFormDatas.patients_guests_ids.length) ||
                      !tempFormDatas.host_id ||
                      progress
                    }
                  >
                    Send invitation
                  </button>
                </>
              ) : (
                <button onClick={handleCancel} disabled={progress}>
                  Close
                </button>
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
            patientsGuestsInfos={tempFormDatas.patients_guests_ids
              .filter((item) => item)
              .map(({ patient_infos }) => patient_infos)}
            staffGuestsInfos={tempFormDatas.staff_guests_ids
              .filter((item) => item)
              .map(({ staff_infos }) => staff_infos)}
            sites={sites}
            siteId={tempFormDatas.site_id}
            allDay={tempFormDatas.all_day}
          />
        ))}
      {loadingEvent && (
        <div style={{ marginTop: "50px" }}>
          <LoadingParagraph />
        </div>
      )}
    </div>
  );
};

export default EventForm;
