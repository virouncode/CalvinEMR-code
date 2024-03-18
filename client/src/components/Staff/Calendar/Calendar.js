import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { DateTime } from "luxon";
import { getAvailableRooms } from "../../../api/getAvailableRooms";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useAvailabilty from "../../../hooks/useAvailability";
import useCalendarShortcuts from "../../../hooks/useCalendarShortcuts";
import useEvents from "../../../hooks/useEvents";
import useEventsSocket from "../../../hooks/useEventsSocket";
import useFetchDatas from "../../../hooks/useFetchDatas";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import {
  getTodayEndTZ,
  getTodayStartTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/toPatientName";
import { toSiteName } from "../../../utils/toSiteName";
import { toRoomTitle } from "../../../validation/toRoomTitle";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import EventForm from "../EventForm/EventForm";
import CalendarFilter from "./CalendarFilter";
import CalendarOptions from "./CalendarOptions";
import CalendarView from "./CalendarView";
import SelectTimelineSite from "./SelectTimelineSite";
import Shortcutpickr from "./Shortcutpickr";
import TimelineView from "./TimelineView";
import ToggleView from "./ToggleView";

//MY COMPONENT
const Calendar = () => {
  //================================ FUNCTIONS =====================================//
  const setCalendarSelectable = (selectable) => {
    fcRef.current.calendar.currentData.options.selectable = selectable;
  };
  //================================= HOOKS ========================================//
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [rangeStart, setRangeStart] = useState(getTodayStartTZ());
  const [rangeEnd, setRangeEnd] = useState(getTodayEndTZ());
  const [formColor, setFormColor] = useState("#93B5E9");
  const [sitesIds, setSitesIds] = useState([user.site_id]); //Sites for CalendarFilter
  const [timelineSiteId, setTimelineSiteId] = useState(user.site_id); //SelectTimelineSite
  const [editAvailabilityVisible, setEditAvailabilityVisible] = useState(false);
  const [hostsIds, setHostsIds] = useState(
    user.title === "Secretary"
      ? [0, ...staffInfos.map(({ id }) => id)]
      : [user.id]
  );
  const [sites] = useFetchDatas("/sites", "staff");
  const [events, setEvents, remainingStaff] = useEvents(
    hostsIds,
    rangeStart,
    rangeEnd,
    timelineVisible,
    timelineSiteId,
    sitesIds,
    sites,
    staffInfos
  );
  const {
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
  } = useAvailabilty(user.id);

  //Calendar Elements
  const fcRef = useRef(null); //fullcalendar
  const currentEvent = useRef(null);
  const currentEventElt = useRef(null);
  const currentView = useRef(null);
  const lastCurrentId = useRef("");
  const eventCounter = useRef(0);

  useEffect(() => {
    if (lastCurrentId.current) {
      currentEventElt.current = document.getElementsByClassName(
        `event-${lastCurrentId.current}`
      )[0];
      currentEvent.current = events.find(
        ({ id }) => id === lastCurrentId.current
      );
      if (
        document.getElementsByClassName(`event-${lastCurrentId.current}`)[0]
      ) {
        document.getElementsByClassName(
          `event-${lastCurrentId.current}`
        )[0].style.border = "solid 1px red";
      }
    }
  }, [events]);

  useCalendarShortcuts(
    fcRef,
    currentEvent,
    lastCurrentId,
    eventCounter,
    formVisible,
    setFormVisible,
    setCalendarSelectable,
    editAvailabilityVisible
  );
  useEventsSocket(events, setEvents, sites);

  //=============================== EVENTS HANDLERS =================================//
  const handleShortcutpickrChange = (selectedDates, dateStr) => {
    //offset UTC local
    const now = DateTime.now();
    const offsetLocal = now.offset;

    //offset UTC de Toronto
    const offsetToronto = DateTime.local({ zone: "America/Toronto" }).offset;

    const midnightUTC = DateTime.fromISO(dateStr, { zone: "utc" })
      .plus({ minutes: offsetLocal })
      .startOf("day")
      .toJSDate();

    fcRef.current.calendar.gotoDate(
      DateTime.fromJSDate(midnightUTC, { zone: "America/Toronto" })
        .minus({
          minutes: offsetToronto,
        })
        .toMillis()
    );
  };

  const handlePatientClick = (e, id) => {
    e.stopPropagation();
    if (formVisible) return;
    window.open(`/staff/patient-record/${id}`, "_blank");
  };
  const handleDeleteEvent = async (e, info) => {
    e.stopPropagation();
    if (formVisible) return;
    const event = info.event;
    const view = info.view;
    const eventElt = document.getElementsByClassName(`event-${event.id}`)[0];
    if (currentEvent.current && currentEvent.current.id !== event.id) {
      //event selection change
      //change border and unselect previous event
      currentEventElt.current.style.border = "none";
      //Change current event, current event element and current view
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.border = "solid 1px red";
    } else if (currentEvent.current === null) {
      //first event selection
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.border = "solid 1px red";
    } else {
      //click on already selected event
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.border = "solid 1px red";
    }
    if (
      await confirmAlert({
        content: "Do you really want to remove this event ?",
      })
    ) {
      try {
        await xanoDelete(
          `/appointments/${parseInt(currentEvent.current.id)}`,
          "staff"
        );
        toast.success("Deleted Successfully", { containerId: "A" });
        socket.emit("message", {
          route: "EVENTS",
          action: "delete",
          content: { id: currentEvent.current.id },
        });
        socket.emit("message", {
          route: "APPOINTMENTS",
          action: "delete",
          content: { id: parseInt(currentEvent.current.id) },
        });
        setFormVisible(false);
        setCalendarSelectable(true);
        currentEvent.current = null;
        lastCurrentId.current = "";
      } catch (err) {
        toast.error(`Error: unable to delete appointment: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };
  //EVENT LAYOUT
  const renderEventContent = (info) => {
    const event = info.event;
    let staffGuestsIds = event.extendedProps.staffGuestsIds ?? [];
    let patientsGuestsIds = event.extendedProps.patientsGuestsIds ?? [];
    if (
      //wEEK, MONTH, YEAR, ROOMS
      info.view.type === "timeGridWeek" ||
      info.view.type === "dayGridMonth" ||
      info.view.type === "multiMonthYear" ||
      info.view.type === "resourceTimeGridDay"
    ) {
      return (
        <div
          style={{
            fontSize: "0.7rem",
            height: "100%",
            backgroundImage:
              event.extendedProps.status === "Cancelled" &&
              `repeating-linear-gradient(
                45deg,
                ${event.backgroundColor},
                ${event.backgroundColor} 10px,
                #aaaaaa 10px,
                #aaaaaa 20px
              )`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 2px",
            }}
          >
            <p
              style={{
                padding: "0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "clip",
              }}
            >
              {event.allDay ? "All Day" : info.timeText} -{" "}
              {event.extendedProps.purpose ?? "Appointment"}
            </p>
            <i
              className="fa-solid fa-trash"
              onClick={(e) => handleDeleteEvent(e, info)}
            ></i>
          </div>
          <div>
            <span>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest, index) =>
                      patient_guest && (
                        <span
                          className="calendar__patient-link"
                          onClick={(e) =>
                            handlePatientClick(
                              e,
                              patient_guest.patient_infos.patient_id
                            )
                          }
                          key={patient_guest.patient_infos.patient_id}
                        >
                          <strong>
                            {toPatientName(patient_guest.patient_infos)}
                          </strong>
                          {index !== patientsGuestsIds.length - 1 ? " / " : ""}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest, index) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          {" / "}
                          <strong>
                            {staffIdToTitleAndName(
                              staffInfos,
                              staff_guest.staff_infos.id
                            )}
                          </strong>
                          {index !== staffGuestsIds.length - 1 ? " / " : ""}
                        </span>
                      )
                  )
                : null}
            </span>
          </div>
          <div>
            <strong>Host: </strong>
            {event.extendedProps.hostName}
          </div>
          <div>
            <strong>Site: </strong>
            {event.extendedProps.siteName}
          </div>
          <div>
            <strong>Room: </strong>
            {event.extendedProps.roomTitle}
          </div>
          <div>
            <strong>Status: </strong>
            {event.extendedProps.status}
          </div>
        </div>
      );
    } else if (info.view.type === "timeGrid") {
      //DAY
      return (
        <div
          style={{
            fontSize: "0.7rem",
            height: "100%",
            backgroundImage:
              event.extendedProps.status === "Cancelled" &&
              `repeating-linear-gradient(
                45deg,
                ${event.backgroundColor},
                ${event.backgroundColor} 10px,
                #aaaaaa 10px,
                #aaaaaa 20px
              )`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              padding: "0 2px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "70px",
                textAlign: "left",
                display: "inline-block",
              }}
            >
              {event.allDay ? "All Day" : info.timeText}
            </span>
            <span style={{ marginLeft: "10px" }}>
              <strong>
                {event.extendedProps.purpose?.toUpperCase() ?? "APPOINTMENT"}
              </strong>
            </span>
            <span>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest, index) =>
                      patient_guest && (
                        <span
                          className="calendar__patient-link"
                          onClick={(e) =>
                            handlePatientClick(
                              e,
                              patient_guest.patient_infos.patient_id
                            )
                          }
                          key={patient_guest.patient_infos.patient_id}
                        >
                          {" / "}
                          <strong>
                            {toPatientName(patient_guest.patient_infos)}
                          </strong>
                          {index !== patient_guest.length - 1 ? "" : " / "}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest, index) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          {" / "}
                          <strong>
                            {staffIdToTitleAndName(
                              staffInfos,
                              staff_guest.staff_infos.id
                            )}
                          </strong>
                          {index !== staffGuestsIds.length - 1 ? " / " : ""}
                        </span>
                      )
                  )
                : null}
            </span>
            {" / "}
            <strong>Host: </strong>
            {event.extendedProps.hostName} / <strong>Site:</strong>{" "}
            {event.extendedProps.siteName} / <strong>Room: </strong>
            {event.extendedProps.roomTitle} / <strong>Status: </strong>
            {event.extendedProps.status}
            {event.extendedProps.notes && (
              <>
                {" "}
                / <strong>Notes: </strong>
                {event.extendedProps.notes}
              </>
            )}
          </div>
          <i
            className="fa-solid fa-trash"
            onClick={(e) => handleDeleteEvent(e, info)}
          ></i>
        </div>
      );
    } else if (info.view.type === "listWeek") {
      //LIST
      return (
        <div
          style={{
            height: "100%",
            backgroundImage:
              event.extendedProps.status === "Cancelled" &&
              `repeating-linear-gradient(
          45deg,
          ${event.backgroundColor},
          ${event.backgroundColor} 10px,
          #aaaaaa 10px,
          #aaaaaa 20px
        )`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                padding: "0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "clip",
              }}
            >
              <strong>
                {event.extendedProps.purpose?.toUpperCase() ?? "APPOINTMENT"}
              </strong>
            </p>
            <i
              className="fa-solid fa-trash"
              onClick={(e) => handleDeleteEvent(e, info)}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <div>
            <span>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest, index) =>
                      patient_guest && (
                        <span
                          className="calendar__patient-link calendar__patient-link--list"
                          onClick={(e) =>
                            handlePatientClick(
                              e,
                              patient_guest.patient_infos.patient_id
                            )
                          }
                          key={patient_guest.patient_infos.patient_id}
                        >
                          <strong>
                            {toPatientName(patient_guest.patient_infos)}
                          </strong>
                          {index !== patientsGuestsIds.length - 1 ? " / " : ""}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest, index) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          {" / "}
                          <strong>
                            {staffIdToTitleAndName(
                              staffInfos,
                              staff_guest.staff_infos.id
                            )}
                          </strong>
                          {index !== staffGuestsIds.length - 1 ? " / " : ""}
                        </span>
                      )
                  )
                : null}
            </span>
          </div>
          <div>
            <strong>Host: </strong>
            {event.extendedProps.hostName}
          </div>
          <div>
            <strong>Site: </strong>
            {event.extendedProps.siteName}
          </div>
          <div>
            <strong>Room: </strong>
            {event.extendedProps.rommTitle}
          </div>
          <div>
            <strong>Status: </strong>
            {event.extendedProps.status}
          </div>
          {event.extendedProps.notes && (
            <div>
              <strong>Notes: </strong>
              {event.extendedProps.notes}
            </div>
          )}
        </div>
      );
    }
  };
  //EVENT CLICK
  const handleEventClick = async (info) => {
    if (formVisible) return;
    const eventElt = info.el;
    const event = info.event;
    const view = info.view;
    if (currentEvent.current && currentEvent.current.id !== event.id) {
      //event selection change
      //change border and unselect previous event
      currentEventElt.current.style.border = "none";
      //Change current event, current event element and current view
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.border = "solid 1px red";
    } else if (currentEvent.current === null) {
      //first event selection
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.border = "solid 1px red";
    } else {
      //click on already selected event
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.border = "solid 1px red";
      setFormColor(event.backgroundColor);
      setFormVisible(true);
      setCalendarSelectable(false);
    }
  };
  // DATES SET
  const handleDatesSet = (info) => {
    setRangeStart(
      DateTime.fromJSDate(info.start, { zone: "America/Toronto" }).toMillis()
    );
    setRangeEnd(
      DateTime.fromJSDate(info.end, { zone: "America/Toronto" }).toMillis()
    );
    if (currentEventElt.current) {
      currentEventElt.current.style.border = "none";
    }
    currentEvent.current = null;
    lastCurrentId.current = "";
    currentEventElt.current = null;
    currentView.current = info.view;
  };
  // //DATE SELECT
  const handleDateSelect = async (info) => {
    if (currentEventElt.current) currentEventElt.current.style.border = "none";
    const startDate = DateTime.fromJSDate(info.start, {
      zone: "America/Toronto",
    }).toMillis(); //timestamp
    const defaultDuration =
      defaultDurationHours * 3600000 + defaultDurationMin * 60000;

    const endDate =
      DateTime.fromJSDate(info.end, {
        zone: "America/Toronto",
      }).toMillis() >
      startDate + defaultDuration
        ? DateTime.fromJSDate(info.end, {
            zone: "America/Toronto",
          }).toMillis()
        : startDate + defaultDuration; //local timestamp

    const startAllDay = DateTime.fromMillis(startDate, {
      zone: "America/Toronto",
    })
      .set({ hours: 0, minutes: 0, seconds: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    let newEvent = {
      start: info.allDay ? startAllDay : startDate,
      end: info.allDay ? endAllDay : endDate,
      color: user.title === "Secretary" ? "#bfbfbf" : "#93B5E9",
      textColor: "#3D375A",
      allDay: info.allDay,
      extendedProps: {
        host: user.title === "Secretary" ? 0 : user.id,
        duration: info.allDay
          ? 1440
          : Math.floor((endDate - startDate) / (1000 * 60)),
        purpose: "Appointment",
        status: "Scheduled",
      },
    };

    if (timelineVisible) {
      let availableRooms;
      try {
        availableRooms = await getAvailableRooms(
          0,
          startDate,
          endDate,
          sites,
          timelineSiteId
        );
      } catch (err) {
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
        return;
      }
      if (
        info.resource.id === "z" ||
        availableRooms.includes(info.resource.id) ||
        (!availableRooms.includes(info.resource.id) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              timelineSiteId,
              info.resource.id
            )} will be occupied at this time slot, choose it anyway ?`,
          })))
      ) {
        newEvent.resourceId = info.resource.id;
        newEvent.extendedProps.roomId = info.resource.id;
        newEvent.extendedProps.roomTitle = toRoomTitle(
          sites,
          timelineSiteId,
          info.resource.id
        );
        newEvent.extendedProps.siteId = timelineSiteId;
        newEvent.extendedProps.siteName = toSiteName(sites, timelineSiteId);
        fcRef.current.calendar.addEvent(newEvent);
        fcRef.current.calendar.unselect();

        const datasToPost = {
          host_id: newEvent.extendedProps.host,
          start: newEvent.start, //local timestamp
          end: newEvent.end, //local timestamp
          patients_guests_ids: [],
          staff_guests_ids: [],
          room_id: newEvent.extendedProps.roomId,
          all_day: newEvent.allDay,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
          AppointmentTime: timestampToTimeISOTZ(newEvent.start),
          Duration: newEvent.extendedProps.duration,
          AppointmentStatus: newEvent.extendedProps.status,
          AppointmentDate: timestampToDateISOTZ(
            newEvent.start,
            "America/Toronto"
          ),
          AppointmentPurpose: newEvent.extendedProps.purpose,
          AppointmentNotes: newEvent.extendedProps.notes,
          site_id: timelineSiteId,
        };

        if (newEvent.extendedProps.host) {
          //s'il y a un host c'est forcément le user
          datasToPost.Provider = {
            Name: {
              FirstName: user.first_name,
              LastName: user.last_name,
            },
            OHIPPhysicianId: user.ohip_billing_nbr,
          };
        }
        try {
          const response = await xanoPost(
            "/appointments",
            "staff",
            datasToPost
          );
          socket.emit("message", {
            route: "EVENTS",
            action: "create",
            content: { data: response.data },
          });
          socket.emit("message", {
            route: "APPOINTMENTS",
            action: "create",
            content: { data: response.data },
          });
          lastCurrentId.current = response.data.id.toString();
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(`Error: unable to save apointment: ${err.message}`, {
              containerId: "A",
            });
        }
      }
    } else {
      newEvent.resourceId = "z";
      newEvent.extendedProps.roomId = "z";
      newEvent.extendedProps.roomName = "To Be Determined";
      newEvent.extendedProps.siteId = user.site_id;
      newEvent.extendedProps.siteName = toSiteName(sites, user.site_id);
      fcRef.current.calendar.addEvent(newEvent);
      fcRef.current.calendar.unselect();
      const datasToPost = {
        host_id: newEvent.extendedProps.host,
        start: newEvent.start,
        end: newEvent.end,
        patients_guests_ids: [],
        staff_guests_ids: [],
        room_id: newEvent.extendedProps.roomId,
        all_day: newEvent.allDay,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        AppointmentTime: timestampToTimeISOTZ(newEvent.start),
        Duration: newEvent.extendedProps.duration,
        AppointmentStatus: newEvent.extendedProps.status,
        AppointmentDate: timestampToDateISOTZ(
          newEvent.start,
          "America/Toronto"
        ),
        AppointmentPurpose: newEvent.extendedProps.purpose,
        AppointmentNotes: newEvent.extendedProps.notes,
        site_id: user.site_id,
      };

      if (newEvent.extendedProps.host) {
        //s'il y a un host c'est forcément le user
        datasToPost.Provider = {
          Name: {
            FirstName: user.first_name,
            LastName: user.last_name,
          },
          OHIPPhysicianId: user.ohip_billing_nbr,
        };
      }
      try {
        const response = await xanoPost("/appointments", "staff", datasToPost);
        socket.emit("message", {
          route: "EVENTS",
          action: "create",
          content: { data: response.data },
        });
        socket.emit("message", {
          route: "APPOINTMENTS",
          action: "create",
          content: { data: response.data },
        });
        lastCurrentId.current = response.data.id.toString();
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to save appointment: ${err.message}`, {
            containerId: "A",
          });
      }
    }
    if (!sitesIds.includes(user.site_id)) {
      setSitesIds([...sitesIds, user.site_id]);
    }
  };
  //DRAG AND DROP
  const handleDragStart = (info) => {
    if (!currentEvent.current) {
      return;
    }
    setFormVisible(false);
    if (currentEvent.current.id !== info.event.id) {
      currentEventElt.current.style.border = "none";
    }
  };
  const handleDrop = async (info) => {
    const event = info.event;
    const eventElt = info.el;
    if (currentEventElt.current) currentEventElt.current.style.border = "none";
    info.el.style.border = "solid 1px red";
    currentEvent.current = event;
    lastCurrentId.current = event.id;
    currentEventElt.current = eventElt;
    const startDate = DateTime.fromJSDate(event.start, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end, {
      zone: "America/Toronto",
    }).toMillis();
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites,
        timelineVisible ? timelineSiteId : user.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get availabale rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    const startAllDay = DateTime.fromMillis(startDate, {
      zone: "America/Toronto",
    })
      .set({ hour: 0, minute: 0, second: 0 })
      .toMillis();
    const endAllDay = startAllDay + 24 * 3600 * 1000;

    let datasToPut = {
      host_id: event.extendedProps.host,
      start: event.allDay ? startAllDay : startDate,
      end: event.allDay ? endAllDay : endDate,
      patients_guests_ids: event.extendedProps.patientsGuestsIds.map(
        ({ patient_infos }) => patient_infos.patient_id
      ),
      staff_guests_ids: event.extendedProps.staffGuestsIds.map(
        ({ staff_infos }) => staff_infos.id
      ),
      all_day: event.allDay,
      date_created: event.extendedProps.date_created,
      created_by_id: event.extendedProps.created_by_id,
      updates: [
        ...event.extendedProps.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      AppointmentTime: timestampToTimeISOTZ(
        DateTime.fromJSDate(event.start, { zone: "America/Toronto" }).toMillis()
      ),
      Duration: event.allDay
        ? 1440
        : Math.floor((endDate - startDate) / (1000 * 60)),
      AppointmentStatus: event.extendedProps.status,
      AppointmentDate: timestampToDateISOTZ(
        DateTime.fromJSDate(event.start, { zone: "America/Toronto" }).toMillis()
      ),
      Provider: {
        Name: {
          FirstName: event.extendedProps.hostFirstName,
          LastName: event.extendedProps.hostLastName,
        },
        OHIPPhysicianId: event.extendedProps.OHIP,
      },
      AppointmentPurpose: event.extendedProps.purpose,
      AppointmentNotes: event.extendedProps.notes,
      site_id: event.extendedProps.siteId,
    };

    if (!timelineVisible) {
      if (
        event.extendedProps.roomId === "z" ||
        availableRooms.includes(event.extendedProps.roomId) ||
        (!availableRooms.includes(event.extendedProps.roomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              user.site_id,
              event.extendedProps.roomId
            )} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        datasToPut.room_id = event.extendedProps.roomId;
        try {
          const response = await xanoPut(
            `/appointments/${event.id}`,
            "staff",
            datasToPut
          );
          socket.emit("message", {
            route: "EVENTS",
            action: "update",
            content: { id: event.id, data: response.data },
          });
          socket.emit("message", {
            route: "APPOINTMENTS",
            action: "update",
            content: { id: event.id, data: response.data },
          });
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(`Error: unable to save appointment: ${err.message}`, {
              containerId: "A",
            });
        }
      } else {
        info.revert();
      }
    } else {
      const newRoomId = info.newResource
        ? info.newResource.id
        : event.extendedProps.roomId;
      if (
        newRoomId === "z" ||
        availableRooms.includes(newRoomId) ||
        (!availableRooms.includes(newRoomId) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              timelineSiteId,
              newRoomId
            )} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        event.setExtendedProp("roomId", newRoomId);
        event.setResources([newRoomId]);
        datasToPut.room_id = newRoomId;
        try {
          const response = await xanoPut(
            `/appointments/${event.id}`,
            "staff",
            datasToPut
          );
          socket.emit("message", {
            route: "EVENTS",
            action: "update",
            content: { id: event.id, data: response.data },
          });
          socket.emit("message", {
            route: "APPOINTMENTS",
            action: "update",
            content: { id: event.id, data: response.data },
          });
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(`Error: unable to save appointment: ${err.message}`, {
              containerId: "A",
            });
        }
      } else {
        info.revert();
      }
    }
  };
  //RESIZE
  const handleResizeStart = () => {
    setFormVisible(false);
  };
  const handleResize = async (info) => {
    const event = info.event;
    const eventElt = info.el;

    if (currentEventElt.current) currentEventElt.current.style.border = "none";
    info.el.style.border = "solid 1px red";
    currentEvent.current = event;
    lastCurrentId.current = event.id;
    currentEventElt.current = eventElt;

    const startDate = DateTime.fromJSDate(event.start, {
      zone: "America/Toronto",
    }).toMillis();
    const endDate = DateTime.fromJSDate(event.end, {
      zone: "America/Toronto",
    }).toMillis();

    //same as a drop
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        sites,
        timelineVisible ? timelineSiteId : user.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }

    if (
      event.extendedProps.roomId === "z" ||
      availableRooms.includes(event.extendedProps.roomId) ||
      (!availableRooms.includes(event.extendedProps.roomId) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            event.extendedProps.siteId,
            event.extendedProps.roomId
          )} will be occupied at this time slot, change schedule anyway?`,
        })))
    ) {
      let datasToPut = {
        host_id: event.extendedProps.host,
        start: startDate,
        end: endDate,
        patients_guests_ids: event.extendedProps.patientsGuestsIds.map(
          ({ patient_infos }) => patient_infos.patient_id
        ),
        staff_guests_ids: event.extendedProps.staffGuestsIds.map(
          ({ staff_infos }) => staff_infos.id
        ),
        room_id: event.extendedProps.roomId,
        all_day: event.allDay,
        date_created: event.extendedProps.date_created,
        created_by_id: event.extendedProps.created_by_id,
        updates: [
          ...event.extendedProps.updates,
          { updated_by_id: user.id, date_updated: nowTZTimestamp() },
        ],
        AppointmentTime: timestampToTimeISOTZ(
          DateTime.fromJSDate(event.start, {
            zone: "America/Toronto",
          }).toMillis()
        ),
        Duration: event.allDay
          ? 1440
          : Math.floor((endDate - startDate) / (1000 * 60)),
        AppointmentStatus: event.extendedProps.status,
        AppointmentDate: timestampToDateISOTZ(
          DateTime.fromJSDate(event.start, {
            zone: "America/Toronto",
          }).toMillis()
        ),
        Provider: {
          Name: {
            FirstName: event.extendedProps.hostFirstName,
            LastName: event.extendedProps.hostLastName,
          },
          OHIPPhysicianId: event.extendedProps.OHIP,
        },
        AppointmentPurpose: event.extendedProps.purpose,
        AppointmentNotes: event.extendedProps.notes,
        site_id: event.extendedProps.siteId,
      };

      try {
        const response = await xanoPut(
          `/appointments/${event.id}`,
          "staff",
          datasToPut
        );
        socket.emit("message", {
          route: "EVENTS",
          action: "update",
          content: { id: event.id, data: response.data },
        });
        socket.emit("message", {
          route: "APPOINTMENTS",
          action: "update",
          content: { id: event.id, data: response.data },
        });
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to save appointment: ${err.message}`, {
            containerId: "A",
          });
      }
    } else {
      info.revert();
    }
  };
  return events ? (
    <div>
      <CalendarOptions
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
        editAvailabilityVisible={editAvailabilityVisible}
        setEditAvailabilityVisible={setEditAvailabilityVisible}
      />
      <div className="calendar">
        <div className="calendar__left-bar">
          <Shortcutpickr
            handleShortcutpickrChange={handleShortcutpickrChange}
          />
          <CalendarFilter
            sites={sites}
            sitesIds={sitesIds}
            setSitesIds={setSitesIds}
            hostsIds={hostsIds}
            setHostsIds={setHostsIds}
            remainingStaff={remainingStaff}
          />
        </div>
        <div className="calendar__display">
          {timelineVisible && (
            <SelectTimelineSite
              sites={sites}
              timelineSiteId={timelineSiteId}
              setTimelineSiteId={setTimelineSiteId}
            />
          )}
          <ToggleView
            setTimelineVisible={setTimelineVisible}
            timelineVisible={timelineVisible}
          />
          {!timelineVisible ? (
            <CalendarView
              slotDuration={user.settings.slot_duration}
              firstDay={user.settings.first_day}
              fcRef={fcRef}
              isSecretary={user.title === "Secretary"}
              events={events}
              handleDatesSet={handleDatesSet}
              handleDateSelect={handleDateSelect}
              handleDragStart={handleDragStart}
              handleEventClick={handleEventClick}
              handleDrop={handleDrop}
              handleResize={handleResize}
              handleResizeStart={handleResizeStart}
              renderEventContent={renderEventContent}
            />
          ) : (
            <TimelineView
              slotDuration={user.settings.slot_duration}
              firstDay={user.settings.first_day}
              fcRef={fcRef}
              isSecretary={user.title === "Secretary"}
              events={events}
              handleDatesSet={handleDatesSet}
              handleDateSelect={handleDateSelect}
              handleDragStart={handleDragStart}
              handleEventClick={handleEventClick}
              handleDrop={handleDrop}
              handleResize={handleResize}
              handleResizeStart={handleResizeStart}
              renderEventContent={renderEventContent}
              site={sites.find(({ id }) => id === timelineSiteId)}
            />
          )}
          {formVisible && (
            <FakeWindow
              title={`APPOINTMENT DETAILS`}
              width={1050}
              height={790}
              x={(window.innerWidth - 1050) / 2}
              y={(window.innerHeight - 790) / 2}
              color={formColor}
              setPopUpVisible={setFormVisible}
              closeCross={false}
            >
              <EventForm
                currentEvent={currentEvent}
                setFormVisible={setFormVisible}
                remainingStaff={remainingStaff}
                setFormColor={setFormColor}
                setCalendarSelectable={setCalendarSelectable}
                hostsIds={hostsIds}
                setHostsIds={setHostsIds}
                sites={sites}
                setTimelineSiteId={setTimelineSiteId}
                sitesIds={sitesIds}
                setSitesIds={setSitesIds}
              />
            </FakeWindow>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgressMedium />
    </div>
  );
};

export default Calendar;
