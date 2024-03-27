import * as yup from "yup";

export const personalHistorySchema = yup.object({
  occupations: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid occupations",
    excludeEmptyString: true,
  }),
  religion: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid religion",
    excludeEmptyString: true,
  }),
  sexual_orientation: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid sexual orientation",
    excludeEmptyString: true,
  }),
});
