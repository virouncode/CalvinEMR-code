export const enrolmentCaption = (lastEnrolment) => {
  const firstName = lastEnrolment?.EnrolledToPhysician?.Name?.FirstName
    ? `${lastEnrolment?.EnrolledToPhysician?.Name?.FirstName}`
    : "";
  const lastName = lastEnrolment?.EnrolledToPhysician?.Name?.LastName
    ? ` ${lastEnrolment?.EnrolledToPhysician?.Name?.LastName}`
    : "";
  const ohip = lastEnrolment?.EnrolledToPhysician?.OHIPPhysicianId
    ? `, ${lastEnrolment?.EnrolledToPhysician?.OHIPPhysicianId}`
    : "";
  const active = lastEnrolment?.EnrollmentTerminationDate
    ? `, Inactive`
    : firstName
    ? `, Active`
    : "";

  return firstName + lastName + ohip + active;
};
