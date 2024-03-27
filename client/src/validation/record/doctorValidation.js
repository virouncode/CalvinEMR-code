import * as yup from "yup";

export const doctorSchema = yup.object({
  firstName: yup.string().required("First name field is required"),
  lastName: yup.string().required("Last name field is required"),
  line1: yup.string().required("Address field is required"),
  city: yup.string().required("City field is required"),
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
  province: yup.string().required("Province/state field is required"),
  phone: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Phone number", excludeEmptyString: true }
    ),
  fax: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Fax number", excludeEmptyString: true }
    ),
  email: yup.string().email("Invalid Email"),
});
