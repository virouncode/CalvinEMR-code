import * as yup from "yup";

export const pastHealthSchema = yup.object({
  PastHealthProblemDescriptionOrProcedures: yup
    .string()
    .required("Description/Procedure field is required"),
  // OnsetOrEventDate: yup.number().required("Onset date field is required"),
  LifeStage: yup.string().required("Life stage field is required"),
  // ProcedureDate: yup.number().required("Procedure date field is required"),
});
