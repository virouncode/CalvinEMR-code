import { parseToEvent } from "../parseToEvents";
var _ = require("lodash");

const colorsPalette = [
  { background: "#ffe119", text: "#3D375A" },
  { background: "#e6194b", text: "#3D375A" },
  { background: "#3cb44b", text: "#3D375A" },
  { background: "#f58231", text: "#3D375A" },
  { background: "#911eb4", text: "#3D375A" },
  { background: "#42d4f4", text: "#3D375A" },
  { background: "#f032e6", text: "#3D375A" },
  { background: "#bfef45", text: "#3D375A" },
  { background: "#fabed4", text: "#3D375A" },
  { background: "#469990", text: "#3D375A" },
  { background: "#dcbeff", text: "#3D375A" },
  { background: "#9a6324", text: "#3D375A" },
  { background: "#fffac8", text: "#3D375A" },
  { background: "#800000", text: "#3D375A" },
  { background: "#aaffc3", text: "#3D375A" },
  { background: "#808000", text: "#3D375A" },
  { background: "#ffd8b1", text: "#3D375A" },
  { background: "#000075", text: "#3D375A" },
  { background: "#808080", text: "#3D375A" },
];

export const onMessageEvents = (
  message,
  events,
  setEvents,
  staffInfos,
  userId,
  isSecretary,
  sites
) => {
  if (message.route !== "EVENTS") return;
  let rooms;
  let remainingStaffObjects;

  if (message.action !== "delete") {
    rooms = sites.find(({ id }) => id === message.content.data.site_id).rooms;
    remainingStaffObjects = staffInfos
      .filter(({ id }) => id !== userId)
      .map((staff, index) => {
        return {
          id: staff.id,
          color: colorsPalette[index % colorsPalette.length].background,
          textColor: colorsPalette[index % colorsPalette.length].text,
        };
      });
  }

  switch (message.action) {
    case "create":
      const newEvent =
        message.content.data.host_id !== userId
          ? message.content.data.host_id === 0
            ? parseToEvent(
                message.content.data,
                "#bfbfbf",
                "#3D375A",
                isSecretary,
                userId,
                rooms
              ) //grey
            : parseToEvent(
                message.content.data,
                remainingStaffObjects.find(
                  ({ id }) => id === message.content.data.host_id
                ).color,
                remainingStaffObjects.find(
                  ({ id }) => id === message.content.data.host_id
                ).textColor,
                isSecretary,
                userId,
                rooms
              )
          : parseToEvent(
              message.content.data,
              "#93B5E9",
              "#3D375A",
              isSecretary,
              userId,
              rooms
            );
      setEvents([...events, newEvent]);
      break;
    case "update":
      const updatedEvent =
        message.content.data.host_id !== userId
          ? message.content.data.host_id === 0
            ? parseToEvent(
                message.content.data,
                "#bfbfbf",
                "#3D375A",
                isSecretary,
                userId,
                rooms
              ) //grey
            : parseToEvent(
                message.content.data,
                remainingStaffObjects.find(
                  ({ id }) => id === message.content.data.host_id
                ).color,
                remainingStaffObjects.find(
                  ({ id }) => id === message.content.data.host_id
                ).textColor,
                isSecretary,
                userId,
                rooms
              )
          : parseToEvent(
              message.content.data,
              "#93B5E9",
              "#3D375A",
              isSecretary,
              userId,
              rooms
            );
      setEvents(
        events.map((event) =>
          parseInt(event.id) === parseInt(message.content.id)
            ? updatedEvent
            : event
        )
      );
      break;
    case "delete":
      setEvents(
        events.filter(({ id }) => parseInt(id) !== parseInt(message.content.id))
      );
      break;
    default:
      break;
  }
};
