import * as yup from "yup";

export const medTemplateSchema = yup.object({
  DrugName: yup.string().required("Drug name field is required"),
  Strength: yup.object({
    Amount: yup.string().required("Strength field is required"),
    UnitOfMeasure: yup
      .string()
      .required("Strength unit of measure field is required"),
  }),
  Dosage: yup.string().required("Dosage field is required"),
  DosageUnitOfMeasure: yup
    .string()
    .required("Dosage unit of measure field is required"),
  Form: yup.string().required("Form field is required"),
  Route: yup.string().required("Route field is required"),
  Frequency: yup.string().required("Frequency field is required"),
  Duration: yup.string().required("Duration field is required"),
  LongTermMedication: yup.object({
    ynIndicatorsimple: yup
      .string()
      .required("Long-term medication field is required"),
  }),
  SubstitutionNotAllowed: yup
    .string()
    .required("Substitution not allowed field is required"),
  PrescriptionInstructions: yup
    .string()
    .required("Instructions field is required"),
});
