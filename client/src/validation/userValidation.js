import * as yup from "yup";

export const userSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email field is required"),
  password: yup.string().required("Password field is required"),
  type: yup.string(),
});
