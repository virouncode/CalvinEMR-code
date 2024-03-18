import { nowTZTimestamp } from "../formatDates";

export const toJsDemographics = (jsObj) => {
  const jsNames = {
    LastNameSuffix: jsObj.Names?.LastNameSuffix ?? "",
    LegalName: {
      _namePurpose: jsObj.Names?.LegalName?.$?.namePurpose ?? "",
      FirstName: {
        ...jsObj.Names?.LegalName?.FirstName,
      },
      LastName: {
        ...jsObj.Names?.LegalName?.LastName,
      },
      OtherName: Array.isArray(jsObj.Names?.LegalName?.OtherName)
        ? jsObj.Names?.LegalName?.OtherName
        : [
            {
              ...jsObj?.Names?.LegalName?.OtherName,
            },
          ],
    },
    OtherNames: Array.isArray(jsObj.OtherNames)
      ? jsObj.OtherNames.map((otherNames) => {
          return {
            _namePurpose: otherNames.$?.namePurpose,
            OtherName: Array.isArray(otherNames.OtherName)
              ? otherNames.OtherName.map((otherName) => {
                  return {
                    Part: otherName.Part ?? "",
                    PartType: otherName.PartType ?? "",
                    PartQualifier: otherName.PartQualifier ?? "",
                  };
                })
              : [
                  {
                    Part: otherNames.OtherName?.Part ?? "",
                    PartType: otherNames.OtherName?.PartType ?? "",
                    PartQualifier: otherNames.OtherName?.PartQualifier ?? "",
                  },
                ],
          };
        })
      : [
          {
            _namePurpose: jsObj.OtherNames?.$?.namePurpose ?? "",
            OtherName: Array.isArray(jsObj.OtherNames?.OtherName)
              ? jsObj.OtherNames?.OtherName.map((otherName) => {
                  return {
                    Part: otherName.part ?? "",
                    PartType: otherName.PartType ?? "",
                    PartQualifier: otherName.PartQualifier ?? "",
                  };
                })
              : [
                  {
                    Part: jsObj.OtherNames?.OtherName?.Part ?? "",
                    PartType: jsObj.OtherNames?.OtherName?.PartType ?? "",
                    PartQualifier:
                      jsObj.OtherNames?.OtherName?.PartQualifier ?? "",
                  },
                ],
          },
        ],
  };

  const jsDob = jsObj.DateOfBirth
    ? Date.parse(new Date(jsObj.DateOfBirth))
    : "";

  const jsHealthCard = {
    ...jsObj.HealthCard,
    ExpiryDate: jsObj.HealthCard?.ExpiryDate
      ? Date.parse(new Date(jsObj.HealthCard?.ExpiryDate))
      : "",
  };

  // const jsChartNumber = createChartNbr(Date.parse(new Date(jsObj.DateOfBirth)), toCodeTableName(genderCT,jsObj.Gender), patientId); A FAIRE APRES AVOIR POSTE LE PATIENT

  const jsGender = jsObj.Gender ?? "";

  const jsAddress = Array.isArray(jsObj.Address)
    ? jsObj.Address.map((address) => {
        return {
          _addressType: address.$?.addressType ?? "",
          Structured: { ...address.Structured },
          Formatted: { ...address.Formatted },
        };
      })
    : [
        {
          _addressType: jsObj.Address?.$?.addressType ?? "",
          Structured: { ...jsObj.Address?.Structured },
          Formatted: { ...jsObj.Address?.Formatted },
        },
      ];

  const jsPhone = Array.isArray(jsObj.PhoneNumber)
    ? jsObj.PhoneNumber.map((phone) => {
        return {
          _phoneNumberType: phone.$?.phoneNumberType ?? "",
          phoneNumber: phone.phoneNumber ?? "",
          extension: phone.extension ?? "",
          exchange: phone.exchange ?? "",
          areaCode: phone.areaCode ?? "",
          number: phone.number ?? "",
        };
      })
    : [
        {
          _phoneNumberType: jsObj.PhoneNumber?.$?.phoneNumberType ?? "",
          phoneNumber: jsObj.PhoneNumber?.phoneNumber ?? "",
          extension: jsObj.PhoneNumber?.extension ?? "",
          exchange: jsObj.PhoneNumber?.exchange ?? "",
          areaCode: jsObj.PhoneNumber?.areaCode ?? "",
          number: jsObj.PhoneNumber?.number ?? "",
        },
      ];

  const jsPreferredOffLang = jsObj.PreferredfOfficialLanguage || "";
  const jsPreferredSpoLang = jsObj.PreferredSpokenLanguage || "";

  const jsContact = Array.isArray(jsObj.Contact)
    ? jsObj.Contact.map((contact) => {
        return {
          ContactPurpose: {
            ...contact.ContactPurpose,
          },
          Name: {
            ...contact.Name,
          },
          EmailAddress: contact.EmailAddress ?? "",
          Note: contact.Note ?? "",
          PhoneNumber: Array.isArray(contact.PhoneNumber)
            ? contact.PhoneNumber.map((phone) => {
                return {
                  _phoneNumberType: phone.$?.phoneNumberType ?? "",
                  phoneNumber: phone.phoneNumber ?? "",
                  extension: phone.extension ?? "",
                  areaCode: phone.areaCode ?? "",
                  number: phone.number ?? "",
                  exchange: phone.exchange ?? "",
                };
              })
            : {
                _phoneNumberType: contact.PhoneNumber?.$?.phoneNumberType ?? "",
                phoneNumber: contact.PhoneNumber?.phoneNumber ?? "",
                extension: contact.PhoneNumber?.extension ?? "",
                areaCode: contact.PhoneNumber?.areaCode ?? "",
                number: contact.PhoneNumber?.number ?? "",
                exchange: contact.PhoneNumber?.exchange ?? "",
              },
        };
      })
    : [
        {
          ContactPurpose: {
            ...jsObj.Contact?.ContactPurpose,
          },
          Name: {
            ...jsObj.Contact?.Name,
          },
          EmailAddress: jsObj.Contact?.EmailAddress ?? "",
          Note: jsObj.Contact?.Note ?? "",
          PhoneNumber: Array.isArray(jsObj.Contact?.PhoneNumber)
            ? jsObj.Contact?.PhoneNumber.map((phone) => {
                return {
                  _phoneNumberType: phone.$.phoneNumberType ?? "",
                  phoneNumber: phone.phoneNumber ?? "",
                  extension: phone.extension ?? "",
                  areaCode: phone.areaCode ?? "",
                  number: phone.number ?? "",
                  exchange: phone.exchange ?? "",
                };
              })
            : {
                _phoneNumberType:
                  jsObj.Contact?.PhoneNumber?.$?.phoneNumberType ?? "",
                phoneNumber: jsObj.Contact?.PhoneNumber?.phoneNumber ?? "",
                extension: jsObj.Contact?.PhoneNumber?.extension ?? "",
                areaCode: jsObj.Contact?.PhoneNumber?.areaCode ?? "",
                number: jsObj.Contact?.PhoneNumber?.number ?? "",
                exchange: jsObj.Contact?.PhoneNumber?.exchange ?? "",
              },
        },
      ];

  const jsNoteAboutPatient = jsObj.NoteAboutPatient ?? "";

  const jsEnrolmentHistory = Array.isArray(jsObj.Enrolment?.EnrolmentHistory)
    ? jsObj.Enrolment?.EnrolmentHistory.map((history) => {
        return {
          EnrollmentStatus: history.EnrollmentStatus ?? "",
          EnrollmentDate: history.EnrollmentDate
            ? Date.parse(new Date(history.EnrollmentDate))
            : "",
          EnrollmentTerminationDate: history.EnrollmentTerminationDate
            ? Date.parse(new Date(history.EnrollmentTerminationDate))
            : "",
          TerminationReason: history.TerminationReason ?? "",
          EnrolledToPhysician: {
            Name: {
              FirstName: history.EnrolledToPhysician?.Name?.FirstName ?? "",
              LastName: history.EnrolledToPhysician?.Name?.LastName ?? "",
            },
            OHIPPhysicianId: history.EnrolledToPhysician?.OHIPPhysicianId ?? "",
          },
        };
      })
    : [
        {
          EnrollmentStatus:
            jsObj.Enrolment?.EnrolmentHistory?.EnrollmentStatus ?? "",
          EnrollmentDate: jsObj.Enrolment?.EnrolmentHistory?.EnrollmentDate
            ? Date.parse(
                new Date(jsObj.Enrolment?.EnrolmentHistory?.EnrollmentDate)
              )
            : "",
          EnrollmentTerminationDate: jsObj.Enrolment?.EnrolmentHistory
            ?.EnrollmentTerminationDate
            ? Date.parse(
                new Date(
                  jsObj.Enrolment?.EnrolmentHistory?.EnrollmentTerminationDate
                )
              )
            : "",
          TerminationReason:
            jsObj.Enrolment?.EnrolmentHistory?.TerminationReason ?? "",
          EnrolledToPhysician: {
            Name: {
              FirstName:
                jsObj.Enrolment?.EnrolmentHistory?.EnrolledToPhysician?.Name
                  ?.FirstName ?? "",
              LastName:
                jsObj.Enrolment?.EnrolmentHistory?.EnrolledToPhysician?.Name
                  ?.LastName ?? "",
            },
            OHIPPhysicianId:
              jsObj.Enrolment?.EnrolmentHistory?.EnrolledToPhysician
                ?.OHIPPhysicianId ?? "",
          },
        },
      ];
  const jsEnrolment = {
    EnrolmentHistory: [...jsEnrolmentHistory],
  };

  const jsPrimaryPhy = { ...jsObj.PrimaryPhysician };
  const jsEmail = jsObj.Email ?? "";
  const jsPersonStatusCode = { ...jsObj.PersonStatusCode };
  const jsPersonStatusDate = Date.parse(new Date(jsObj.PersonStatusDate));
  const jsSIN = jsObj.SIN;
  const jsReferredPhy = { ...jsObj.ReferredPhysician };
  const jsFamilyPhy = { ...jsObj.FamilyPhysician };

  //Don't forget to add this pharmacy to database, get the id and then post the id to demographics
  const jsPreferredPharmacy = {
    Name: jsObj.PreferredPharmacy?.Name || "",
    Address: {
      _addressType: jsObj.PreferredPharmacy?.Address?.$?.addressType ?? "",
      Structured: jsObj.PreferredPharmacy?.Address?.Structured,
      Formatted: jsObj.PreferredPharmacy?.Address?.Formatted,
    },
    PhoneNumber: Array.isArray(jsObj.PreferredPharmacy?.PhoneNumber)
      ? jsObj.PreferredPharmacy?.PhoneNumber.map((phone) => {
          return {
            _phoneNumberType: phone.$?.phoneNumberType ?? "",
            phoneNumber: phone.phoneNumber ?? "",
            extension: phone.extension ?? "",
            areaCode: phone.areaCode ?? "",
            number: phone.number ?? "",
            exchange: phone.exchange ?? "",
          };
        })
      : [
          {
            _phoneNumberType:
              jsObj.PreferredPharmacy?.PhoneNumber?.$?.phoneNumberType ?? "",
            phoneNumber:
              jsObj.PreferredPharmacy?.PhoneNumber?.phoneNumber ?? "",
            extension: jsObj.PreferredPharmacy?.PhoneNumber?.extension ?? "",
            areaCode: jsObj.PreferredPharmacy?.PhoneNumber?.areaCode ?? "",
            number: jsObj.PreferredPharmacy?.PhoneNumber?.number ?? "",
            exchange: jsObj.PreferredPharmacy?.PhoneNumber?.exchange ?? "",
          },
        ],
    FaxNumber: {
      _phoneNumberType:
        jsObj.PreferredPharmacy?.FaxNumber?.$?.phoneNumberType ?? "",
      phoneNumber: jsObj.PreferredPharmacy?.FaxNumber?.phoneNumber ?? "",
      extension: jsObj.PreferredPharmacy?.FaxNumber?.extension ?? "",
      areaCode: jsObj.PreferredPharmacy?.FaxNumber?.areaCode ?? "",
      number: jsObj.PreferredPharmacy?.FaxNumber?.number ?? "",
      exchange: jsObj.PreferredPharmacy?.FaxNumber?.exchange ?? "",
    },
    EmailAddress: jsObj.PreferredPharmacy?.EmailAddress,
  };

  const finalDemographics = {
    //19 keys
    patient_id: "", //to be determined when posting patient
    created_by_id: "", // to be with admin id when it will be pris en compte
    date_created: nowTZTimestamp(),
    Names: jsNames,
    DateOfBirth: jsDob,
    ChartNumber: "", //to be determined when posting patient
    HealthCard: jsHealthCard,
    Gender: jsGender,
    Address: jsAddress,
    PhoneNumber: jsPhone,
    PreferredfOfficialLanguage: jsPreferredOffLang,
    PreferredSpokenLanguage: jsPreferredSpoLang,
    Contact: jsContact,
    NoteAboutPatient: jsNoteAboutPatient,
    Enrolment: jsEnrolment,
    PrimaryPhysician: jsPrimaryPhy,
    Email: jsEmail,
    PersonStatusCode: jsPersonStatusCode,
    PersonStatusDate: jsPersonStatusDate,
    SIN: jsSIN,
    ReferredPhysician: jsReferredPhy,
    FamilyPhysician: jsFamilyPhy,
    PreferredPharmacy: jsPreferredPharmacy, //Post before then get the id
  };

  return finalDemographics;
};
