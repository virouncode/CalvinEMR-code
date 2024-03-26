import * as yup from "yup";

export const myAccountAdminSchema = yup.object({
  first_name: yup
    .string()
    .required("First Name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid First Name",
      excludeEmptyString: true,
    }),
  last_name: yup
    .string()
    .required("Last Name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid Last Name",
      excludeEmptyString: true,
    }),
});
