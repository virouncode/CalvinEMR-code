import * as yup from "yup";

export const appointmentSchema = yup.object({
  AppointmentPurpose: yup.string().required("Reason field is required"),
  start: yup.number().required("From field is required"),
  end: yup.number().required("From field is required"),
});
