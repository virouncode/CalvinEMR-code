import * as yup from "yup";

export const demographicsSchema = yup.object({
  firstName: yup
    .string()
    .required("First name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid First name",
      excludeEmptyString: true,
    }),
  middleName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Middle name",
    excludeEmptyString: true,
  }),
  lastName: yup
    .string()
    .required("Last name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid Last name",
      excludeEmptyString: true,
    }),
  nickName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Nickname",
    excludeEmptyString: true,
  }),
  dob: yup.string().required("Date of birth field is required"),
  healthNbr: yup.string().max(20, "Invalid Health Card#"),
  healthVersion: yup.string().max(2, "Invalid Health Card Version"),
  healthExpiry: yup.string(),
  gender: yup.string().required("Gender field is required"),
  sin: yup
    .string()
    .test(
      "empty-or-9-chars",
      "Invalid SIN, should be 9-digits",
      (sin) => !sin || sin.length === 9
    ),
  email: yup
    .string()
    .required("Email field is required")
    .email("Invalid Email"),
  cellphone: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Phone number", excludeEmptyString: true }
    ),
  homephone: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Phone number", excludeEmptyString: true }
    ),
  workphone: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Phone number", excludeEmptyString: true }
    ),
  line1: yup.string().required("Address field is required"),
  city: yup.string().required("City field is required"),
  postalCode: yup
    .string()
    .matches(/^[a-zA-Z][0-9][a-zA-Z][\ \-]{0,1}[0-9][a-zA-Z][0-9]$/, {
      message: "Invalid Postal Code",
      excludeEmptyString: true,
    }),
  zipCode: yup.string().matches(/^\d{5}(?:[-\s]\d{4})?$/, {
    message: "Invalid Zip Code",
    excludeEmptyString: true,
  }),
  province: yup.string().required("Province/State field is required"),
  preferredOff: yup
    .string()
    .required("Preferred official language field is required"),
  status: yup.string().required("Person status field is required"),
  assignedMd: yup
    .string()
    .required("Assigned clinic physician field is required"),
  pPhysicianFirstName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Primary physician first name",
    excludeEmptyString: true,
  }),
  pPhysicianLastName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Primary physician last name",
    excludeEmptyString: true,
  }),
  pPhysicianOHIP: yup.string(),
  pPhysicianCPSO: yup.string(),
  rPhysicianFirstName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Referred physician first name",
    excludeEmptyString: true,
  }),
  rPhysicianLastName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Referred physician last name",
    excludeEmptyString: true,
  }),
  fPhysicianFirstName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Family physician first name",
    excludeEmptyString: true,
  }),
  fPhysicianLastName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Family physician last name",
    excludeEmptyString: true,
  }),
  emergencyFirstName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Emergency contact first name",
    excludeEmptyString: true,
  }),
  emergencyMiddleName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Emergency contact middle name",
    excludeEmptyString: true,
  }),
  emergencyLastName: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Emergency contact last name",
    excludeEmptyString: true,
  }),
  emergencyEmail: yup.string().email("Invalid Emergency contact email"),
});
