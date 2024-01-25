import { rooms } from "./rooms";
var _ = require("lodash");

const colorsPalette = [
  { background: "#ffe119", text: "#495566" },
  { background: "#e6194b", text: "#FEFEFE" },
  { background: "#3cb44b", text: "#FEFEFE" },
  { background: "#f58231", text: "#FEFEFE" },
  { background: "#911eb4", text: "#FEFEFE" },
  { background: "#42d4f4", text: "#495566" },
  { background: "#f032e6", text: "#FEFEFE" },
  { background: "#bfef45", text: "#495566" },
  { background: "#fabed4", text: "#495566" },
  { background: "#469990", text: "#FEFEFE" },
  { background: "#dcbeff", text: "#495566" },
  { background: "#9a6324", text: "#FEFEFE" },
  { background: "#fffac8", text: "#495566" },
  { background: "#800000", text: "#FEFEFE" },
  { background: "#aaffc3", text: "#495566" },
  { background: "#808000", text: "#FEFEFE" },
  { background: "#ffd8b1", text: "#495566" },
  { background: "#000075", text: "#FEFEFE" },
  { background: "#808080", text: "#FEFEFE" },
];

export const parseToEvents = (
  appointments,
  staffInfos,
  isSecretary,
  userId
) => {
  //give a color to each remaining member of the staff
  const remainingStaffObjects = staffInfos
    .filter(({ id }) => id !== userId)
    .map((staff, index) => {
      return {
        id: staff.id,
        color: colorsPalette[index % colorsPalette.length].background,
        textColor: colorsPalette[index % colorsPalette.length].text,
      };
    });
  return [
    appointments.map(
      (appointment) =>
        appointment.host_id !== userId
          ? appointment.host_id === 0
            ? parseToEvent(appointment, "#bfbfbf", "#FEFEFE", isSecretary) //grey
            : parseToEvent(
                appointment,
                remainingStaffObjects[
                  _.findIndex(remainingStaffObjects, {
                    id: appointment.host_id,
                  })
                ].color,
                remainingStaffObjects[
                  _.findIndex(remainingStaffObjects, {
                    id: appointment.host_id,
                  })
                ].textColor,
                isSecretary
              )
          : parseToEvent(appointment, "#6490D2", "#FEFEFE", isSecretary, userId) //blue
    ),
    remainingStaffObjects,
  ];
};

export const parseToEvent = (
  appointment,
  color,
  textColor,
  isSecretary,
  userId
) => {
  return {
    id: appointment.id.toString(),
    start: new Date(appointment.start),
    end: new Date(appointment.end),
    color: color,
    textColor: textColor,
    display: "block",
    allDay: appointment.all_day,
    editable: appointment.host_id === userId || isSecretary ? true : false, //if secretary give access
    resourceEditable:
      appointment.host_id === userId || isSecretary ? true : false, //if secretary give access
    resourceId: rooms[_.findIndex(rooms, { title: appointment.room })].id,
    extendedProps: {
      host: appointment.host_id,
      duration: appointment.Duration,
      purpose: appointment.AppointmentPurpose,
      status: appointment.AppointmentStatus,
      staffGuestsIds: appointment.staff_guests_ids,
      patientsGuestsIds: appointment.patients_guests_ids,
      room: appointment.room,
      updates: appointment.updates,
      date_created: appointment.date_created,
      created_by_id: appointment.created_by_id,
      notes: appointment.AppointmentNotes,
    },
  };
};
