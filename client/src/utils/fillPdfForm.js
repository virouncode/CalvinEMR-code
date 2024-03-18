import { PDFDocument } from "pdf-lib";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../datas/codesTables";
import { getAgeTZ, timestampToDateISOTZ } from "./formatDates";
import {
  toPatientFirstName,
  toPatientLastName,
  toPatientMiddleName,
  toPatientName,
} from "./toPatientName";

export const fillPdfForm = async (url, demographicsInfos, doctorInfos) => {
  if (!demographicsInfos) return;
  const formUrl = url;
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  if (form.getFieldMaybe("full_name")) {
    const fullNameField = form.getFieldMaybe("full_name");
    fullNameField.setText(toPatientName(demographicsInfos));
  }
  if (form.getFieldMaybe("first_name")) {
    const firstNameField = form.getFieldMaybe("first_name");
    firstNameField.setText(toPatientFirstName(demographicsInfos));
  }
  if (form.getFieldMaybe("middle_name")) {
    const middleNameField = form.getFieldMaybe("middle_name");
    middleNameField.setText(toPatientMiddleName(demographicsInfos));
  }
  if (form.getFieldMaybe("last_name")) {
    const lastNameField = form.getFieldMaybe("last_name");
    lastNameField.setText(toPatientLastName(demographicsInfos));
  }
  if (form.getFieldMaybe("gender")) {
    const genderField = form.getFieldMaybe("gender");
    genderField.setText(demographicsInfos.Gender);
  }
  if (form.getFieldMaybe("chart_nbr")) {
    const chartField = form.getFieldMaybe("chart_nbr");
    chartField.setText(demographicsInfos.ChartNumber);
  }
  if (form.getFieldMaybe("health_card_nbr")) {
    const healthField = form.getFieldMaybe("health_card_nbr");
    healthField.setText(demographicsInfos.HealthCard?.Number);
  }
  if (form.getFieldMaybe("date_of_birth")) {
    const birthField = form.getFieldMaybe("date_of_birth");
    birthField.setText(timestampToDateISOTZ(demographicsInfos.DateOfBirth));
  }
  if (form.getFieldMaybe("age")) {
    const ageField = form.getFieldMaybe("age");
    ageField.setText(getAgeTZ(demographicsInfos.DateOfBirth));
  }
  if (form.getFieldMaybe("email")) {
    const emailField = form.getFieldMaybe("email");
    emailField.setText(demographicsInfos.Email);
  }
  if (form.getFieldMaybe("preferred_phone")) {
    const phoneField = form.getFieldMaybe("preferred_phone");
    phoneField.setText(
      demographicsInfos.PhoneNumber.find(
        ({ _phoneNumberType }) => _phoneNumberType === "C"
      ).phoneNumber ||
        demographicsInfos.PhoneNumber.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        ).phoneNumber
    );
  }

  const address =
    demographicsInfos.Address.find(({ _addressType }) => _addressType === "R")
      ?.Structured ||
    demographicsInfos.Address.find(({ _addressType }) => _addressType === "M")
      ?.Structured;

  if (form.getFieldMaybe("address")) {
    const addressField = form.getFieldMaybe("address");
    if (!form.getFieldMaybe("postal_code")) {
      addressField.setText(
        address?.Line1 +
          " " +
          (address?.PostalZipCode.PostalCode ||
            address?.PostalZipCode.ZipCode) +
          " " +
          address?.City +
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
    postalField.setText(
      address?.PostalZipCode?.PostalCode || address?.PostalZipCode?.ZipCode
    );
  }
  if (form.getFieldMaybe("province_state")) {
    const provinceField = form.getFieldMaybe("province_state");
    provinceField.setText(address?.CountrySubDivisionCode);
  }
  if (form.getFieldMaybe("city")) {
    const cityField = form.getFieldMaybe("city");
    cityField.setText(address?.City);
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
