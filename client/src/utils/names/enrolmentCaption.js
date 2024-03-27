import {
  terminationReasonCT,
  toCodeTableName,
} from "../../omdDatas/codesTables";
import { timestampToDateISOTZ } from "../dates/formatDates";

export const enrolmentCaption = (lastEnrolment) => {
  const firstName = lastEnrolment?.EnrolledToPhysician?.Name?.FirstName
    ? `${lastEnrolment?.EnrolledToPhysician?.Name?.FirstName}`
    : "";
  const lastName = lastEnrolment?.EnrolledToPhysician?.Name?.LastName
    ? ` ${lastEnrolment?.EnrolledToPhysician?.Name?.LastName}`
    : "";
  const ohip = lastEnrolment?.EnrolledToPhysician?.OHIPPhysicianId
    ? `, OHIP#: ${lastEnrolment?.EnrolledToPhysician?.OHIPPhysicianId}`
    : "";
  const active = lastEnrolment?.EnrollmentTerminationDate
    ? `, Inactive`
    : firstName
    ? `, Active`
    : "";

  return firstName + lastName + ohip + active;
};

export const enrolmentCaptionComplete = (enrolment) => {
  const firstName = enrolment?.EnrolledToPhysician?.Name?.FirstName
    ? `Enroled to ${enrolment?.EnrolledToPhysician?.Name?.FirstName}`
    : "";
  const lastName = enrolment?.EnrolledToPhysician?.Name?.LastName
    ? ` ${enrolment?.EnrolledToPhysician?.Name?.LastName}`
    : "";
  const ohip = enrolment?.EnrolledToPhysician?.OHIPPhysicianId
    ? `, OHIP#: ${enrolment?.EnrolledToPhysician?.OHIPPhysicianId}`
    : "";
  const start = enrolment?.EnrollmentDate
    ? `, since ${timestampToDateISOTZ(enrolment?.EnrollmentDate)}.`
    : "";
  const end = enrolment?.EnrollmentTerminationDate
    ? `Ended on ${timestampToDateISOTZ(enrolment?.EnrollmentTerminationDate)}`
    : "";
  const reason = enrolment?.TerminationReason
    ? `, because of: ${toCodeTableName(
        terminationReasonCT,
        enrolment?.TerminationReason
      )}`
    : "";

  return firstName + lastName + ohip + start + " " + end + reason;
};
