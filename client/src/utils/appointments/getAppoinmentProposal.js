import { DateTime } from "luxon";
import { AMPMto24 } from "../dates/formatDates";

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
  let startMorningMs = DateTime.fromMillis(rangeStart, {
    zone: "America/Toronto",
  })
    .plus({
      days: delta,
      hours: AMPMto24(
        parseInt(availabilityMorning[0].hours),
        availabilityMorning[0].ampm
      ),
      minutes: parseInt(availabilityMorning[0].min),
    })
    .toMillis();

  let endMorningMs = DateTime.fromMillis(rangeStart, {
    zone: "America/Toronto",
  })
    .plus({
      days: delta,
      hours: AMPMto24(
        parseInt(availabilityMorning[1].hours),
        availabilityMorning[1].ampm
      ),
      minutes: parseInt(availabilityMorning[1].min),
    })
    .toMillis();

  //Afternoon
  const availabilityAfternoon = availability.schedule_afternoon[day];
  let startAfternoonMs = DateTime.fromMillis(rangeStart, {
    zone: "America/Toronto",
  })
    .plus({
      days: delta,
      hours: AMPMto24(
        parseInt(availabilityAfternoon[0].hours),
        availabilityAfternoon[0].ampm
      ),
      minutes: parseInt(availabilityAfternoon[0].min),
    })
    .toMillis();

  let endAfternoonMs = DateTime.fromMillis(rangeStart, {
    zone: "America/Toronto",
  })
    .plus({
      days: delta,
      hours: AMPMto24(
        parseInt(availabilityAfternoon[1].hours),
        availabilityMorning[1].ampm
      ),
      minutes: parseInt(availabilityAfternoon[1].min),
    })
    .toMillis();

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
        startDate: DateTime.fromMillis(startAfternoonMs, {
          zone: "America/Toronto",
        }),
        end: startAfternoonMs + defaulDurationMs,
        reason: "Appointment",
        all_day: false,
      };
  } else {
    return {
      id: id,
      host_id: practicianSelectedId,
      start: startMorningMs,
      startDate: DateTime.fromMillis(startMorningMs, {
        zone: "America/Toronto",
      }),
      end: startMorningMs + defaulDurationMs,
      reason: "Appointment",
      all_day: false,
    };
  }
};
