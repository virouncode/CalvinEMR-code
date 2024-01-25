import { parseToEvent } from "../parseToEvents";
var _ = require("lodash");

const colorsPalette = [
  { background: "#ffe119", text: "#21201e" },
  { background: "#e6194b", text: "#FEFEFE" },
  { background: "#3cb44b", text: "#FEFEFE" },
  { background: "#f58231", text: "#FEFEFE" },
  { background: "#911eb4", text: "#FEFEFE" },
  { background: "#42d4f4", text: "#21201e" },
  { background: "#f032e6", text: "#FEFEFE" },
  { background: "#bfef45", text: "#21201e" },
  { background: "#fabed4", text: "#21201e" },
  { background: "#469990", text: "#FEFEFE" },
  { background: "#dcbeff", text: "#21201e" },
  { background: "#9a6324", text: "#FEFEFE" },
  { background: "#fffac8", text: "#21201e" },
  { background: "#800000", text: "#FEFEFE" },
  { background: "#aaffc3", text: "#21201e" },
  { background: "#808000", text: "#FEFEFE" },
  { background: "#ffd8b1", text: "#21201e" },
  { background: "#000075", text: "#FEFEFE" },
  { background: "#808080", text: "#FEFEFE" },
];

export const onMessageEvents = (
  message,
  events,
  setEvents,
  staffInfos,
  userId,
  isSecretary
) => {
  if (message.route !== "EVENTS") return;
  const remainingStaffObjects = staffInfos
    .filter(({ id }) => id !== userId)
    .map((staff, index) => {
      return {
        id: staff.id,
        color: colorsPalette[index % colorsPalette.length].background,
        textColor: colorsPalette[index % colorsPalette.length].text,
      };
    });

  switch (message.action) {
    case "create":
      const newEvent =
        message.content.data.host_id !== userId
          ? message.content.data.host_id === 0
            ? parseToEvent(
                message.content.data,
                "#bfbfbf",
                "#FEFEFE",
                isSecretary
              ) //grey
            : parseToEvent(
                message.content.data,
                remainingStaffObjects[
                  _.findIndex(remainingStaffObjects, {
                    id: message.content.data.host_id,
                  })
                ].color,
                remainingStaffObjects[
                  _.findIndex(remainingStaffObjects, {
                    id: message.content.data.host_id,
                  })
                ].textColor,
                isSecretary
              )
          : parseToEvent(
              message.content.data,
              "#6490D2",
              "#FEFEFE",
              isSecretary,
              userId
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
                "#FEFEFE",
                isSecretary
              ) //grey
            : parseToEvent(
                message.content.data,
                remainingStaffObjects[
                  _.findIndex(remainingStaffObjects, {
                    id: message.content.data.host_id,
                  })
                ].color,
                remainingStaffObjects[
                  _.findIndex(remainingStaffObjects, {
                    id: message.content.data.host_id,
                  })
                ].textColor,
                isSecretary
              )
          : parseToEvent(
              message.content.data,
              "#6490D2",
              "#FEFEFE",
              isSecretary,
              userId
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
