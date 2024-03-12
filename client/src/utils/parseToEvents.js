import { staffIdToTitleAndName } from "./staffIdToTitleAndName";
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

export const parseToEvents = (
  appointments,
  staffInfos,
  sites,
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
            ? parseToEvent(
                appointment,
                "#bfbfbf",
                "#3D375A",
                isSecretary,
                userId,
                sites?.find(({ id }) => id === appointment.site_id)?.rooms,
                staffInfos
              ) //grey
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
                isSecretary,
                userId,
                sites?.find(({ id }) => id === appointment.site_id)?.rooms,
                staffInfos
              )
          : parseToEvent(
              appointment,
              "#93B5E9",
              "#3D375A",
              isSecretary,
              userId,
              sites?.find(({ id }) => id === appointment.site_id)?.rooms,
              staffInfos
            ) //blue
    ),
    remainingStaffObjects,
  ];
};

export const parseToEvent = (
  appointment,
  color,
  textColor,
  isSecretary,
  userId,
  rooms,
  staffInfos
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
    resourceId: rooms?.find(({ id }) => id === appointment.room_id).id,
    extendedProps: {
      host: appointment.host_id,
      hostName: appointment.host_infos
        ? staffIdToTitleAndName(staffInfos, appointment.host_infos.id)
        : "",
      hostFirstName: appointment.host_infos
        ? appointment.host_infos.first_name
        : "",
      hostLastName: appointment.host_infos
        ? appointment.host_infos.last_name
        : "",
      hostOHIP: appointment.host_infos
        ? appointment.host_infos.ohip_billing_nbr
        : "",
      duration: appointment.Duration,
      purpose: appointment.AppointmentPurpose,
      status: appointment.AppointmentStatus,
      staffGuestsIds: appointment.staff_guests_ids,
      patientsGuestsIds: appointment.patients_guests_ids,
      siteId: appointment.site_id,
      siteName: appointment.site_infos.name,
      roomId: appointment.room_id,
      roomTitle: appointment.site_infos.rooms.find(
        ({ id }) => id === appointment.room_id
      ).title,
      updates: appointment.updates,
      date_created: appointment.date_created,
      created_by_id: appointment.created_by_id,
      notes: appointment.AppointmentNotes,
    },
  };
};
