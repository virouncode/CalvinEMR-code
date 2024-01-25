import * as yup from "yup";

export const measurementSchema = yup.object({
  height_cm: yup
    .number()
    .min(0, "Invalid Height cm field (must be a positive number)"),
  height_feet: yup
    .number()
    .min(0, "Invalid Height feet field (must be a positive number)"),
  weight_kg: yup
    .number()
    .min(0, "Invalid Weight kg field (must be a positive number)"),
  weight_lbs: yup
    .number()
    .min(0, "Invalid Weight lbs field (must be a positive number)"),
  waist_circumference: yup
    .number()
    .min(0, "Invalid waist circumference field (must be a positive number)"),
  blood_pressure_systolic: yup
    .number()
    .min(
      0,
      "Invalid blood pressure systolic field (must be a positive number)"
    ),
  blood_pressure_diastolic: yup
    .number()
    .min(
      0,
      "Invalid blood pressure diastolic field (must be a positive number)"
    ),
});
