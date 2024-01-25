import * as yup from "yup";

export const riskSchema = yup.object({
  RiskFactor: yup.string().required("Risk factor field is required"),
});
