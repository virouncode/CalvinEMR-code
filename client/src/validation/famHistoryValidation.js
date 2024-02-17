import * as yup from "yup";

export const famHistorySchema = yup.object({
  ProblemDiagnosisProcedureDescription: yup
    .string()
    .required("Event description field is required"),
  Relationship: yup.string().required("Relative affected field is required"),
  LifeStage: yup.string().required("Life stage field is required"),
});
