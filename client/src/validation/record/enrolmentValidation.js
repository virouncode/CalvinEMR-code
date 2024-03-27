import * as yup from "yup";

export const enrolmentSchema = yup.object({
  EnrolledToPhysician: yup.object({
    Name: yup.object({
      FirstName: yup
        .string()
        .required("Physician first name required")
        .matches(/^([^0-9]*)$/, {
          message: "Invalid Enrolled to physician First Name",
          excludeEmptyString: true,
        }),
      LastName: yup
        .string()
        .required("Physician last name required")
        .matches(/^([^0-9]*)$/, {
          message: "Invalid Enrolled to physician Last Name",
          excludeEmptyString: true,
        }),
    }),
    OHIPPhysicianId: yup.string(),
  }),
  EnrollmentStatus: yup.string().required("Enrolment status field is required"),
  EnrollmentDate: yup
    .number("Invalid enrolment date")
    .required("Enrolment date field is required"),
});
