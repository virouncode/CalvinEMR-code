import * as yup from "yup";

export const clinicalNoteSchema = yup.object({
  subject: yup.string().required("Subject field is required"),
  MyClinicalNotesContent: yup
    .string()
    .required("Your clinical note is empty, please write something"),
});
