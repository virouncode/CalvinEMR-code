import * as yup from "yup";

export const pregnancySchema = yup.object({
  description: yup.string().required("Description field is required"),
  date_of_event: yup
    .number("Invalid Date of event")
    .required("Date of event field is required"),
  premises: yup.string(),
  term_nbr_of_weeks: yup
    .number()
    .integer()
    .min(0, "Invalid term number of weeks field"),
  term_nbr_of_days: yup
    .number()
    .integer()
    .min(0, "Invalid term number of days field"),
});
