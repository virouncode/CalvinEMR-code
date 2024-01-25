import { PDFDocument } from "pdf-lib";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../datas/codesTables";
import { toLocalDate } from "./formatDates";
import { getAge } from "./getAge";
import {
  patientIdToFirstName,
  patientIdToLastName,
  patientIdToMiddleName,
  patientIdToName,
} from "./patientIdToName";

export const fillPdfForm = async (
  url,
  demographicsInfos,
  patientId,
  doctorInfos
) => {
  if (!demographicsInfos) return;
  const formUrl = url;
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();
  const patientInfos = demographicsInfos.find(
    ({ patient_id }) => patient_id === patientId
  );

  if (form.getFieldMaybe("full_name")) {
    const fullNameField = form.getFieldMaybe("full_name");
    fullNameField.setText(patientIdToName(demographicsInfos, patientId));
  }
  if (form.getFieldMaybe("first_name")) {
    const firstNameField = form.getFieldMaybe("first_name");
    firstNameField.setText(patientIdToFirstName(demographicsInfos, patientId));
  }
  if (form.getFieldMaybe("middle_name")) {
    const middleNameField = form.getFieldMaybe("middle_name");
    middleNameField.setText(
      patientIdToMiddleName(demographicsInfos, patientId)
    );
  }
  if (form.getFieldMaybe("last_name")) {
    const lastNameField = form.getFieldMaybe("last_name");
    lastNameField.setText(patientIdToLastName(demographicsInfos, patientId));
  }
  if (form.getFieldMaybe("gender")) {
    const genderField = form.getFieldMaybe("gender");
    genderField.setText(patientInfos.Gender);
  }
  if (form.getFieldMaybe("chart_nbr")) {
    const chartField = form.getFieldMaybe("chart_nbr");
    chartField.setText(patientInfos.ChartNumber);
  }
  if (form.getFieldMaybe("health_insurance_nbr")) {
    const healthField = form.getFieldMaybe("health_insurance_nbr");
    healthField.setText(patientInfos.SIN);
  }
  if (form.getFieldMaybe("date_of_birth")) {
    const birthField = form.getFieldMaybe("date_of_birth");
    birthField.setText(toLocalDate(patientInfos.DateOfBirth));
  }
  if (form.getFieldMaybe("age")) {
    const ageField = form.getFieldMaybe("age");
    ageField.setText(getAge(patientInfos.DateOfBirth));
  }
  if (form.getFieldMaybe("email")) {
    const emailField = form.getFieldMaybe("email");
    emailField.setText(patientInfos.Email);
  }
  if (form.getFieldMaybe("preferred_phone")) {
    const phoneField = form.getFieldMaybe("preferred_phone");
    phoneField.setText(
      patientInfos.PhoneNumber.find(
        ({ _phoneNumberType }) => _phoneNumberType === "C"
      ).phoneNumber ||
        patientInfos.PhoneNumber.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        ).phoneNumber
    );
  }

  const address =
    patientInfos.Address.find(({ _addressType }) => _addressType === "R")
      ?.Structured ||
    patientInfos.Address.find(({ _addressType }) => _addressType === "M")
      ?.Structured;

  if (form.getFieldMaybe("address")) {
    const addressField = form.getFieldMaybe("address");
    if (!form.getFieldMaybe("postal_code")) {
      addressField.setText(
        address.Line1 +
          " " +
          (address.PostalZipCode.PostalCode || address.PostalZipCode.ZipCode) +
          " " +
          address.City +
          " " +
          toCodeTableName(
            provinceStateTerritoryCT,
            address.CountrySubDivisionCode
          )
      );
    } else {
      addressField.setText(address.Line1);
    }
  }
  if (form.getFieldMaybe("postal_code")) {
    const postalField = form.getFieldMaybe("postal_code");
    postalField.setText(demographicsInfos.postal_code);
  }
  if (form.getFieldMaybe("province_state")) {
    const provinceField = form.getFieldMaybe("province_state");
    provinceField.setText(
      address.PostalZipCode.PostalCode || address.PostalZipCode.ZipCode
    );
  }
  if (form.getFieldMaybe("city")) {
    const cityField = form.getFieldMaybe("city");
    cityField.setText(address.City);
  }
  // if (form.getFieldMaybe("country")) {
  //   const countryField = form.getFieldMaybe("country");
  //   countryField.setText(demographicsInfos.country);
  // }
  if (form.getFieldMaybe("doctor_full_name")) {
    const doctorNameField = form.getFieldMaybe("doctor_full_name");
    doctorNameField.setText(doctorInfos.full_name);
  }
  if (form.getFieldMaybe("doctor_phone")) {
    const doctorPhoneField = form.getFieldMaybe("doctor_phone");
    doctorPhoneField.setText(doctorInfos.phone);
  }

  if (form.getFieldMaybe("sign")) {
    const signUrl = doctorInfos.sign.url;
    const signImageBytes = await fetch(signUrl).then((res) =>
      res.arrayBuffer()
    );
    const signImage = await pdfDoc.embedPng(signImageBytes);
    const signImageField = form.getButton("sign");
    signImageField.setImage(signImage);
  }

  const pdfBytes = await pdfDoc.save();
  const docUrl = URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf" })
  );
  return docUrl;
};

export default fillPdfForm;
