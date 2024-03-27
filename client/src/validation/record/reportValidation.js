import * as yup from "yup";

export const reportSchema = yup.object({
  name: yup.string().required("Report name field is required"),
  Format: yup.string().required("Format field is required"),
  Class: yup.string().required("Class field is required"),
  SourceAuthorPhysician: yup.object({
    AuthorFreeText: yup.string().matches(/^([^0-9]*)$/, {
      message: "Invalid Author Name",
      excludeEmptyString: true,
    }),
    AuthorName: yup.object({
      FirstName: yup.string().matches(/^([^0-9]*)$/, {
        message: "Invalid Author First Name",
        excludeEmptyString: true,
      }),
      LastName: yup.string().matches(/^([^0-9]*)$/, {
        message: "Invalid Author Last Name",
        excludeEmptyString: true,
      }),
    }),
  }),
  // ReportReviewed: yup.array().of(
  //   yup.object({
  //     Name: yup.object({
  //       FirstName: yup.string().matches(/^([^0-9]*)$/, {
  //         message: "Invalid Author First Name",
  //         excludeEmptyString: true,
  //       }),
  //       LastName: yup.string().matches(/^([^0-9]*)$/, {
  //         message: "Invalid Author Last Name",
  //         excludeEmptyString: true,
  //       }),
  //     }),
  //     ReviewingOHIPPhysicianId: yup
  //       .string()
  //       .test(
  //         "empty-or-6-chars",
  //         "Invalid Primary Physician OHIP#, should be 6-digits",
  //         (ohip) => !ohip || ohip.length === 6
  //       ),
  //   })
  // ),
  patient_id: yup.number().required("Please choose a related patient"),
  RecipientName: yup.object({
    FirstName: yup.string().matches(/^([^0-9]*)$/, {
      message: "Invalid Author First Name",
      excludeEmptyString: true,
    }),
    LastName: yup.string().matches(/^([^0-9]*)$/, {
      message: "Invalid Author Last Name",
      excludeEmptyString: true,
    }),
  }),
});
