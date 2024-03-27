import * as yup from "yup";

export const patientSchema = yup.object({
  email: yup
    .string()
    .email("Invalid Email")
    .required("Email field is required"),
  firstName: yup
    .string()
    .required("First Name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid First Name",
      excludeEmptyString: true,
    }),
  middleName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Middle Name",
    excludeEmptyString: true,
  }),
  lastName: yup
    .string()
    .required("Last Name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid Last Name",
      excludeEmptyString: true,
    }),
  dob: yup.string().required("Date of birth field is required"),
  sin: yup
    .string()
    .test(
      "empty-or-9-chars",
      "Invalid SIN, should be 9-digits",
      (sin) => !sin || sin.length === 9
    ),
  assignedMd: yup
    .string()
    .required("Assigned clinic practitioner field is required"),
  gender: yup.string().required("Gender field is required"),
  cellphone: yup
    .string()
    .required("Cellphone field is required")
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Cell Phone number", excludeEmptyString: true }
    ),
  homephone: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Home Phone number", excludeEmptyString: true }
    ),
  workphone: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Work Phone number", excludeEmptyString: true }
    ),
  line1: yup.string().required("Address field is required"),
  postalCode: yup
    .string()
    .matches(/^[a-zA-Z][0-9][a-zA-Z][\ \-]{0,1}[0-9][a-zA-Z][0-9]$/, {
      message: "Invalid Postal Code",
      excludeEmptyString: true,
    }),
  zipCode: yup.string().matches(/^[0-9]{5}(?:-[0-9]{4})?$/, {
    message: "Invalid Zip Code",
    excludeEmptyString: true,
  }),
  city: yup.string().required("City field is required"),
});
