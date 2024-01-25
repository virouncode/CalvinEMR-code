import * as yup from "yup";

export const problemListSchema = yup.object({
  ProblemDiagnosisDescription: yup
    .string()
    .required("Diagnosis Description field is required"),
  ProblemDescription: yup
    .string()
    .required("Problem Description field is required"),
  LifeStage: yup.string().required("Life stage field is required"),
});
