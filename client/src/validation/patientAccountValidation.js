import * as yup from "yup";

export const patientAccountSchema = yup.object({
  cell_phone: yup
    .string()
    .required("Cell Phone field is required")
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Cell Phone number", excludeEmptyString: true }
    ),
  home_phone: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Home Phone number", excludeEmptyString: true }
    ),
  preferred_phone: yup
    .string()
    .required("Preferred Phone field is required")
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Preferred Phone number", excludeEmptyString: true }
    ),
  address: yup.string().required("Address field is required"),
  postal_code: yup.string().required("Postal Code field is required"),
  city: yup.string().required("City field is required"),
});
