import * as yup from "yup";

export const medicationSchema = yup.object({
  // PrescriptionWrittenDate: yup
  //   .number()
  //   .required("Prescription written date field is required"),
  // StartDate: yup.number().required("Start date field is required"),
  DrugName: yup.string().required("Drug name field is required"),
  // Strength: yup.object({
  //   Amount: yup.string().matches(/^[0-9]+$/, {
  //     message: "Invalid Strength Amount field",
  //     excludeEmptyString: true,
  //   }),
  // }),
  // NumberOfRefills: yup.string().matches(/^[0-9]+$/, {
  //   message: "Invalid Number of refills field",
  //   excludeEmptyString: true,
  // }),
  Dosage: yup
    .string()
    .required("Dosage field is required")
    .matches(/^[0-9]+$/, {
      message: "Invalid Dosage field",
      excludeEmptyString: true,
    }),
  DosageUnitOfMeasure: yup.string().required("Dosage unit field is required"),
  // Duration: yup.string().matches(/^[0-9]+$/, {
  //   message: "Invalid Duration field",
  //   excludeEmptyString: true,
  // }),
  // RefillDuration: yup.string().matches(/^[0-9]+$/, {
  //   message: "Invalid Refill Duration field",
  //   excludeEmptyString: true,
  // }),
  PrescribedBy: yup.object({
    Name: yup.object({
      FirstName: yup.string().matches(/^([^0-9]*)$/, {
        message: "Invalid First Name",
        excludeEmptyString: true,
      }),
      LastName: yup.string().matches(/^([^0-9]*)$/, {
        message: "Invalid Last Name",
        excludeEmptyString: true,
      }),
    }),
  }),
  // DispenseInterval: yup.string().matches(/^[0-9]+$/, {
  //   message: "Invalid Dispense interval field",
  //   excludeEmptyString: true,
  // }),
});
