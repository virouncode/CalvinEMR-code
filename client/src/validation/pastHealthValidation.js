import * as yup from "yup";

export const pastHealthSchema = yup.object({
  PastHealthProblemDescriptionOrProcedures: yup
    .string()
    .required("Description/Procedure field is required"),
  LifeStage: yup.string().required("Life stage field is required"),
});
