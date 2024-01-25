import * as yup from "yup";

export const careElementsSchema = yup.object({
  SmokingPacks: yup.object({
    PerDay: yup.string().matches(/^\d+([.,]\d{0,2})?$/, {
      message: "Invalid Smoking Packs value",
      excludeEmptyString: true,
    }),
  }),
  alcoholGlasses: yup.object({
    PerDay: yup.string().matches(/^\d+([.,]\d{0,2})?$/, {
      message: "Invalid Alcohol Glasses value",
      excludeEmptyString: true,
    }),
  }),
  Weight: yup.object({
    Weight: yup.string().matches(/^\d+([.,]\d{0,2})?$/, {
      message: "Invalid Weight value",
      excludeEmptyString: true,
    }),
  }),
  Height: yup.object({
    Height: yup.string().matches(/^\d+([.,]\d{0,2})?$/, {
      message: "Invalid Height value",
      excludeEmptyString: true,
    }),
  }),
  WaistCircumference: yup.object({
    WaistCircumference: yup.string().matches(/^\d+([.,]\d{0,2})?$/, {
      message: "Invalid Waist Circumference value",
      excludeEmptyString: true,
    }),
  }),
  BloodPressure: yup.object({
    SystolicBP: yup.string().matches(/^\d+([.,]\d{0,2})?$/, {
      message: "Invalid SystolicBP value",
      excludeEmptyString: true,
    }),
    DiastolicBP: yup.string().matches(/^\d+([.,]\d{0,2})?$/, {
      message: "Invalid DiastolicBP value",
      excludeEmptyString: true,
    }),
  }),
});
