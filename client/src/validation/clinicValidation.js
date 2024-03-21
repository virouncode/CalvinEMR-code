import * as yup from "yup";

export const clinicSchema = yup.object({
  name: yup.string().required("Name field is required"),
  website: yup.string().required("Website field is required"),
  email: yup
    .string()
    .email("Invalid Email field")
    .required("Email fieldis required"),
});
