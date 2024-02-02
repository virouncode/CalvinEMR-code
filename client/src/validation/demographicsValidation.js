import * as yup from "yup";

export const demographicsSchema = yup.object({
  Names: yup.object({
    LegalName: yup.object({
      FirstName: yup.object({
        Part: yup
          .string()
          .required("First Name field is required")
          .matches(/^([^0-9]*)$/, {
            message: "Invalid First Name",
            excludeEmptyString: true,
          }),
      }),
      OtherName: yup.array().of(
        yup.object({
          Part: yup.string().matches(/^([^0-9]*)$/, {
            message: "Invalid Middle Name",
            excludeEmptyString: true,
          }),
        })
      ),
      LastName: yup.object({
        Part: yup
          .string()
          .required("Last Name field is required")
          .matches(/^([^0-9]*)$/, {
            message: "Invalid Last Name",
            excludeEmptyString: true,
          }),
      }),
    }),
    OtherNames: yup.array().of(
      yup.object({
        OtherName: yup.array().of(
          yup.object({
            Part: yup.string().matches(/^([^0-9]*)$/, {
              message: "Invalid Nick Name",
              excludeEmptyString: true,
            }),
          })
        ),
      })
    ),
  }),
  DateOfBirth: yup
    .number("Invalid Date of Birth")
    .required("Date of birth field is required"),
  HealthCard: yup.object({
    Number: yup.string().max(20, "Invalid Health Card#, too long"),
    Version: yup.string().max(2, "Invalid Health Card Version, too long"),
  }),
  Gender: yup.string().required("Gender field is required"),
  Address: yup.array().of(
    yup.object({
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
    })
  ),
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
  Email: yup
    .string()
    .required("Email field is required")
    .email("Invalid Email"),

  SIN: yup
    .string()
    .test(
      "empty-or-9-chars",
      "Invalid SIN, should be 9-digits",
      (sin) => !sin || sin.length === 9
    ),

  PrimaryPhysician: yup.object({
    Name: yup.object({
      FirstName: yup.string().matches(/^([^0-9]*)$/, {
        message: "Invalid Primary Physician First Name",
        excludeEmptyString: true,
      }),
      LastName: yup.string().matches(/^([^0-9]*)$/, {
        message: "Invalid Primary Physician Last Name",
        excludeEmptyString: true,
      }),
    }),
    OHIPPhysicianId: yup
      .string()
      .test(
        "empty-or-6-chars",
        "Invalid Primary Physician OHIP#, should be 6-digits",
        (ohip) => !ohip || ohip.length === 6
      ),
  }),
  ReferredPhysician: yup.object({
    FirstName: yup.string().matches(/^([^0-9]*)$/, {
      message: "Invalid Referred physician First Name",
      excludeEmptyString: true,
    }),
    LastName: yup.string().matches(/^([^0-9]*)$/, {
      message: "Invalid Referred physician First Name",
      excludeEmptyString: true,
    }),
  }),
  FamilyPhysician: yup.object({
    FirstName: yup.string().matches(/^([^0-9]*)$/, {
      message: "Invalid Family physician First Name",
      excludeEmptyString: true,
    }),
    LastName: yup.string().matches(/^([^0-9]*)$/, {
      message: "Invalid Family physician First Name",
      excludeEmptyString: true,
    }),
  }),
  Contact: yup.array().of(
    yup.object({
      Name: yup.object({
        FirstName: yup.string().matches(/^([^0-9]*)$/, {
          message: "Invalid Contact First Name",
          excludeEmptyString: true,
        }),
        LastName: yup.string().matches(/^([^0-9]*)$/, {
          message: "Invalid Contact Last Name",
          excludeEmptyString: true,
        }),
      }),
      EmailAddress: yup.string().email("Invalid Contact Email field"),
      PhoneNumber: yup.array().of(
        yup.object({
          phoneNumber: yup
            .string()
            .matches(
              /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
              {
                message: "Invalid Contact Phone number",
                excludeEmptyString: true,
              }
            ),
        })
      ),
    })
  ),
  assigned_staff_id: yup
    .number()
    .required("Please choose an assigned practician"),
});
