import * as yup from "yup";

export const edocSchema = yup.object({
  name: yup.string().required("Name field is required"),
});
