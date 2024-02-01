import { CircularProgress } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getAvailableRooms } from "../../../api/getAvailableRooms";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";
import { useEvents } from "../../../hooks/useEvents";
import {
  getWeekRange,
  toLocalDate,
  toLocalTimeWithSeconds,
} from "../../../utils/formatDates";
import { patientIdToName } from "../../../utils/patientIdToName";
import { rooms } from "../../../utils/rooms";
import { onMessageEvents } from "../../../utils/socketHandlers/onMessageEvents";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import EventForm from "../EventForm/EventForm";
import CalendarFilter from "./CalendarFilter";
import CalendarOptions from "./CalendarOptions";
import CalendarView from "./CalendarView";
import Shortcutpickr from "./Shortcutpickr";
import TimelineView from "./TimelineView";
import ToggleView from "./ToggleView";

var _ = require("lodash");

//MY COMPONENT
const Calendar = () => {
  //====================== HOOKS =======================//
  const { clinic, auth, user, socket } = useAuth();
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [hostsIds, setHostsIds] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const fcRef = useRef(null); //fullcalendar
  const currentEvent = useRef(null);
  const currentEventElt = useRef(null);
  const currentView = useRef(null);
  const lastCurrentId = useRef("");
  const eventCounter = useRef(0);
  const [rangeStart, setRangeStart] = useState(
    Date.parse(getWeekRange(user.settings.first_day)[0])
  );
  const [rangeEnd, setRangeEnd] = useState(
    Date.parse(getWeekRange(user.settings.first_day)[1])
  );
  const isSecretary = useCallback(() => {
    return user.title === "Secretary" ? true : false;
  }, [user.title]);
  const [{ events, remainingStaff }, fetchEvents, setEvents] = useEvents(
    hostsIds,
    rangeStart,
    rangeEnd,
    isSecretary(),
    user.id
  );
  const [formColor, setFormColor] = useState("#6490D2");

  useEffect(() => {
    if (lastCurrentId.current) {
      currentEventElt.current = document.getElementsByClassName(
        `event-${lastCurrentId.current}`
      )[0];
      if (
        document.getElementsByClassName(`event-${lastCurrentId.current}`)[0]
      ) {
        document.getElementsByClassName(
          `event-${lastCurrentId.current}`
        )[0].style.opacity = 1;
      }
    }
  }, [events]);

  useEffect(() => {
    user.title === "Secretary"
      ? setHostsIds([0, ...clinic.staffInfos.map(({ id }) => id)])
      : setHostsIds([user.id]);
  }, [clinic.staffInfos, user.id, user.title]);

  useEffect(() => {
    const handleKeyboardShortcut = async (event) => {
      if (event.keyCode === 37 && event.shiftKey) {
        //arrow left
        fcRef.current.calendar.prev();
      } else if (event.keyCode === 39 && event.shiftKey) {
        //arrow right
        fcRef.current.calendar.next();
      } else if (event.keyCode === 84 && event.shiftKey) {
        //T
        fcRef.current.calendar.today();
      } else if (
        currentEvent.current &&
        (currentEvent.current.extendedProps.host === user.id ||
          isSecretary()) &&
        (event.key === "Backspace" || event.key === "Delete") &&
        !formVisible
      ) {
        //backspace
        if (
          await confirmAlert({
            content: "Do you really want to remove this event ?",
          })
        ) {
          try {
            await axiosXanoStaff.delete(
              `/appointments/${currentEvent.current.id}`,
              {
                headers: { Authorization: `Bearer ${auth.authToken}` },
              }
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
              content: { id: currentEvent.current.id },
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
      } else if (event.keyCode === 40 && event.shiftKey) {
        const eventsList = document.getElementsByClassName("fc-event");
        eventCounter.current += 1;
        eventsList[eventCounter.current % eventsList.length].click();
        eventsList[eventCounter.current % eventsList.length].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      } else if (event.keyCode === 38 && event.shiftKey) {
        const eventsList = document.getElementsByClassName("fc-event");
        eventCounter.current - 1 < 0
          ? (eventCounter.current = eventsList.length - 1)
          : (eventCounter.current -= 1);
        eventsList[eventCounter.current % eventsList.length].click();
        eventsList[eventCounter.current % eventsList.length].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [auth.authToken, formVisible, isSecretary, socket, user.id]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageEvents(
        message,
        events,
        setEvents,
        clinic.staffInfos,
        user.id,
        user.title === "Secretary"
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [clinic.staffInfos, events, setEvents, socket, user.id, user.title]);

  //====================== EVENTS HANDLERS ==========================//
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
      //change opacity and unselect previous event
      currentEventElt.current.style.opacity = 0.65;
      //Change current event, current event element and current view
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.opacity = "1";
    } else if (currentEvent.current === null) {
      //first event selection
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.opacity = "1";
    } else {
      //click on already selected event
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.opacity = "1";
    }
    if (
      await confirmAlert({
        content: "Do you really want to remove this event ?",
      })
    ) {
      try {
        await axiosXanoStaff.delete(
          `/appointments/${currentEvent.current.id}`,
          {
            headers: { Authorization: `Bearer ${auth.authToken}` },
          }
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
          content: { id: currentEvent.current.id },
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
  const renderEventContent = (info) => {
    const event = info.event;
    let staffGuestsIds = event.extendedProps.staffGuestsIds ?? [];
    let patientsGuestsIds = event.extendedProps.patientsGuestsIds ?? [];
    const hostName = event.extendedProps.host
      ? staffIdToTitleAndName(clinic.staffInfos, event.extendedProps.host, true)
      : "";
    if (
      info.view.type === "timeGridWeek" ||
      info.view.type === "dayGridMonth" ||
      info.view.type === "multiMonthYear" ||
      info.view.type === "resourceTimeGridDay"
    ) {
      return (
        <div style={{ fontSize: "0.7rem" }}>
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
            {patientsGuestsIds.length || staffGuestsIds.length ? (
              <span>
                {patientsGuestsIds.map((id) => (
                  <span
                    className="calendar__patient-link"
                    onClick={(e) => handlePatientClick(e, id)}
                    key={id}
                  >
                    {patientIdToName(
                      clinic.demographicsInfos,
                      id
                    ).toUpperCase()}
                    ,{" "}
                  </span>
                ))}
                {staffGuestsIds.map((id) => (
                  <span key={id}>
                    {staffIdToTitleAndName(
                      clinic.staffInfos,
                      id,
                      true
                    ).toUpperCase()}
                    ,{" "}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
          {/* )} */}
          <div>
            <strong>Host: </strong>
            {hostName}
          </div>
          <div>
            <strong>Room: </strong>
            {event.extendedProps.room}
          </div>
          <div>
            <strong>Status: </strong>
            {event.extendedProps.status}
          </div>
        </div>
      );
    } else if (info.view.type === "timeGrid") {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 2px",
            alignItems: "center",
            fontSize: "0.7rem",
          }}
        >
          <div>
            {event.allDay ? "All Day" : info.timeText}
            <span style={{ marginLeft: "10px" }}>
              <strong>
                {event.extendedProps.purpose?.toUpperCase() ?? "APPOINTMENT"}
              </strong>
              {" / "}
            </span>
            {patientsGuestsIds.length || staffGuestsIds.length ? (
              <span>
                {patientsGuestsIds.map((id) => (
                  <span
                    className="calendar__patient-link"
                    onClick={(e) => handlePatientClick(e, id)}
                    key={id}
                  >
                    <strong>
                      {patientIdToName(
                        clinic.demographicsInfos,
                        id
                      ).toUpperCase()}
                    </strong>
                    ,{" "}
                  </span>
                ))}
                {staffGuestsIds.map((id) => (
                  <span key={id}>
                    <strong>
                      {staffIdToTitleAndName(
                        clinic.staffInfos,
                        id,
                        true
                      ).toUpperCase()}
                    </strong>
                    ,{" "}
                  </span>
                ))}
                {" / "}
              </span>
            ) : null}
            <strong>Host: </strong>
            {hostName} / <strong>Room: </strong>
            {event.extendedProps.room} / <strong>Status: </strong>
            {event.extendedProps.status}
          </div>
          <i
            className="fa-solid fa-trash"
            onClick={(e) => handleDeleteEvent(e, info)}
          ></i>
        </div>
      );
    } else if (info.view.type === "listWeek") {
      return (
        <>
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
            {patientsGuestsIds.length || staffGuestsIds.length ? (
              <span>
                {patientsGuestsIds.map((id) => (
                  <span
                    className="calendar__patient-link calendar__patient-link--list"
                    onClick={(e) => handlePatientClick(e, id)}
                    key={id}
                  >
                    <strong>
                      {patientIdToName(
                        clinic.demographicsInfos,
                        id
                      ).toUpperCase()}
                    </strong>
                    ,{" "}
                  </span>
                ))}
                {staffGuestsIds.map((id) => (
                  <span key={id}>
                    <strong>
                      {staffIdToTitleAndName(
                        clinic.staffInfos,
                        id,
                        true
                      ).toUpperCase()}
                    </strong>
                    ,{" "}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
          <div>
            <strong>Host: </strong>
            {hostName}
          </div>
          <div>
            <strong>Room: </strong>
            {event.extendedProps.room}
          </div>
          <div>
            <strong>Status: </strong>
            {event.extendedProps.status}
          </div>
        </>
      );
    }
  };

  //DATES SET
  const handleDatesSet = async (info) => {
    setRangeStart(Date.parse(info.startStr));
    setRangeEnd(Date.parse(info.endStr));
    currentEvent.current = null;
    lastCurrentId.current = "";
    currentEventElt.current = null;
    currentView.current = info.view;
  };

  //DATE SELECT
  const handleDateSelect = async (info) => {
    if (currentEventElt.current) currentEventElt.current.style.opacity = 0.65;
    const startDate = Date.parse(info.startStr);
    const endDate = Date.parse(info.endStr);

    const startAllDay = new Date(new Date(startDate).setHours(0, 0, 0, 0));
    let endAllDay = new Date(startAllDay);
    endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);

    let datas = {};
    let newEvent = {
      start: info.allDay ? startAllDay : new Date(startDate),
      end: info.allDay ? endAllDay : new Date(endDate),
      allDay: info.allDay,
      extendedProps: {
        host: isSecretary() ? 0 : user.id,
        duration: info.allDay
          ? 1440
          : Math.floor((endDate - startDate) / (1000 * 60)),
        purpose: "Appointment",
        status: "Scheduled",
      },
      color: isSecretary() ? "#bfbfbf" : "#6490D2",
      textColor: "#FEFEFE",
    };

    if (timelineVisible) {
      let availableRooms;
      try {
        availableRooms = await getAvailableRooms(
          0,
          startDate,
          endDate,
          auth.authToken
        );
      } catch (err) {
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
        return;
      }
      if (
        info.resource.title === "To be determined" ||
        availableRooms.includes(info.resource.title) ||
        (!availableRooms.includes(info.resource.title) &&
          (await confirmAlert({
            content: `${info.resource.title} will be occupied at this time slot, choose it anyway ?`,
          })))
      ) {
        newEvent.resourceId = info.resource.id;
        newEvent.extendedProps.room = info.resource.title;
        fcRef.current.calendar.addEvent(newEvent);
        fcRef.current.calendar.unselect();

        datas = {
          host_id: newEvent.extendedProps.host,
          start: Date.parse(newEvent.start),
          end: Date.parse(newEvent.end),
          patients_guests_ids: [],
          staff_guests_ids: [],
          room: newEvent.extendedProps.room,
          all_day: newEvent.allDay,
          date_created: Date.now(),
          created_by_id: user.id,
          AppointmentTime: toLocalTimeWithSeconds(newEvent.start),
          Duration: newEvent.extendedProps.duration,
          AppointmentStatus: newEvent.extendedProps.status,
          AppointmentDate: toLocalDate(newEvent.start),
          AppointmentPurpose: newEvent.extendedProps.purpose,
          AppointmentNotes: newEvent.extendedProps.notes,
        };

        if (newEvent.extendedProps.host) {
          datas.Provider = {
            Name: {
              FirstName: staffIdToFirstName(
                clinic.staffInfos,
                parseInt(newEvent.extendedProps.host)
              ),
              LastName: staffIdToLastName(
                clinic.staffInfos,
                parseInt(newEvent.extendedProps.host)
              ),
            },
            OHIPPhysicianId: staffIdToOHIP(
              clinic.staffInfos,
              parseInt(newEvent.extendedProps.host)
            ),
          };
        }
        try {
          const response = await axiosXanoStaff.post("/appointments", datas, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          });
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
      newEvent.extendedProps.room = "To be determined";
      fcRef.current.calendar.addEvent(newEvent);
      fcRef.current.calendar.unselect();
      datas = {
        host_id: newEvent.extendedProps.host,
        start: Date.parse(newEvent.start),
        end: Date.parse(newEvent.end),
        patients_guests_ids: [],
        staff_guests_ids: [],
        room: newEvent.extendedProps.room,
        all_day: newEvent.allDay,
        date_created: Date.now(),
        created_by_id: user.id,
        AppointmentTime: toLocalTimeWithSeconds(newEvent.start),
        Duration: newEvent.extendedProps.duration,
        AppointmentStatus: newEvent.extendedProps.status,
        AppointmentDate: toLocalDate(newEvent.start),
        AppointmentPurpose: newEvent.extendedProps.purpose,
        AppointmentNotes: newEvent.extendedProps.notes,
      };

      if (newEvent.extendedProps.host) {
        datas.Provider = {
          Name: {
            FirstName: staffIdToFirstName(
              clinic.staffInfos,
              parseInt(newEvent.extendedProps.host)
            ),
            LastName: staffIdToLastName(
              clinic.staffInfos,
              parseInt(newEvent.extendedProps.host)
            ),
          },
          OHIPPhysicianId: staffIdToOHIP(
            clinic.staffInfos,
            parseInt(newEvent.extendedProps.host)
          ),
        };
      }
      try {
        const response = await axiosXanoStaff.post(
          "/appointments",
          JSON.stringify(datas),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
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
          toast.error(`Error: unable to save appointment: ${err.message}`, {
            containerId: "A",
          });
      }
    }
  };

  //DRAG AND DROP
  const handleDragStart = (info) => {
    if (!currentEvent.current) {
      return;
    }
    setFormVisible(false);
    if (currentEvent.current.id !== info.event.id) {
      currentEventElt.current.style.opacity = 0.65;
    }
  };

  const handleDrop = async (info) => {
    const event = info.event;
    const eventElt = info.el;
    if (currentEventElt.current) currentEventElt.current.style.opacity = 0.65;
    info.el.style.opacity = "1";
    currentEvent.current = event;
    lastCurrentId.current = event.id;
    currentEventElt.current = eventElt;
    const startDate = Date.parse(event.start);
    const endDate = Date.parse(event.end);
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        auth.authToken
      );
    } catch (err) {
      toast.error(`Error: unable to get availabale rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    const startAllDay = event.start.setHours(0, 0, 0, 0);
    const endAllDay = event.end.setHours(0, 0, 0, 0);

    let datas = {
      host_id: event.extendedProps.host,
      start: event.allDay ? startAllDay : startDate,
      end: event.allDay ? endAllDay : endDate,
      patients_guests_ids: event.extendedProps.patientsGuestsIds,
      staff_guests_ids: event.extendedProps.staffGuestsIds,
      all_day: event.allDay,
      date_created: event.extendedProps.date_created,
      created_by_id: event.extendedProps.created_by_id,
      updates: [
        ...event.extendedProps.updates,
        { updated_by_id: user.id, date_updated: Date.now() },
      ],
      AppointmentTime: event.allDay
        ? toLocalTimeWithSeconds(startAllDay)
        : toLocalTimeWithSeconds(startDate),
      Duration: event.allDay
        ? 1440
        : Math.floor((endDate - startDate) / (1000 * 60)),
      AppointmentStatus: event.extendedProps.status,
      AppointmentDate: event.allDay
        ? toLocalDate(startAllDay)
        : toLocalDate(startDate),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            clinic.staffInfos,
            parseInt(event.extendedProps.host)
          ),
          LastName: staffIdToLastName(
            clinic.staffInfos,
            parseInt(event.extendedProps.host)
          ),
        },
        OHIPPhysicianId: staffIdToOHIP(
          clinic.staffInfos,
          parseInt(event.extendedProps.host)
        ),
      },
      AppointmentPurpose: event.extendedProps.purpose,
      AppointmentNotes: event.extendedProps.notes,
    };

    if (!timelineVisible) {
      if (
        event.extendedProps.room === "To be determined" ||
        availableRooms.includes(event.extendedProps.room) ||
        (!availableRooms.includes(event.extendedProps.room) &&
          (await confirmAlert({
            content: `${event.extendedProps.room} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        datas.room = event.extendedProps.room;
        try {
          await axiosXanoStaff.put(`/appointments/${event.id}`, datas, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          });
          socket.emit("message", {
            route: "EVENTS",
            action: "update",
            content: { id: event.id, data: { id: event.id, ...datas } },
          });
          socket.emit("message", {
            route: "APPOINTMENTS",
            action: "update",
            content: { id: event.id, data: { id: event.id, ...datas } },
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
      const newRoom = info.newResource
        ? info.newResource.title
        : event.extendedProps.room;
      if (
        newRoom === "To be determined" ||
        availableRooms.includes(newRoom) ||
        (!availableRooms.includes(newRoom) &&
          (await confirmAlert({
            content: `${newRoom} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        event.setExtendedProp("room", newRoom);
        event.setResources([rooms[_.findIndex(rooms, { title: newRoom })].id]);
        datas.room = newRoom;
        try {
          await axiosXanoStaff.put(`/appointments/${event.id}`, datas, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          });
          socket.emit("message", {
            route: "EVENTS",
            action: "update",
            content: { id: event.id, data: { id: event.id, ...datas } },
          });
          socket.emit("message", {
            route: "APPOINTMENTS",
            action: "update",
            content: { id: event.id, data: { id: event.id, ...datas } },
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

    if (currentEventElt.current) currentEventElt.current.style.opacity = 0.65;
    info.el.style.opacity = "1";
    currentEvent.current = event;
    lastCurrentId.current = event.id;
    currentEventElt.current = eventElt;

    const startDate = Date.parse(event.start);
    const endDate = Date.parse(event.end);

    //same as a drop
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        auth.authToken
      );
    } catch (err) {
      toast.error(`Error: unable to save appointment: ${err.message}`, {
        containerId: "A",
      });
      return;
    }
    const startAllDay = event.start.setHours(0, 0, 0, 0);
    const endAllDay = event.end.setHours(0, 0, 0, 0);

    if (
      event.extendedProps.room === "To be determined" ||
      availableRooms.includes(event.extendedProps.room) ||
      (!availableRooms.includes(event.extendedProps.room) &&
        (await confirmAlert({
          content: `${event.extendedProps.room} will be occupied at this time slot, change schedule anyway?`,
        })))
    ) {
      let datas = {
        host_id: event.extendedProps.host,
        start: event.allDay ? startAllDay : startDate,
        end: event.allDay ? endAllDay : endDate,
        patients_guests_ids: event.extendedProps.patientsGuestsIds,
        staff_guests_ids: event.extendedProps.staffGuestsIds,
        room: event.extendedProps.room,
        all_day: event.allDay,
        date_created: event.extendedProps.date_created,
        created_by_id: event.extendedProps.created_by_id,
        updates: [
          ...event.extendedProps.updates,
          { updated_by_id: user.id, date_updated: Date.now() },
        ],
        AppointmentTime: event.allDay
          ? toLocalTimeWithSeconds(startAllDay)
          : toLocalTimeWithSeconds(startDate),
        Duration: event.allDay
          ? 1440
          : Math.floor((endDate - startDate) / (1000 * 60)),
        AppointmentStatus: event.extendedProps.status,
        AppointmentDate: event.allDay
          ? toLocalDate(startAllDay)
          : toLocalDate(startDate),
        Provider: {
          Name: {
            FirstName: staffIdToFirstName(
              clinic.staffInfos,
              parseInt(event.extendedProps.host)
            ),
            LastName: staffIdToLastName(
              clinic.staffInfos,
              parseInt(event.extendedProps.host)
            ),
          },
          OHIPPhysicianId: staffIdToOHIP(
            clinic.staffInfos,
            parseInt(event.extendedProps.host)
          ),
        },
        AppointmentPurpose: event.extendedProps.purpose,
        AppointmentNotes: event.extendedProps.notes,
      };
      try {
        await axiosXanoStaff.put(`/appointments/${event.id}`, datas, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        socket.emit("message", {
          route: "EVENTS",
          action: "update",
          content: { id: event.id, data: { id: event.id, ...datas } },
        });
        socket.emit("message", {
          route: "APPOINTMENTS",
          action: "update",
          content: { id: event.id, data: { id: event.id, ...datas } },
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

  const handleEventClick = async (info) => {
    if (formVisible) return;
    const eventElt = info.el;
    const event = info.event;
    const view = info.view;
    if (currentEvent.current && currentEvent.current.id !== event.id) {
      //event selection change
      //change opacity and unselect previous event
      currentEventElt.current.style.opacity = 0.65;
      //Change current event, current event element and current view
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.opacity = "1";
    } else if (currentEvent.current === null) {
      //first event selection
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.opacity = "1";
    } else {
      //click on already selected event
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.opacity = "1";
      setFormColor(event.backgroundColor);
      setFormVisible(true);
      setCalendarSelectable(false);
    }
  };

  const handleShortcutpickrChange = (selectedDates, dateStr) => {
    fcRef.current.calendar.gotoDate(dateStr);
  };

  //======================== FUNCTIONS ===================//
  const setCalendarSelectable = (selectable) => {
    fcRef.current.calendar.currentData.options.selectable = selectable;
  };

  return events && clinic.staffInfos ? (
    <div className="calendar">
      <div className="calendar__left-bar">
        <Shortcutpickr handleShortcutpickrChange={handleShortcutpickrChange} />
        <CalendarOptions title="Options" />
        <CalendarFilter
          staffInfos={clinic.staffInfos}
          hostsIds={hostsIds}
          setHostsIds={setHostsIds}
          remainingStaff={remainingStaff}
        />
      </div>
      <div className="calendar__display">
        <ToggleView
          setTimelineVisible={setTimelineVisible}
          timelineVisible={timelineVisible}
        />
        {!timelineVisible ? (
          <CalendarView
            slotDuration={user.settings.slot_duration}
            firstDay={user.settings.first_day}
            fcRef={fcRef}
            isSecretary={isSecretary}
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
            isSecretary={isSecretary}
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
        )}
        {formVisible && (
          <FakeWindow
            title={`APPOINTMENT DETAILS`}
            width={900}
            height={750}
            x={(window.innerWidth - 900) / 2}
            y={(window.innerHeight - 750) / 2}
            color={formColor}
            setPopUpVisible={setFormVisible}
            closeCross={false}
          >
            <EventForm
              staffInfos={clinic.staffInfos}
              demographicsInfos={clinic.demographicsInfos}
              currentEvent={currentEvent}
              setFormVisible={setFormVisible}
              remainingStaff={remainingStaff}
              setFormColor={setFormColor}
              setCalendarSelectable={setCalendarSelectable}
              hostsIds={hostsIds}
              setHostsIds={setHostsIds}
            />
          </FakeWindow>
        )}
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
      <CircularProgress />
    </div>
  );
};

export default Calendar;
