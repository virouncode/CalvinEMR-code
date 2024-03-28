import { useEffect, useState } from "react";
import { getAgeTZ, timestampToDateISOTZ } from "../utils/dates/formatDates";
import { isObjectEmpty } from "../utils/js/isObjectEmpty";
const useRetrieveDemographicsFormDatas = (demographicsInfos) => {
  const [formDatas, setFormDatas] = useState({});
  const residencialAddress = demographicsInfos.Address?.find(
    ({ _addressType }) => _addressType === "R"
  )?.Structured;
  const emergencyContact = demographicsInfos.Contact?.find(
    (contact) => contact.ContactPurpose?.PurposeAsEnum === "EC"
  );
  const lastEnrolment = isObjectEmpty(
    demographicsInfos.Enrolment?.EnrolmentHistory?.sort(
      (a, b) => a.EnrollmentDate - b.EnrollmentDate
    ).slice(-1)[0]
  )
    ? {}
    : demographicsInfos.Enrolment?.EnrolmentHistory?.sort(
        (a, b) => a.EnrollmentDate - b.EnrollmentDate
      ).slice(-1)[0];

  useEffect(() => {
    setFormDatas({
      prefix: demographicsInfos.Names?.NamePrefix || "",
      firstName: demographicsInfos.Names?.LegalName?.FirstName?.Part || "",
      middleName:
        demographicsInfos.Names?.LegalName?.OtherName?.[0]?.Part || "",
      lastName: demographicsInfos.Names?.LegalName?.LastName?.Part || "",
      suffix: demographicsInfos.Names?.LastNameSuffix || "",
      nickName:
        demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0]?.Part || "",
      chart: demographicsInfos.ChartNumber || "",
      dob: timestampToDateISOTZ(demographicsInfos.DateOfBirth),
      age: getAgeTZ(demographicsInfos.DateOfBirth),
      healthNbr: demographicsInfos.HealthCard?.Number || "",
      healthVersion: demographicsInfos.HealthCard?.Version || "",
      healthExpiry: timestampToDateISOTZ(
        demographicsInfos.HealthCard?.ExpiryDate,
        "America/Toronto"
      ),
      healthProvince: demographicsInfos.HealthCard?.ProvinceCode || "",
      gender: demographicsInfos.Gender || "",
      sin: demographicsInfos.SIN || "",
      email: demographicsInfos.Email || "",
      cellphone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber || "",
      cellphoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.extension || "",
      homephone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        )?.phoneNumber || "",
      homephoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        )?.extension || "",
      workphone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "W"
        )?.phoneNumber || "",
      workphoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "W"
        )?.extension || "",
      line1: residencialAddress?.Line1 || "",
      province: residencialAddress?.CountrySubDivisionCode || "",
      postalCode: residencialAddress?.PostalZipCode?.PostalCode || "",
      zipCode: residencialAddress?.PostalZipCode?.ZipCode || "",
      city: residencialAddress?.City || "",
      preferredOff: demographicsInfos.PreferredOfficialLanguage || "",
      status:
        demographicsInfos.PersonStatusCode?.PersonStatusAsEnum ||
        demographicsInfos.PersonStatusCode?.PersonStatusAsPlainText ||
        "",
      assignedMd: demographicsInfos.assigned_staff_id,
      enrolled: "", // A GERER
      pPhysicianFirstName:
        demographicsInfos.PrimaryPhysician?.Name?.FirstName || "",
      pPhysicianLastName:
        demographicsInfos.PrimaryPhysician?.Name?.LastName || "",
      pPhysicianOHIP: demographicsInfos.PrimaryPhysician?.OHIPPhysicianId || "",
      pPhysicianCPSO:
        demographicsInfos.PrimaryPhysician?.PrimaryPhysicianCPSO || "",
      rPhysicianFirstName: demographicsInfos.ReferredPhysician?.FirstName || "",
      rPhysicianLastName: demographicsInfos.ReferredPhysician?.LastName || "",
      fPhysicianFirstName: demographicsInfos.FamilyPhysician?.FirstName || "",
      fPhysicianLastName: demographicsInfos.FamilyPhysician?.LastName || "",
      emergencyFirstName: emergencyContact?.Name?.FirstName || "",
      emergencyMiddleName: emergencyContact?.Name?.MiddleName || "",
      emergencyLastName: emergencyContact?.Name?.LastName || "",
      emergencyEmail: emergencyContact?.EmailAddress || "",
      emergencyPhone:
        emergencyContact?.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber || "",
      avatar: demographicsInfos.avatar || null,
    });
  }, [
    demographicsInfos.ChartNumber,
    demographicsInfos.DateOfBirth,
    demographicsInfos.Email,
    demographicsInfos.FamilyPhysician?.FirstName,
    demographicsInfos.FamilyPhysician?.LastName,
    demographicsInfos.Gender,
    demographicsInfos.HealthCard?.ExpiryDate,
    demographicsInfos.HealthCard?.Number,
    demographicsInfos.HealthCard?.ProvinceCode,
    demographicsInfos.HealthCard?.Version,
    demographicsInfos.Names?.LastNameSuffix,
    demographicsInfos.Names?.LegalName?.FirstName?.Part,
    demographicsInfos.Names?.LegalName?.LastName?.Part,
    demographicsInfos.Names?.LegalName?.OtherName,
    demographicsInfos.Names?.NamePrefix,
    demographicsInfos.Names?.OtherNames,
    demographicsInfos.PersonStatusCode?.PersonStatusAsEnum,
    demographicsInfos.PersonStatusCode?.PersonStatusAsPlainText,
    demographicsInfos.PhoneNumber,
    demographicsInfos.PreferredOfficialLanguage,
    demographicsInfos.PrimaryPhysician?.Name?.FirstName,
    demographicsInfos.PrimaryPhysician?.Name?.LastName,
    demographicsInfos.PrimaryPhysician?.OHIPPhysicianId,
    demographicsInfos.PrimaryPhysician?.PrimaryPhysicianCPSO,
    demographicsInfos.ReferredPhysician?.FirstName,
    demographicsInfos.ReferredPhysician?.LastName,
    demographicsInfos.SIN,
    demographicsInfos.assigned_staff_id,
    demographicsInfos.avatar,
    emergencyContact?.EmailAddress,
    emergencyContact?.Name?.FirstName,
    emergencyContact?.Name?.LastName,
    emergencyContact?.Name?.MiddleName,
    emergencyContact?.PhoneNumber,
    residencialAddress?.City,
    residencialAddress?.CountrySubDivisionCode,
    residencialAddress?.Line1,
    residencialAddress?.PostalZipCode?.PostalCode,
    residencialAddress?.PostalZipCode?.ZipCode,
  ]);
  return {
    formDatas,
    setFormDatas,
    residencialAddress,
    emergencyContact,
    lastEnrolment,
  };
};

export default useRetrieveDemographicsFormDatas;
