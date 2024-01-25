import * as yup from "yup";

export const patientSchema = yup.object({
  Names: yup.object({
    LegalName: yup.object({
      FirstName: yup.object({
        Part: yup
          .string()
          .required("First Name field is required")
          .matches(/^([^0-9]*)$/, {
            message: "Invalid First Name",
            excludeEmptyString: true,
          }),
      }),
      OtherName: yup.object({
        Part: yup.string().matches(/^([^0-9]*)$/, {
          message: "Invalid Middle Name",
          excludeEmptyString: true,
        }),
      }),
      LastName: yup.object({
        Part: yup
          .string()
          .required("Last Name field is required")
          .matches(/^([^0-9]*)$/, {
            message: "Invalid Last Name",
            excludeEmptyString: true,
          }),
      }),
    }),
  }),
  DateOfBirth: yup
    .number("Invalid Date of Birth")
    .required("Date of birth field is required"),
  HealthCard: yup.object({
    Number: yup.string().max(20, "Invalid Health Card#, too long"),
    Version: yup.string().max(2, "Invalid Health Card Version, too long"),
  }),
  SIN: yup
    .string()
    .test(
      "empty-or-9-chars",
      "Invalid SIN, should be 9-digits",
      (sin) => !sin || sin.length === 9
    ),
  PhoneNumber: yup.array().of(
    yup.object({
      phoneNumber: yup
        .string()
        .matches(
          /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
          { message: "Invalid Phone number", excludeEmptyString: true }
        ),
    })
  ),
  Address: yup.array().of(
    yup.object({
      Structured: yup.object({
        Line1: yup.string().required("Address field is required"),
        City: yup.string().required("City field is required"),
        PostalZipCode: yup.object({
          PostalCode: yup
            .string()
            .matches(/^[a-zA-Z][0-9][a-zA-Z][\ \-]{0,1}[0-9][a-zA-Z][0-9]$/, {
              message: "Invalid Postal Code",
              excludeEmptyString: true,
            }),
          ZipCode: yup.string().matches(/^[0-9]{5}(?:-[0-9]{4})?$/, {
            message: "Invalid Zip Code",
            excludeEmptyString: true,
          }),
        }),
      }),
    })
  ),
});
