import { AMPMto24 } from "./formatDates";

export const getAppointmentProposal = (
  availability,
  appointmentsInRange,
  day,
  delta,
  defaulDurationMs,
  practicianSelectedId,
  rangeStart,
  id
) => {
  //Morning
  const availabilityMorning = availability.schedule_morning[day];
  const startMorning = new Date(rangeStart);
  startMorning.setDate(startMorning.getDate() + delta);
  startMorning.setHours(
    AMPMto24(
      parseInt(availabilityMorning[0].hours),
      availabilityMorning[0].ampm
    ),
    parseInt(availabilityMorning[0].min),
    0
  );
  let startMorningMs = Date.parse(startMorning);

  const endMorning = new Date(rangeStart);
  endMorning.setDate(endMorning.getDate() + delta);
  endMorning.setHours(
    AMPMto24(
      parseInt(availabilityMorning[1].hours),
      availabilityMorning[1].ampm
    ),
    parseInt(availabilityMorning[1].min),
    0
  );
  const endMorningMs = Date.parse(endMorning);

  //Afternoon
  const availabilityAfternoon = availability.schedule_afternoon[day];
  const startAfternoon = new Date(rangeStart);
  startAfternoon.setDate(startAfternoon.getDate() + delta);
  startAfternoon.setHours(
    AMPMto24(
      parseInt(availabilityAfternoon[0].hours),
      availabilityAfternoon[0].ampm
    ),
    parseInt(availabilityAfternoon[0].min),
    0
  );
  let startAfternoonMs = Date.parse(startAfternoon);

  const endAfternoon = new Date(rangeStart);
  endAfternoon.setDate(endAfternoon.getDate() + delta);
  endAfternoon.setHours(
    AMPMto24(
      parseInt(availabilityAfternoon[1].hours),
      availabilityAfternoon[1].ampm
    ),
    parseInt(availabilityAfternoon[1].min),
    0
  );
  const endAfternoonMs = Date.parse(endAfternoon);

  while (
    appointmentsInRange
      .filter(
        // eslint-disable-next-line no-loop-func
        (appointment) =>
          (appointment.start >= startMorningMs &&
            appointment.start < startMorningMs + defaulDurationMs) ||
          (appointment.end > startMorningMs &&
            appointment.end <= startMorningMs + defaulDurationMs) ||
          (appointment.start <= startMorningMs &&
            appointment.end >= startMorningMs + defaulDurationMs)
      )
      .sort((a, b) => b.end - a.end).length
  ) {
    startMorningMs = appointmentsInRange
      .filter(
        // eslint-disable-next-line no-loop-func
        (appointment) =>
          (appointment.start >= startMorningMs &&
            appointment.start < startMorningMs + defaulDurationMs) ||
          (appointment.end > startMorningMs &&
            appointment.end <= startMorningMs + defaulDurationMs) ||
          (appointment.start <= startMorningMs &&
            appointment.end >= startMorningMs + defaulDurationMs)
      )
      .sort((a, b) => b.end - a.end)[0].end;
  }
  if (startMorningMs + defaulDurationMs > endMorningMs) {
    while (
      appointmentsInRange
        .filter(
          // eslint-disable-next-line no-loop-func
          (appointment) =>
            (appointment.start >= startAfternoonMs &&
              appointment.start < startAfternoonMs + defaulDurationMs) ||
            (appointment.end > startAfternoonMs &&
              appointment.end <= startAfternoonMs + defaulDurationMs) ||
            (appointment.start <= startAfternoonMs &&
              appointment.end >= startAfternoonMs + defaulDurationMs)
        )
        .sort((a, b) => b.end - a.end).length
    ) {
      startAfternoonMs = appointmentsInRange
        .filter(
          // eslint-disable-next-line no-loop-func
          (appointment) =>
            (appointment.start >= startAfternoonMs &&
              appointment.start < startAfternoonMs + defaulDurationMs) ||
            (appointment.end > startAfternoonMs &&
              appointment.end <= startAfternoonMs + defaulDurationMs) ||
            (appointment.start <= startAfternoonMs &&
              appointment.end >= startAfternoonMs + defaulDurationMs)
        )
        .sort((a, b) => b.end - a.end)[0].end;
    }
    if (startAfternoonMs + defaulDurationMs > endAfternoonMs) {
      return null;
    } else
      return {
        id: id,
        host_id: practicianSelectedId,
        start: startAfternoonMs,
        startDate: new Date(startAfternoonMs),
        end: startAfternoonMs + defaulDurationMs,
        reason: "Appointment",
        all_day: false,
      };
  } else {
    return {
      id: id,
      host_id: practicianSelectedId,
      start: startMorningMs,
      startDate: new Date(startMorningMs),
      end: startMorningMs + defaulDurationMs,
      reason: "Appointment",
      all_day: false,
    };
  }
};
