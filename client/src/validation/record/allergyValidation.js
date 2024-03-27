import * as yup from "yup";

export const allergySchema = yup.object({
  OffendingAgentDescription: yup
    .string()
    .required("Offending agent field is required"),
  LifeStage: yup.string().required("Life Stage field is required"),
});
