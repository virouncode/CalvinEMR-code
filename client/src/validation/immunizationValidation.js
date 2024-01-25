import * as yup from "yup";

export const immunizationSchema = yup.object({
  ImmunizationName: yup
    .string()
    .required("Immunization brand name field is required"),
  Date: yup.number().required("Date field is required"),
});
