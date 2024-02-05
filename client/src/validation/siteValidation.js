import * as yup from "yup";

export const siteSchema = yup.object({
  name: yup.string().required("Site name field is required"),
  address: yup.string().required("Address field is required"),
  postal_code: yup.string().required("Postal code field is required"),
  province_state: yup.string().required("Province/state field is required"),
  city: yup.string().required("City field is required"),
  phone: yup
    .string()
    .required("Phone field is required")
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
});
