import * as yup from "yup";

export const pharmacySchema = yup.object({
  Name: yup.string().required("Pharmacy name field is required"),
  Address: yup.object({
    Structured: yup.object({
      Line1: yup.string().required("Address field is required"),
      City: yup.string().required("City field is required"),
      PostalZipCode: yup.object({
        PostalCode: yup
          .string()
          .matches(/^[a-zA-Z][0-9][a-zA-Z][\ \-]{0,1}[0-9][a-zA-Z][0-9]$/, {
            message: "Invalid Postal Code",
            excludeEmptyString: true,
          }),
        ZipCode: yup.string().matches(/^[0-9]{5}(?:-[0-9]{4})?$/, {
          message: "Invalid Zip Code",
          excludeEmptyString: true,
        }),
      }),
      CountrySubDivisionCode: yup
        .string()
        .required("Province/State field is required"),
    }),
  }),
  PhoneNumber: yup.array().of(
    yup.object({
      phoneNumber: yup
        .string()
        .matches(
          /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
          { message: "Invalid Phone number", excludeEmptyString: true }
        ),
    })
  ),
  FaxNumber: yup.object({
    phoneNumber: yup
      .string()
      .matches(
        /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
        { message: "Invalid Fax number", excludeEmptyString: true }
      ),
  }),
  EmailAddress: yup.string().email("Invalid Pharmacy email"),
});
