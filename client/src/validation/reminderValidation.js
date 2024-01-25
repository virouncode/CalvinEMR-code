import * as yup from "yup";

export const reminderSchema = yup.object({
  reminder: yup.string().required("Reminder field is required"),
});
