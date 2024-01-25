import * as yup from "yup";

export const linkSchema = yup.object({
  name: yup.string().required("Name field is required"),
  url: yup.string().required("URL field is required"),
  // .matches(
  //   /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
  //   {
  //     message: "Invalid URL (your URL must start with http or https",
  //     excludeEmptyString: true,
  //   }
  // ),
});
