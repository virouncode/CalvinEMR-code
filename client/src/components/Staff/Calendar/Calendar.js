import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getAvailableRooms } from "../../../api/getAvailableRooms";
import xanoDelete from "../../../api/xanoDelete";
import xanoPost from "../../../api/xanoPost";
import xanoPut from "../../../api/xanoPut";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useAvailabilty from "../../../hooks/useAvailability";
import useCalendarShortcuts from "../../../hooks/useCalendarShortcuts";
import useEvents from "../../../hooks/useEvents";
import useEventsSocket from "../../../hooks/useEventsSocket";
import useFetchDatas from "../../../hooks/useFetchDatas";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import {
  toLocalDate,
  toLocalTimeWithSeconds,
} from "../../../utils/formatDates";
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
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [rangeStart, setRangeStart] = useState(new Date().setHours(0, 0, 0));
  const [rangeEnd, setRangeEnd] = useState(new Date().setHours(23, 59, 59));
  const [formColor, setFormColor] = useState("#6490D2");
  const [sitesIds, setSitesIds] = useState([user.site_id]); //Sites for CalendarFilter
  const [timelineSiteId, setTimelineSiteId] = useState(user.site_id); //SelectTimelineSite
  const [hostsIds, setHostsIds] = useState(
    user.title === "Secretary"
      ? [0, ...staffInfos.map(({ id }) => id)]
      : [user.id]
  );
  const [sites] = useFetchDatas("/sites", axiosXanoStaff, auth.authToken);
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
  } = useAvailabilty(user.id, auth.authToken);

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
      if (
        document.getElementsByClassName(`event-${lastCurrentId.current}`)[0]
      ) {
        document.getElementsByClassName(
          `event-${lastCurrentId.current}`
        )[0].style.opacity = 1;
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
    setCalendarSelectable
  );
  useEventsSocket(events, setEvents, sites);

  //=============================== EVENTS HANDLERS =================================//
  const handleShortcutpickrChange = (selectedDates, dateStr) => {
    fcRef.current.calendar.gotoDate(dateStr);
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
        await xanoDelete(
          "/appointments",
          axiosXanoStaff,
          auth.authToken,
          currentEvent.current.id
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
            <span>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest) =>
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
                          {toPatientName(
                            patient_guest.patient_infos
                          ).toUpperCase()}
                          ,{" "}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          {staff_guest.staff_infos.full_name.toUpperCase()},{" "}
                        </span>
                      )
                  )
                : null}
            </span>
          </div>
          {/* )} */}
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
            <span>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest) =>
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
                            {toPatientName(
                              patient_guest.patient_infos
                            ).toUpperCase()}
                          </strong>
                          ,{" "}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          <strong>
                            {staff_guest.staff_infos.full_name.toUpperCase()}
                          </strong>
                          ,{" "}
                        </span>
                      )
                  )
                : null}
              {" / "}
            </span>
            <strong>Host: </strong>
            {event.extendedProps.hostName} / <strong>Site:</strong>{" "}
            {event.extendedProps.siteName} / <strong>Room: </strong>
            {event.extendedProps.roomTitle} / <strong>Status: </strong>
            {event.extendedProps.status}
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
            <span>
              {patientsGuestsIds.length
                ? patientsGuestsIds.map(
                    (patient_guest) =>
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
                            {toPatientName(
                              patient_guest.patient_infos
                            ).toUpperCase()}
                          </strong>
                          ,{" "}
                        </span>
                      )
                  )
                : null}
              {staffGuestsIds.length
                ? staffGuestsIds.map(
                    (staff_guest) =>
                      staff_guest && (
                        <span key={staff_guest.staff_infos.id}>
                          <strong>
                            {staff_guest.staff_infos.full_name.toUpperCase()}
                          </strong>
                          ,{" "}
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
        </>
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
  // DATES SET
  const handleDatesSet = (info) => {
    setRangeStart(Date.parse(info.startStr));
    setRangeEnd(Date.parse(info.endStr));
    currentEvent.current = null;
    lastCurrentId.current = "";
    currentEventElt.current = null;
    currentView.current = info.view;
  };
  // //DATE SELECT
  const handleDateSelect = async (info) => {
    if (currentEventElt.current) currentEventElt.current.style.opacity = 0.65;
    const startDate = Date.parse(info.startStr);
    const defaultDuration =
      defaultDurationHours * 3600000 + defaultDurationMin * 60000;
    const endDate =
      Date.parse(info.endStr) > startDate + defaultDuration
        ? Date.parse(info.endStr)
        : startDate + defaultDuration;

    const startAllDay = new Date(new Date(startDate).setHours(0, 0, 0, 0));
    let endAllDay = new Date(startAllDay);
    endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);

    let newEvent = {
      start: info.allDay ? startAllDay : new Date(startDate),
      end: info.allDay ? endAllDay : new Date(endDate),
      color: user.title === "Secretary" ? "#bfbfbf" : "#6490D2",
      textColor: "#FEFEFE",
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
          timelineSiteId,
          auth.authToken
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
          start: Date.parse(newEvent.start),
          end: Date.parse(newEvent.end),
          patients_guests_ids: [],
          staff_guests_ids: [],
          room_id: newEvent.extendedProps.roomId,
          all_day: newEvent.allDay,
          date_created: Date.now(),
          created_by_id: user.id,
          AppointmentTime: toLocalTimeWithSeconds(newEvent.start),
          Duration: newEvent.extendedProps.duration,
          AppointmentStatus: newEvent.extendedProps.status,
          AppointmentDate: toLocalDate(newEvent.start),
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
            axiosXanoStaff,
            auth.authToken,
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
        start: Date.parse(newEvent.start),
        end: Date.parse(newEvent.end),
        patients_guests_ids: [],
        staff_guests_ids: [],
        room_id: newEvent.extendedProps.roomId,
        all_day: newEvent.allDay,
        date_created: Date.now(),
        created_by_id: user.id,
        AppointmentTime: toLocalTimeWithSeconds(newEvent.start),
        Duration: newEvent.extendedProps.duration,
        AppointmentStatus: newEvent.extendedProps.status,
        AppointmentDate: toLocalDate(newEvent.start),
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
        const response = await xanoPost(
          "/appointments",
          axiosXanoStaff,
          auth.authToken,
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
        sites,
        timelineVisible ? timelineSiteId : user.site_id,
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
            "/appointments",
            axiosXanoStaff,
            auth.authToken,
            datasToPut,
            event.id
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
          await xanoPut(
            "/appointments",
            axiosXanoStaff,
            auth.authToken,
            datasToPut,
            event.id
          );
          socket.emit("message", {
            route: "EVENTS",
            action: "update",
            content: { id: event.id, data: { id: event.id, ...datasToPut } },
          });
          socket.emit("message", {
            route: "APPOINTMENTS",
            action: "update",
            content: { id: event.id, data: { id: event.id, ...datasToPut } },
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
        sites,
        timelineVisible ? timelineSiteId : user.site_id,
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
        start: event.allDay ? startAllDay : startDate,
        end: event.allDay ? endAllDay : endDate,
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
          "/appointments",
          axiosXanoStaff,
          auth.authToken,
          datasToPut,
          event.id
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
              width={900}
              height={790}
              x={(window.innerWidth - 900) / 2}
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
