import * as yup from "yup";

export const personalHistorySchema = yup.object({
  Occupations: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid occupations",
    excludeEmptyString: true,
  }),
  Religion: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid religion",
    excludeEmptyString: true,
  }),
  SexualOrientation: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid sexual orientation",
    excludeEmptyString: true,
  }),
});
