import { nowTZ } from "../dates/formatDates";
import { getAppointmentProposal } from "./getAppoinmentProposal";

export const getAvailableAppointments = (
  availability,
  appointmentsInRange,
  practicianSelectedId,
  rangeStart
) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const defaulDurationMs =
    availability.default_duration_hours * 3600000 +
    availability.default_duration_min * 60000;

  const now = nowTZ();
  const today = now.weekday - 1; //0 is Monday, 6 is Sunday (cf Luxon)
  let proposals = [];
  let tomorrow = (today + 1) % 7; //On commence à regarder à partir de demain
  let counter = 0;

  let newDay = tomorrow;

  while (counter < 7) {
    //On boucle sur une semaine
    while (availability.unavailability[days[newDay]] === true) {
      //on incrémente newDay jusqu'à ce que le practicien soit dispo
      newDay = (newDay + 1) % 7;
      counter++;
    }
    const deltaNewDay =
      newDay - tomorrow >= 0 ? newDay - tomorrow : 7 + (newDay - tomorrow);

    const appointmentProposal = getAppointmentProposal(
      availability,
      appointmentsInRange,
      days[newDay],
      deltaNewDay,
      defaulDurationMs,
      practicianSelectedId,
      rangeStart,
      newDay
    );
    if (appointmentProposal) proposals.push(appointmentProposal);
    newDay = (newDay + 1) % 7; //On incrémente
    counter++;
  }

  // if (availability.unavailability[days[newDay]] === true) {
  //   while (newDay !== today) {
  //     while (availability.unavailability[days[newDay]] === true) {
  //       newDay = (newDay + 1) % 7;
  //     }
  //     console.log("newDayAvailable", typeof newDay, newDay);

  //     const deltaNewDay =
  //       newDay - today > 0 ? newDay - today : 7 + (newDay - today);
  //     const appointmentProposal = getAppointmentProposal(
  //       availability,
  //       appointmentsInRange,
  //       days[newDay],
  //       deltaNewDay,
  //       defaulDurationMs,
  //       practicianSelectedId,
  //       rangeStart,
  //       newDay
  //     );
  //     if (appointmentProposal) proposals.push(appointmentProposal);
  //     newDay = (newDay + 1) % 7;
  //     console.log(newDay);
  //   }
  // }

  // if (availability.unavailability[days[newDay]] === false) {
  //   const deltaNewDay =
  //     newDay - today > 0 ? newDay - today : 7 + (newDay - today);
  //   const appointmentProposal = getAppointmentProposal(
  //     availability,
  //     appointmentsInRange,
  //     days[newDay],
  //     deltaNewDay,
  //     defaulDurationMs,
  //     practicianSelectedId,
  //     rangeStart,
  //     newDay
  //   );

  //   if (appointmentProposal) proposals.push(appointmentProposal);
  // }
  return proposals;
};
