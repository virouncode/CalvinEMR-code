import * as yup from "yup";

export const availabilitySchema = yup.object({
  default_duration_hours: yup
    .number()
    .required("Default Duration Hours field is required")
    .integer("Default Duration Hours field must be an integer"),
  default_duration_min: yup
    .number()
    .required("Default Duration Min field is required")
    .integer("Default Duration Min field must be an integer"),
});
