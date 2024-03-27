import * as yup from "yup";

export const alertSchema = yup.object({
  AlertDescription: yup.string().required("Description field is required"),
});
