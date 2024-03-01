import xmlFormat from "xml-formatter";
import { toLocalDate } from "../formatDates";
import { toPatientName } from "../toPatientName";

export const toXmlDemographics = (jsObj, patientInfos = null) => {
  const xmlNames = `<Names>
<cdsd:NamePrefix>${jsObj.Names?.NamePrefix ?? ""}</cdsd:NamePrefix>
    <cdsd:LegalName namePurpose=${jsObj.Names?.LegalName?._namePurpose}>
      <cdsd:FirstName>
        <cdsd:Part>${jsObj.Names?.LegalName?.FirstName?.Part ?? ""}</cdsd:Part>
        <cdsd:PartType>${
          jsObj.Names?.LegalName?.FirstName?.PartType ?? ""
        }</cdsd:PartType>
        <cdsd:PartQualifier>${
          jsObj.Names?.LegalName?.FirstName?.PartQualifier ?? ""
        }</cdsd:PartQualifier>
      </cdsd:FirstName>
      <cdsd:LastName>
        <cdsd:Part>${jsObj.Names?.LegalName?.LastName?.Part ?? ""}</cdsd:Part>
        <cdsd:PartType>${
          jsObj.Names?.LegalName?.LastName?.PartType ?? ""
        }</cdsd:PartType>
        <cdsd:PartQualifier>${
          jsObj.Names?.LegalName?.LastName?.PartQualifier ?? ""
        }</cdsd:PartQualifier>
      </cdsd:LastName>
      ${
        jsObj.Names?.LegalName?.OtherName?.length > 0
          ? jsObj.Names?.LegalName?.OtherName.map((otherName) =>
              otherName.Part
                ? `<cdsd:OtherName>
            <cdsd:Part>${otherName.Part ?? ""}</cdsd:Part>
            <cdsd:PartType>${otherName.PartType ?? ""}</cdsd:PartType>
            <cdsd:PartQualifier>${
              otherName.PartQualifier ?? ""
            }</cdsd:PartQualifier>
          </cdsd:OtherName>`
                : ""
            ).join("")
          : ""
      }
    </cdsd:LegalName>
    ${
      jsObj.Names?.OtherNames?.length > 0
        ? jsObj.Names?.OtherNames.map(
            (item) =>
              `<cdsd:OtherNames namePurpose=${item._namePurpose}>
      ${
        item.OtherName?.length > 0
          ? item.OtherName.map((otherName) =>
              otherName.Part
                ? `<cdsd:OtherName>
      <cdsd:Part>${otherName.Part ?? ""}</cdsd:Part>
      <cdsd:PartType>${otherName.PartType ?? ""}</cdsd:PartType>
      <cdsd:PartQualifier>${otherName.PartQualifier ?? ""}</cdsd:PartQualifier>
    </cdsd:OtherName>`
                : ""
            ).join("")
          : ""
      }
    </cdsd:OtherNames>`
          ).join("")
        : ""
    }
    <cdsd:LastNameSuffix>${
      jsObj.Names?.LastNameSuffix ?? ""
    }</cdsd:LastNameSuffix>
  </Names>`;

  const xmlDob = `<DateOfBirth>${toLocalDate(jsObj.DateOfBirth)}</DateOfBirth>`;

  const xmlHealthCard = `
    <HealthCard>
      <cdsd:Number>${jsObj.HealthCard?.Number ?? ""}</cdsd:Number>
      <cdsd:Version>${jsObj.HealthCard?.Version ?? ""}</cdsd:Version>
      <cdsd:Expirydate>${toLocalDate(
        jsObj.HealthCard.ExpiryDate
      )}</cdsd:Expirydate>
      <cdsd:ProvinceCode>${
        jsObj.HealthCard?.ProvinceCode ?? ""
      }</cdsd:ProvinceCode>
    </HealthCard>`;

  const xmlChartNumber = `<ChartNumber>${
    jsObj.ChartNumber ?? ""
  }</ChartNumber>`;

  const xmlGender = `<Gender>${jsObj.Gender ?? ""}</Gender>`;

  const xmlUniqueVendorId = `<UniqueVendorIdSequence>${
    jsObj.UniqueVendorIdSequence ?? ""
  }</UniqueVendorIdSequence>`;

  const xmlAddress =
    jsObj.Address?.length > 0
      ? jsObj.Address.map(
          (address) =>
            `<Address addressType=${address._addressType}>
    <cdsd:Structured>
        <cdsd:Line1>${address.Structured?.Line1 ?? ""}</cdsd:Line1>
        <cdsd:Line2>${address.Structured?.Line2 ?? ""}</cdsd:Line2>
        <cdsd:Line3>${address.Structured?.Line3 ?? ""}</cdsd:Line3>
        <cdsd:City>${address.Structured?.City ?? ""}</cdsd:City>
        <cdsd:CountrySubdivisionCode>${
          address.Structured?.CountrySubDivisionCode ?? ""
        }</cdsd:CountrySubdivisionCode>
        <cdsd:PostalZipCode>
          ${
            address.Structured?.PostalZipCode?.PostalCode
              ? `<cdsd:PostalCode>${address.Structured?.PostalZipCode?.PostalCode}</cdsd:PostalCode>`
              : `<cdsd:ZipCode>${
                  address.Structured?.PostalZipCode?.ZipCode ?? ""
                }</cdsd:ZipCode>`
          }
        </cdsd:PostalZipCode>
    </cdsd:Structured>
   </Address>`
        ).join("")
      : "";

  const xmlPhoneNumber =
    jsObj.PhoneNumber?.length > 0
      ? jsObj.PhoneNumber.map(
          (item) =>
            `<PhoneNumber phoneNumberType=${item._phoneNumberType}>
        ${
          item.phoneNumber
            ? `<cdsd:phoneNumber>${item.phoneNumber}</cdsd:phoneNumber>
                <cdsd:extension>${item.extension ?? ""}</cdsd:extension>`
            : `<cdsd:areaCode>${item.areaCode ?? ""}</cdsd:areaCode>
              <cdsd:number>${item.number ?? ""}</cdsd:number>
              <cdsd:extension>${item.extension ?? ""}</cdsd:extension>
              <cdsd:exchange>${item.exchange ?? ""}</cdsd:exchange>`
        }
</PhoneNumber>`
        ).join("")
      : "";

  const xmlPreferredOfficialLang = `<PreferredOfficialLanguage>${
    jsObj.PreferredOfficialLanguage ?? ""
  }</PreferredOfficialLanguage>`;

  const xmlPreferredSpokenLang = `<PreferredSpokenLanguage>${
    jsObj.PreferredSpokenLanguage ?? ""
  }</PreferredSpokenLanguage>`;

  const xmlContact =
    jsObj.Contact?.length > 0
      ? jsObj.Contact.map(
          (contact) =>
            `<Contact>
        <ContactPurpose>
          ${
            contact.ContactPurpose?.PurposeAsEnum
              ? `<cdsd:PurposeAsEnum>${contact.ContactPurpose?.PurposeAsEnum}</cdsd:PurposeAsEnum>`
              : `<cdsd:PurposeAsPlainText>${
                  contact.ContactPurpose?.PurposeAsPlainText ?? ""
                }</cdsd:PurposeAsPlainText>`
          }
        </ContactPurpose>
        <Name>
          <cdsd:FirstName>
          ${contact.Name?.FirstName ?? ""}
          </cdsd:FirstName>
          <cdsd:MiddleName>
          ${contact.Name?.MiddleName ?? ""}
          </cdsd:MiddleName>
          <cdsd:LastName>
          ${contact.Name?.LastName ?? ""}
          </cdsd:LastName>
        </Name>
        ${
          contact.PhoneNumber?.length > 0
            ? contact.PhoneNumber.map(
                (item) =>
                  `<PhoneNumber phoneNumberType=${item._phoneNumberType}>
                  ${
                    item.phoneNumber
                      ? `<cdsd:phoneNumber>${
                          item.phoneNumber
                        }</cdsd:phoneNumber>
            <cdsd:extension>${item.extension ?? ""}</cdsd:extension>`
                      : `<cdsd:areaCode>${
                          item.areaCode ?? ""
                        }</cdsd:areaCode><cdsd:number>${
                          item.number ?? ""
                        }</cdsd:number><cdsd:extension>${
                          item.extension ?? ""
                        }</cdsd:extension><cdsd:exchange>${
                          item.exchange ?? ""
                        }</cdsd:exchange>`
                  }
          </PhoneNumber>`
              ).join("")
            : ""
        }
        <EmailAddress>${contact.EmailAddress ?? ""}</EmailAddress>
        <Note>${contact.Note ?? ""}</Note>
      </Contact>`
        ).join("")
      : "";

  const xmlNote = `<NoteAboutPatient>${
    jsObj.NoteAboutPatient ?? ""
  }</NoteAboutPatient>`;

  const xmlEnrolment = `<Enrolment>
      ${
        jsObj.Enrolment?.EnrolmentHistory?.length > 0
          ? jsObj.Enrolment.EnrolmentHistory.map(
              (history) =>
                `<EnrolmentHistory>
            <EnrollmentStatus>${
              history.EnrollmentStatus ?? ""
            }</EnrollmentStatus>
            <EnrollmentDate>${toLocalDate(
              history.EnrollmentDate
            )}</EnrollmentDate>
            <EnrollmentTerminationDate>${toLocalDate(
              history.EnrollmentTerminationDate
            )}</EnrollmentTerminationDate>
            <TerminationReason>${
              history.TerminationReason ?? ""
            }</TerminationReason>
            <EnrolledToPhysician>
              <Name>
                <cdsd:FirstName>
                ${history.EnrolledToPhysician?.Name?.FirstName ?? ""}
                </cdsd:FirstName>
                <cdsd:LastName>
                ${history.EnrolledToPhysician?.Name?.LastName ?? ""}
                </cdsd:LastName>
              </Name>
              <OHIPPhysicianId>${
                history.EnrolledToPhysician?.OHIPPhysicianId ?? ""
              }</OHIPPhysicianId>
            </EnrolledToPhysician>
        </EnrolmentHistory>`
            ).join("")
          : ""
      }
      </Enrolment>`;

  const xmlPrimaryPh = `<PrimaryPhysician>
        <Name>
          <cdsd:FirstName>
          ${jsObj.PrimaryPhysician?.Name?.FirstName ?? ""}
          </cdsd:FirstName>
          <cdsd:LastName>
          ${jsObj.PrimaryPhysician?.Name?.LastName ?? ""}
          </cdsd:LastName>
        </Name>
        <OHIPPhysicianId>
          ${jsObj.PrimaryPhysician?.OHIPPhysicianId ?? ""}
        </OHIPPhysicianId>
        <PrimaryPhysicianCPSO>
          ${jsObj.PrimaryPhysician?.PrimaryPhysicianCPSO ?? ""}
        </PrimaryPhysicianCPSO>
      </PrimaryPhysician>`;

  const xmlEmail = `<Email>${jsObj.Email ?? ""}</Email>`;

  const xmlPersonStatusCode = `<PersonStatusCode>
  ${
    jsObj.PersonStatusCode?.PersonStatusAsEnum
      ? `<PersonStatusAsEnum>${jsObj.PersonStatusCode?.PersonStatusAsEnum}</PersonStatusAsEnum>`
      : `<PersonStatusAsPlainText>${
          jsObj.PersonStatusCode?.PersonStatusAsPlainText ?? ""
        }</PersonStatusAsPlainText>`
  }
  </PersonStatusCode>`;

  const xmlPersonStatusDate = `<PersonStatusDate>${toLocalDate(
    jsObj.PersonStatusDate
  )}</PersonStatusDate>`;

  const xmlSIN = `<SIN>${jsObj.SIN ?? ""}</SIN>`;

  const xmlReferredPh = `<ReferredPhysician>
      <cdsd:FirstName>
      ${jsObj.ReferredPhysician?.FirstName ?? ""}
      </cdsd:FirstName>
      <cdsd:LastName>
      ${jsObj.ReferredPhysician?.LastName ?? ""}
      </cdsd:LastName>
    </ReferredPhysician>`;

  const xmlFamilyPh = `<FamilyPhysician>
      <cdsd:FirstName>
      ${jsObj.FamilyPhysician?.FirstName ?? ""}
      </cdsd:FirstName>
      <cdsd:LastName>
      ${jsObj.FamilyPhysician?.LastName ?? ""}
      </cdsd:LastName>
    </FamilyPhysician>`;

  const xmlPreferredPharmacy = `<PreferredPharmacy>
    <Name>${jsObj.PreferredPharmacy?.Name ?? ""}</Name>
    <Address addressType=${jsObj.PreferredPharmacy?.Address?._addressType}>
      <cdsd:Structured>
        <cdsd:Line1>${
          jsObj.PreferredPharmacy?.Address?.Structured?.Line1 ?? ""
        }</cdsd:Line1>
        <cdsd:Line2>${
          jsObj.PreferredPharmacy?.Address?.Structured?.Line2 ?? ""
        }</cdsd:Line2>
        <cdsd:Line3>${
          jsObj.PreferredPharmacy?.Address?.Structured?.Line3 ?? ""
        }</cdsd:Line3>
        <cdsd:City>${
          jsObj.PreferredPharmacy?.Address?.Structured?.City ?? ""
        }</cdsd:City>
        <cdsd:CountrySubdivisionCode>${
          jsObj.PreferredPharmacy?.Address?.Structured
            ?.CountrySubDivisionCode ?? ""
        }</cdsd:CountrySubdivisionCode>
        <cdsd:PostalZipCode>
          ${
            jsObj.PreferredPharmacy?.Address?.Structured?.PostalZipCode
              ?.PostalCode
              ? `<cdsd:PostalCode>${jsObj.PreferredPharmacy?.Address?.Structured?.PostalZipCode?.PostalCode}</cdsd:PostalCode>`
              : `
          <cdsd:ZipCode>${
            jsObj.PreferredPharmacy?.Address?.Structured?.PostalZipCode
              ?.ZipCode ?? ""
          }</cdsd:ZipCode>`
          }
        </cdsd:PostalZipCode>
      </cdsd:Structured>
    </Address>
    ${
      jsObj.PreferredPharmacy?.PhoneNumber?.length > 0
        ? jsObj.PreferredPharmacy.PhoneNumber.map(
            (item) =>
              `<PhoneNumber phoneNumberType=${item._phoneNumberType}>
            ${
              item.phoneNumber
                ? `<cdsd:phoneNumber>${item.phoneNumber}</cdsd:phoneNumber>
                  <cdsd:extension>${item.extension ?? ""}</cdsd:extension>`
                : `<cdsd:areaCode>${item.areaCode ?? ""}</cdsd:areaCode>
                   <cdsd:number>${item.number ?? ""}</cdsd:number>
                   <cdsd:extension>${item.extension ?? ""}</cdsd:extension>
                   <cdsd:exchange>${item.exchange ?? ""}</cdsd:exchange>`
            }
    </PhoneNumber>`
          ).join("")
        : ""
    }
    <FaxNumber phoneNumberType=${
      jsObj.PreferredPharmacy?.FaxNumber?._phoneNumberType
    }>
       ${
         jsObj.PreferredPharmacy?.FaxNumber?.phoneNumer
           ? `<cdsd:phoneNumber>${
               jsObj.PreferredPharmacy?.FaxNumber?.phoneNumer
             }</cdsd:phoneNumber>
        <cdsd:extension>${
          jsObj.PreferredPharmacy?.FaxNumber?.extension ?? ""
        }</cdsd:extension>`
           : `<cdsd:areaCode>${
               jsObj.PreferredPharmacy?.FaxNumber.areaCode ?? ""
             }</cdsd:areaCode>
        <cdsd:number>${
          jsObj.PreferredPharmacy?.FaxNumber.number ?? ""
        }</cdsd:number>
         <cdsd:extension>${
           jsObj.PreferredPharmacy?.FaxNumber.extension ?? ""
         }</cdsd:extension>
        <cdsd:exchange>${
          jsObj.PreferredPharmacy?.FaxNumber.exchange ?? ""
        }</cdsd:exchange>`
       }
    </FaxNumber>
    <EmailAddress>${jsObj.PreferredPharmacy?.EmailAddress ?? ""}</EmailAddress>
  </PreferredPharmacy>`;

  const xmlDemographics =
    "<Demographics>" +
    xmlNames +
    xmlDob +
    xmlHealthCard +
    xmlChartNumber +
    xmlGender +
    xmlUniqueVendorId +
    xmlAddress +
    xmlPhoneNumber +
    xmlPreferredOfficialLang +
    xmlPreferredSpokenLang +
    xmlContact +
    xmlNote +
    xmlEnrolment +
    xmlPrimaryPh +
    xmlEmail +
    xmlPersonStatusCode +
    xmlPersonStatusDate +
    xmlSIN +
    xmlReferredPh +
    xmlFamilyPh +
    xmlPreferredPharmacy +
    "</Demographics>";

  return xmlFormat(xmlDemographics, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlPersonalHistory = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlPersonalHistory =
    "<PersonalHistory>" + xmlResidual + "</PersonalHistory>";

  return xmlFormat(xmlPersonalHistory, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlFamHistory = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlStartDate = `<StartDate><cdsd:FullDate>${toLocalDate(
    jsObj.StartDate
  )}</cdsd:FullDate></StartDate>`;

  const xmlAge = `<AgeAtOnset>${jsObj.AgeAtOnset ?? ""}</AgeAtOnset>`;

  const xmlLifeStage = `<LifeStage>${jsObj.LifeStage ?? ""}</LifeStage>`;

  const xmlProblemeDiagProcDesc = `<ProblemDiagnosisProcedureDescription>${
    jsObj.ProblemDiagnosisProcedureDescription ?? ""
  }</ProblemDiagnosisProcedureDescription>`;

  const xmlDiagProcCode = `<DiagnosisProcedureCode>
  <cdsd:StandardCodingSystem>${
    jsObj.DiagnosisProcedureCode.StandardCodingSystem ?? ""
  }</cdsd:StandardCodingSystem>
  <cdsd:StandardCode>${
    jsObj.DiagnosisProcedureCode.StandardCode ?? ""
  }</cdsd:StandardCode>
  <cdsd:StandardCodeDescription>${
    jsObj.DiagnosisProcedureCode.StandardCodeDescription ?? ""
  }</cdsd:StandardCodeDescription>
  </DiagnosisProcedureCode>`;

  const xmlTreatment = `<Treatment>${jsObj.Treatment ?? ""}</Treatment>`;
  const xmlRelationship = `<Relationship>${
    jsObj.Relationship ?? ""
  }</Relationship>`;
  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;

  const xmlFamHistory =
    "<FamilyHistory>" +
    xmlResidual +
    xmlStartDate +
    xmlAge +
    xmlLifeStage +
    xmlProblemeDiagProcDesc +
    xmlDiagProcCode +
    xmlTreatment +
    xmlRelationship +
    xmlNotes +
    "</FamilyHistory>";

  return xmlFormat(xmlFamHistory, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlPastHealth = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlPastHealthProbDescOrProc = `<PastHealthProblemDescriptionOrProcedures>${
    jsObj.PastHealthProblemDescriptionOrProcedures ?? ""
  }</PastHealthProblemDescriptionOrProcedures>`;

  const xmlDiagProcCode = `<DiagnosisProcedureCode>
  <cdsd:StandardCodingSystem>${
    jsObj.DiagnosisProcedureCode?.StandardCodingSystem ?? ""
  }</cdsd:StandardCodingSystem>
  <cdsd:StandardCode>${
    jsObj.DiagnosisProcedureCode?.StandardCode ?? ""
  }</cdsd:StandardCode>
  <cdsd:StandardCodeDescription>${
    jsObj.DiagnosisProcedureCode?.StandardCodeDescription ?? ""
  }</cdsd:StandardCodeDescription>
  </DiagnosisProcedureCode>`;

  const xmlOnsetOrEventDate = `<OnsetOrEventDate><cdsd:FullDate>${toLocalDate(
    jsObj.OnsetOrEventDate
  )}</cdsd:FullDate></OnsetOrEventDate>`;

  const xmlLifeStage = `<LifeStage>${jsObj.LifeStage ?? ""}</LifeStage>`;

  const xmlResolvedDate = `<ResolvedDate><cdsd:FullDate>${toLocalDate(
    jsObj.ResolvedDate
  )}</cdsd:FullDate></ResolvedDate>`;

  const xmlProcedureDate = `<ProcedureDate><cdsd:FullDate>${toLocalDate(
    jsObj.ProcedureDate
  )}</cdsd:FullDate></ProcedureDate>`;

  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;

  const xmlProblemStatus = `<ProblemStatus>${
    jsObj.ProblemStatus ?? ""
  }</ProblemStatus>`;

  const xmlPastHealth =
    "<PastHealth>" +
    xmlResidual +
    xmlPastHealthProbDescOrProc +
    xmlDiagProcCode +
    xmlOnsetOrEventDate +
    xmlLifeStage +
    xmlResolvedDate +
    xmlProcedureDate +
    xmlNotes +
    xmlProblemStatus +
    "</PastHealth>";

  return xmlFormat(xmlPastHealth, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlProblemList = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlProblemDiagDesc = `<ProblemDiagnosisDescription>${
    jsObj.ProblemDiagnosisDescription ?? ""
  }</ProblemDiagnosisDescription>`;

  const xmlDiagCode = `<DiagnosisCode>
  <cdsd:StandardCodingSystem>${
    jsObj.DiagnosisCode?.StandardCodingSystem ?? ""
  }</cdsd:StandardCodingSystem>
  <cdsd:StandardCode>${
    jsObj.DiagnosisCode?.StandardCode ?? ""
  }</cdsd:StandardCode>
  <cdsd:StandardCodeDescription>${
    jsObj.DiagnosisCode?.StandardCodeDescription ?? ""
  }</cdsd:StandardCodeDescription>
  </DiagnosisCode>`;

  const xmlProblemDesc = `<ProblemDescription>${
    jsObj.ProblemDescription ?? ""
  }</ProblemDescription>`;

  const xmlProblemStatus = `<ProblemStatus>${
    jsObj.ProblemStatus ?? ""
  }</ProblemStatus>`;

  const xmlOnsetDate = `<OnsetDate><cdsd:FullDate>${toLocalDate(
    jsObj.OnsetDate
  )}</cdsd:FullDate></OnsetDate>`;

  const xmlLifeStage = `<LifeStage>${jsObj.LifeStage ?? ""}</LifeStage>`;

  const xmlResolutionDate = `<ResolutionDate><cdsd:FullDate>${toLocalDate(
    jsObj.ResolutionDate
  )}</cdsd:FullDate></ResolutionDate>`;

  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;

  const xmlProblemList =
    "<ProblemList>" +
    xmlResidual +
    xmlProblemDiagDesc +
    xmlDiagCode +
    xmlProblemDesc +
    xmlProblemStatus +
    xmlOnsetDate +
    xmlLifeStage +
    xmlResolutionDate +
    xmlNotes +
    "</ProblemList>";

  return xmlFormat(xmlProblemList, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlRiskFactors = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlRisk = `<RiskFactor>${jsObj.RiskFactor ?? ""}</RiskFactor>`;

  const xmlExposure = `<ExposureDetails>${
    jsObj.ExposureDetails ?? ""
  }</ExposureDetails>`;

  const xmlAgeOfOnset = `<AgeOfOnset>${jsObj.AgeOfOnset ?? ""}</AgeOfOnset>`;

  const xmlStart = `<StartDate><cdsd:FullDate>${toLocalDate(
    jsObj.StartDate
  )}</cdsd:FullDate></StartDate>`;

  const xmlEnd = `<EndDate><cdsd:FullDate>${toLocalDate(
    jsObj.EndDate
  )}</cdsd:FullDate></EndDate>`;

  const xmlLifeStage = `<LifeStage>${jsObj.LifeStage ?? ""}</LifeStage>`;

  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;

  const xmlRiskFactors =
    "<RiskFactors>" +
    xmlResidual +
    xmlRisk +
    xmlExposure +
    xmlAgeOfOnset +
    xmlStart +
    xmlEnd +
    xmlLifeStage +
    xmlNotes +
    "</RiskFactors>";

  return xmlFormat(xmlRiskFactors, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlAllergies = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlOffendingAgentDesc = `<OffendingAgentDescription>${
    jsObj.OffendingAgentDescription ?? ""
  }</OffendingAgentDescription>`;

  const xmlPropertyOfOffendingAgent = `<PropertyOfOffendingAgent>${
    jsObj.PropertyOfOffendingAgent ?? ""
  }</PropertyOfOffendingAgent>`;

  const xmlCode = `<Code>
  <cdsd:CodeType>${jsObj.Code?.CodeType ?? ""}</cdsd:CodeType>
  <cdsd:CodeValue>${jsObj.Code?.CodeValue ?? ""}</cdsd:CodeValue>
  </Code>`;

  const xmlReactionType = `<ReactionType>${
    jsObj.ReactionType ?? ""
  }</ReactionType>`;

  const xmlStart = `<StartDate><cdsd:FullDate>${toLocalDate(
    jsObj.StartDate
  )}</cdsd:FullDate></StartDate>`;

  const xmlLifeStage = `<LifeStage>${jsObj.LifeStage ?? ""}</LifeStage>`;

  const xmlSeverity = `<Severity>${jsObj.Severity ?? ""}</Severity>`;

  const xmlReaction = `<Reaction>${jsObj.Reaction ?? ""}</Reaction>`;

  const xmlRecordedDate = `<RecordedDate><cdsd:FullDate>${toLocalDate(
    jsObj.RecordedDate
  )}</cdsd:FullDate></RecordedDate>`;

  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;

  const xmlAllergies =
    "<AllergiesAndAdverseReactions>" +
    xmlResidual +
    xmlOffendingAgentDesc +
    xmlPropertyOfOffendingAgent +
    xmlCode +
    xmlReactionType +
    xmlStart +
    xmlLifeStage +
    xmlSeverity +
    xmlReaction +
    xmlRecordedDate +
    xmlNotes +
    "</AllergiesAndAdverseReactions>";

  return xmlFormat(xmlAllergies, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlMedications = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;
  const xmlPrescriptionDate = `<PrescriptionWrittenDate><cdsd:FullDate>${toLocalDate(
    jsObj.PrescriptionWrittenDate
  )}</cdsd:FullDate></PrescriptionWrittenDate>`;
  const xmlStart = `<StartDate><cdsd:FullDate>${toLocalDate(
    jsObj.StartDate
  )}</cdsd:FullDate></StartDate>`;
  const xmlDrugNumber = `<DrugIdentificationNumber>${
    jsObj.DrugIdentificationNumber ?? ""
  }</DrugIdentificationNumber>`;
  const xmlDrugName = `<DrugName>${jsObj.DrugName ?? ""}</DrugName>`;
  const xmlStrength = `
  <Strength>
    <cdsd:Amount>${jsObj.Strength?.Amount ?? ""}
    </cdsd:Amount>
    <cdsd:UnitOfMeasure>${jsObj.Strength?.UnitOfMeasure ?? ""}
    </cdsd:UniteOfMeasure>
  </Strength>`;
  const xmlNumberOfRefills = `<NumberOfRefills>${
    jsObj.NumberOfRefills ?? ""
  }</NumberOfRefills>`;
  const xmlDosage = `<Dosage>${jsObj.Dosage ?? ""}</Dosage>`;
  const xmlDosageUnitOfMeasure = `<DosageUnitOfMeasure>${
    jsObj.DosageUnitOfMeasure ?? ""
  }</DosageUnitOfMeasure>`;
  const xmlForm = `<Form>${jsObj.Form ?? ""}</Form>`;
  const xmlRoute = `<Route>${jsObj.Route ?? ""}</Route>`;
  const xmlFrequency = `<Frequency>${jsObj.Frequency ?? ""}</Frequency>`;
  const xmlDuration = `<Duration>${jsObj.Duration ?? ""}</Duration>`;
  const xmlRefillDuration = `<RefillDuration>${
    jsObj.RefillDuration ?? ""
  }</RefillDuration>`;
  const xmlQuantity = `<Quantity>${jsObj.Quantity ?? ""}</Quantity>`;
  const xmlRefillQuantity = `<RefillQuantity>${
    jsObj.RefillQuantity ?? ""
  }</RefillQuantity>`;
  const xmlLongTermMed = `<LongTermMedication>
    <cdsd:ynIndicatorsimple>${
      jsObj.LongTermMedication?.ynIndicatorsimple ?? ""
    }</cdsd:ynIndicatorsimple>
  </LongTermMedication>`;
  const xmlPastMed = `<PastMedications>
    <cdsd:ynIndicatorsimple>${
      jsObj.PastMedication?.ynIndicatorsimple ?? ""
    }</cdsd:ynIndicatorsimple>
  </PastMedications>`;
  const xmlPrescribedBy = `
  <PrescribedBy>
      <Name>
        <cdsd:FirstName>${
          jsObj.PrescribedBy?.Name.FirstName ?? ""
        }</cdsd:FirstName>
        <cdsd:LastName>${
          jsObj.PrescribedBy?.Name.LastName ?? ""
        }</cdsd:LastName>
      </Name>
      <OHIPPhysicianId>${
        jsObj.PrescribedBy?.OHIPPhysicianId ?? ""
      }</OHIPPhysicianId>
  </PrescribedBy>`;
  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;
  const xmlPrescriptionInst = `<PrescriptionInstructions>${
    jsObj.PrescriptionInstructions ?? ""
  }</PrescriptionInstructions>`;
  const xmlPatientCompliance = `<PatientCompliance>
    <cdsd:ynIndicatorsimple>${
      jsObj.PatientCompliance?.ynIndicatorsimple ?? ""
    }</cdsd:ynIndicatorsimple>
  </PatientCompliance>`;
  const xmlTreatmentType = `<TreatmentType>${
    jsObj.TreatmentType ?? ""
  }</TreatmentType>`;
  const xmlPrescriptionStatus = `<PrescriptionStatus>${
    jsObj.PrescriptionStatus ?? ""
  }</PrescriptionStatus>`;
  const xmlNonAuthoritativeIndicator = `<NonAuthoritativeIndicator>${
    jsObj.NonAuthoritativeIndicator ?? ""
  }</NonAuthoritativeIndicator>`;
  const xmlPrescriptionIdentifier = `<PrescriptionIdentifier>${
    jsObj.PrescriptionIdentifier ?? ""
  }</PrescriptionIdentifier>`;
  const xmlPriorPrescriptionRefIdentifier = `<PriorPrescriptionReferenceIdentifier>${
    jsObj.PriorPrescriptionReferenceIdentifier ?? ""
  }</PriorPrescriptionReferenceIdentifier>`;
  const xmlDispenseInterval = `<DispenseInterval>${
    jsObj.DispenseInterval ?? ""
  }</DispenseInterval>`;
  const xmlDrugDescription = `<DrugDescription>${
    jsObj.DrugDescription ?? ""
  }</DrugDescription>`;
  const xmlSubstitutionNotAllowed = `<SubstitutionNotAllowed>${
    jsObj.SubstitutionNotAllowed ?? ""
  }</SubstitutionNotAllowed>`;
  const xmlProblemCode = `<ProblemCode>${
    jsObj.ProblemCode ?? ""
  }</ProblemCode>`;
  const xmlProtocolIdentifier = `<ProtocolIdentifier>${
    jsObj.ProtocolIdentifier ?? ""
  }</ProtocolIdentifier>`;

  const xmlMedications =
    "<MedicationsAndTreatments>" +
    xmlResidual +
    xmlPrescriptionDate +
    xmlStart +
    xmlDrugNumber +
    xmlDrugName +
    xmlStrength +
    xmlNumberOfRefills +
    xmlDosage +
    xmlDosageUnitOfMeasure +
    xmlForm +
    xmlRoute +
    xmlFrequency +
    xmlDuration +
    xmlRefillDuration +
    xmlQuantity +
    xmlRefillQuantity +
    xmlLongTermMed +
    xmlPastMed +
    xmlPrescribedBy +
    xmlNotes +
    xmlPrescriptionInst +
    xmlPatientCompliance +
    xmlTreatmentType +
    xmlPrescriptionStatus +
    xmlNonAuthoritativeIndicator +
    xmlPrescriptionIdentifier +
    xmlPriorPrescriptionRefIdentifier +
    xmlDispenseInterval +
    xmlDrugDescription +
    xmlSubstitutionNotAllowed +
    xmlProblemCode +
    xmlProtocolIdentifier +
    "</MedicationsAndTreatments>";

  return xmlFormat(xmlMedications, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlImmunizations = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlImmunizationName = `<ImmunizationName>${
    jsObj.ImmunizationName ?? ""
  }</ImmunizationName>`;
  const xmlImmunizationType = `<ImmunizationType>${
    jsObj.ImmunizationType ?? ""
  }</ImmunizationType>`;
  const xmlManufacturer = `<Manufacturer>${
    jsObj.Manufacturer ?? ""
  }</Manufacturer>`;
  const xmlLotNumber = `<LotNumber>${jsObj.LotNumber ?? ""}</LotNumber>`;
  const xmlRoute = `<Route>${jsObj.Route ?? ""}</Route>`;
  const xmlSite = `<Site>${jsObj.Site ?? ""}</Site>`;
  const xmlDose = `<Dose>${jsObj.Dose ?? ""}</Dose>`;
  const xmlImmunizationCode = `<ImmunizationCode><cdsd:CodingSystem>${
    jsObj.ImmunizationCode?.CodingSystem ?? ""
  }</cdsd:CodingSystem><cdsd:value>${
    jsObj.ImmunizationCode?.value ?? ""
  }</cdsd:value><cdsd:Description>${
    jsObj.ImmunizationCode?.Description ?? ""
  }</cdsd:Description></ImmunizationCode>`;
  const xmlDate = `<Date><cdsd:FullDate>${toLocalDate(
    jsObj.Date
  )}</cdsd:FullDate>
  </Date>`;
  const xmlRefused = `<RefusedFlag>
    <cdsd:ynIndicatorsimple>${
      jsObj.RefusedFlag?.ynIndicatorsimple ?? ""
    }</cdsd:ynIndicatorsimple>
  </RefusedFlag>`;
  const xmlInstructions = `<Instructions>${
    jsObj.Instructions ?? ""
  }</Instructions>`;
  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;

  const xmlImmunizations =
    "<Immunizations>" +
    xmlResidual +
    xmlImmunizationName +
    xmlImmunizationType +
    xmlManufacturer +
    xmlLotNumber +
    xmlRoute +
    xmlSite +
    xmlDose +
    xmlImmunizationCode +
    xmlDate +
    xmlRefused +
    xmlInstructions +
    xmlNotes +
    "</Immunizations>";

  return xmlFormat(xmlImmunizations, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlLabResults = (jsObj, patientInfos = null) => {
  return "";
};

export const toXmlAppointments = (jsObj, patientInfos = null) => {
  const xmlTime = `<AppointmentTime>${
    jsObj.AppointmentTime ?? ""
  }</AppointmentTime>`;
  const xmlDuration = `<Duration>${jsObj.Duration ?? ""}</Duration>`;
  const xmlStatus = `<AppointmentStatus>${
    jsObj.AppointmentStatus ?? ""
  }</AppointmentStatus>`;
  const xmlDate = `<AppointmentDate><cdsd:FullDate>${jsObj.AppointmentDate}</cdsd:FullDate></AppointmentDate>`;
  const xmlProvider = `<Provider>
  <Name>
    <cdsd:FirstName>${jsObj.Provider?.Name.FirstName ?? ""}</cdsd:FirstName>
    <cdsd:LastName>${jsObj.Provider?.Name.LastName ?? ""}</cdsd:LastName>
  </Name>
  <OHIPPhysicianId>${jsObj.Provider?.OHIPPhysicianId ?? ""}</OHIPPhysicianId>
  </Provider>`;
  const xmlPurpose = `<AppointmentPurpose>${
    jsObj.AppointmentPurpose ?? ""
  }</AppointmentPurpose>`;
  const xmlNotes = `<AppointmentNotes>${
    jsObj.AppointmentNotes ?? ""
  }</AppointmentNotes>`;

  const xmlAppointments =
    "<Appointments>" +
    xmlTime +
    xmlDuration +
    xmlStatus +
    xmlDate +
    xmlProvider +
    xmlPurpose +
    xmlNotes +
    "</Appointments>";

  return xmlFormat(xmlAppointments, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlClinicalNotes = (jsObj, patientInfos = null) => {
  const xmlNoteType = `<NoteType>${jsObj.NoteType ?? ""}</NoteType>`;
  const xmlContent = `<MyClinicalNotesContent>${
    jsObj.MyClinicalNotesContent ?? ""
  }</MyClinicalNotesContent>`;
  const xmlEventDateTime = `<EventDateTime><cdsd:FullDate>${toLocalDate(
    jsObj.EventDateTime
  )}</cdsd:FullDate></EventDateTime>`;
  const xmlParticipatingProviders =
    jsObj.ParticipatingProviders?.length > 0
      ? jsObj.ParticipatingProviders.map(
          (provider) =>
            `<ParticipatingProviders>
      <Name>
        <cdsd:FirstName>${provider.Name?.FirstName ?? ""}</cdsd:FirstName>
        <cdsd:LastName>${provider.Name?.LastName ?? ""}</cdsd:LastName>
      </Name>
      <OHIPPhysicianId>
      ${provider.OHIPPhysicianId ?? ""}
      </OHIPPhysicianId>
      <DateTimeNoteCreated>
        <cdsd:FullDateTime>${
          provider.DateTimeNoteCreated
            ? new Date(provider.DateTimeNoteCreated).toISOString()
            : ""
        }
        </cdsd:FullDateTime>
      </DateTimeNoteCreated>
    </ParticipatingProviders>`
        ).join("")
      : "";
  const xmlReviewer =
    jsObj.NoteReviewer?.length > 0
      ? jsObj.NoteReviewer.map(
          (provider) =>
            `<NoteReviewer>
  <Name>
    <cdsd:FirstName>${provider.Name?.FirstName ?? ""}</cdsd:FirstName>
    <cdsd:LastName>${provider.Name?.LastName ?? ""}</cdsd:LastName>
  </Name>
  <OHIPPhysicianId>
  ${provider.OHIPPhysicianId ?? ""}
  </OHIPPhysicianId>
  <DateTimeNoteReviewed>
    <cdsd:FullDateTime>${
      provider.DateTimeNoteCreated
        ? new Date(provider.DateTimeNoteCreated).toISOString()
        : ""
    }
    </cdsd:FullDateTime>
  </DateTimeNoteReviewed>
</NoteReviewer>`
        ).join("")
      : "";

  const xmlClinicalNotes =
    "<ClinicalNotes>" +
    xmlNoteType +
    xmlContent +
    xmlEventDateTime +
    xmlParticipatingProviders +
    xmlReviewer +
    "</ClinicalNotes>";

  return xmlFormat(xmlClinicalNotes, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlReports = (jsObj, patientInfos = null) => {
  const xmlMedia = `<Media>${jsObj.Media ?? ""}</Media>`;
  const xmlForm = `<Format>${jsObj.Format ?? ""}</Format>`;
  const xmlFileExtAndVer = `<FileExtensionAndVersion>${
    jsObj.FileExtensionAndVersion ?? ""
  }</FileExtensionAndVersion>`;
  const xmlFilePath = jsObj.File
    ? `<FilePath>./Reports_files/${jsObj.File.name}
    </FilePath>`
    : "";
  const xmlContent = `<Content>
  ${
    jsObj.Content.Media
      ? `<cdsd:Media>${jsObj.Content.Media}</cdsd:Media>`
      : `<cdsd:TextContent>${
          jsObj.Content?.TextContent ?? ""
        }</cdsd:TextContent>`
  }
  </Content>`;
  const xmlClass = `<Class>${jsObj.Class ?? ""}</Class>`;
  const xmlSubClass = `<SubClass>${jsObj.SubClass ?? ""}</SubClass>`;
  const xmlEventDateTime = `<EventDateTime><cdsd:FullDate>${toLocalDate(
    jsObj.EventDateTime
  )}</cdsd:FullDate></EventDateTime>`;
  const xmlReceivedDateTime = `<ReceivedDateTime><cdsd:FullDate>${toLocalDate(
    jsObj.ReceivedDateTime
  )}</cdsd:FullDate></ReceivedDateTime>`;
  const xmlSourceAuthor = `<SourceAuthorPhysician>
  ${
    jsObj.SourceAuthorPhysician?.AuthorFreeText
      ? `<AuthorFreeText>
   ${jsObj.SourceAuthorPhysician?.AuthorFreeText}
  </AuthorFreeText>`
      : `<AuthorName>
  <cdsd:FirstName>${
    jsObj.SourceAuthorPhysician?.AuthorName?.FirstName ?? ""
  }</cdsd:FirstName>
  <cdsd:LastName>${
    jsObj.SourceAuthorPhysician?.AuthorName?.LastName ?? ""
  }</cdsd:LastName>
  </AuthorName>`
  }
  </SourceAuthorPhysician>`;
  const xmlSourceFacility = `<SourceFacility>${
    jsObj.SourceFacility ?? ""
  }</SourceFacility>`;
  const xmlReportReviewed =
    jsObj.ReportReviewed?.length > 0
      ? jsObj.ReportReviewed.map(
          (item) =>
            `<ReportReviewed>
      <Name>
        <cdsd:FirstName>
        ${item.Name?.FirstName ?? ""}
        </cdsd:FirstName>
        <cdsd:LastName>
        ${item.Name?.LastName ?? ""}
        </cdsd:LastName>
      </Name>
      <ReviewingOHIPPhysicianId>
        ${item.ReviewingOHIPPhysicianId ?? ""}
      </ReviewingOHIPPhysicianId>
      <DateTimeReportReviewed>
        <cdsd:FullDate>
          ${
            item.DateTimeReportReviewed
              ? toLocalDate(item.DateTimeReportReviewed)
              : ""
          }
        </cdsd:FullDate>
      </DateTimeReportReviewed>
    </ReportReviewed>`
        ).join("")
      : "";
  const xmlFacilityId = `<SendingFacilityId>
  ${jsObj.SendingFacilityId ?? ""}</SendingFacilityId>`;
  const xmlFacilityReport = `<SendingFacilityReport>
  ${jsObj.SendingFacilityReport ?? ""}</SendingFacilityReport>`;

  const xmlOBR =
    jsObj.OBRContent?.length > 0
      ? jsObj.OBRContent.length
          .map(
            (obr) =>
              `<OBRContent>
   <AccompanyingSubClass>
   ${obr.AccompanyingSubClass ?? ""}
   </AccompanyingSubClass>
   <AccompanyingMnemonic>
   ${obr.AccompanyingMnemonic ?? ""}
   </AccompanyingMnemonic>
   <AccompanyingDescription>
   ${obr.AccompanyingDescription ?? ""}
   </AccompanyingDescription>
   <ObservationDateTime>
        <cdsd:FullDateTime>
        ${
          obr.ObservationDateTime
            ? new Date(obr.ObservationDateTime).toISOString()
            : ""
        }
        </cdsd:FullDateTime>
   </ObservationDateTime>
  </OBRContent>`
          )
          .join("")
      : "";

  const xmlHRM = `<HRMResultStatus>${
    jsObj.HRMResultStatus ?? ""
  }</HRMResultStatus>`;

  const xmlMessageId = `<MessageUniqueID>${
    jsObj.MessageUniqueID ?? ""
  }</MessageUniqueID>`;

  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;

  const xmlRecipientName = `<RecipientName>
  <cdsd:FirstName>
  ${jsObj.RecipientName?.FirstName ?? ""}
  </cdsd:FirstName>
  <cdsd:LastName>
  ${jsObj.RecipientName?.LastName ?? ""}
  </cdsd:LastName>
  </RecipientName>`;

  const xmlSentDateTime = `<SentDateTime>
  <cdsd:FullDateTime>
  ${jsObj.SentDateTime ? new Date(jsObj.SentDateTime).toISOString() : ""}
  </cdsd:FullDateTime>
</SentDateTime>`;

  const xmlReports =
    "<Reports>" +
    xmlMedia +
    xmlForm +
    xmlFileExtAndVer +
    xmlFilePath +
    xmlContent +
    xmlClass +
    xmlSubClass +
    xmlEventDateTime +
    xmlReceivedDateTime +
    xmlSourceAuthor +
    xmlSourceFacility +
    xmlReportReviewed +
    xmlFacilityId +
    xmlFacilityReport +
    xmlOBR +
    xmlHRM +
    xmlMessageId +
    xmlNotes +
    xmlRecipientName +
    xmlSentDateTime +
    "</Reports>";

  return xmlFormat(xmlReports, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlCareElements = (jsObj, patientInfos = null) => {
  const xmlSmokingStatus =
    jsObj.SmokingStatus?.length > 0
      ? jsObj.SmokingStatus.map(
          (status) => `<SmokingStatus>
<cdsd:Status>
  ${status.Status ?? ""}
</cdsd:Status>
<cdsd:Date>
  ${toLocalDate(status.Date)}
</cdsd:Date>
</SmokingStatus>`
        ).join("")
      : "";

  const xmlSmokingPacks =
    jsObj.SmokingPacks?.length > 0
      ? jsObj.SmokingPacks.map(
          (packs) =>
            `<SmokingPacks>
  <cdsd:PerDay>${packs.PerDay ?? ""}</cdsd:PerDay>
  <cdsd:Date>${toLocalDate(packs.Date)}</cdsd:Date>
  </SmockingPacks>`
        ).join("")
      : "";

  const xmlWeight =
    jsObj.Weight?.length > 0
      ? jsObj.Weight.map(
          (weight) =>
            `<Weight>
      <cdsd:Weight>${weight.Weight ?? ""}</cdsd:Weight>
      <cdsd:WeightUnit>${weight.WeightUnit ?? ""}</cdsd:WeightUnit>
      <cdsd:Date>${toLocalDate(weight.Date)}</cdsd:Date>
    </Weight>`
        ).join("")
      : "";

  const xmlHeight =
    jsObj.Height?.length > 0
      ? jsObj.Height.map(
          (height) =>
            `<Height>
        <cdsd:Height>${height.Height ?? ""}</cdsd:Height>
        <cdsd:HeightUnit>${height.HeightUnit ?? ""}</cdsd:HeightUnit>
        <cdsd:Date>${toLocalDate(height.Date)}</cdsd:Date>
      </Height>`
        ).join("")
      : "";

  const xmlWaistCircumference =
    jsObj.WaistCircumference?.length > 0
      ? jsObj.WaistCircumference.map(
          (waist) =>
            `<WaistCircumference>
          <cdsd:WaistCircumference>${
            waist.WaistCircumference ?? ""
          }</cdsd:WaistCircumference>
          <cdsd:WaistCircumferenceUnit>${
            waist.WaistCircumferenceUnit ?? ""
          }</cdsd:WaistCircumferenceUnit>
          <cdsd:Date>${toLocalDate(waist.Date)}</cdsd:Date>
        </WaistCircumference>`
        ).join("")
      : "";

  const xmlBloodPressure =
    jsObj.BloodPressure?.length > 0
      ? jsObj.BloodPressure.map(
          (bp) => `<BloodPressure>
  <cdsd:SystolicBP>${bp.SystolicBP ?? ""}</cdsd:SystolicBP>
  <cdsd:DiastolicBP>${bp.DiastolicBP ?? ""}</cdsd:DiastolicBP>
  <cdsd:BPUnit>${bp.BPUnit ?? ""}</cdsd:BPUnit>
  <cdsd:Date>${toLocalDate(bp.Date)}</cdsd:Date>
  </BloodPressure>`
        ).join("")
      : "";

  const xmlDiabetesComplication =
    jsObj.DiabetesComplicationsScreening?.length > 0
      ? jsObj.DiabetesComplicationsScreening.map(
          (item) =>
            `<DiabetesComplicationsScreening>
      <cdsd:ExamCode>${item.ExamCode ?? ""}</cdsd:ExamCode>
      <cdsd:Date>${toLocalDate(item.Date)}</cdsd:Date>
    </DiabetesComplicationsScreening>`
        ).join("")
      : "";

  const xmlDiabetesMotivation =
    jsObj.DiabetesMotivationalCounselling?.length > 0
      ? jsObj.DiabetesMotivationalCounselling.map(
          (item) =>
            `<DiabetesMotivationalCounselling>
      <cdsd:CounsellingPerformed>${
        item.CounsellingPerformed ?? ""
      }</cdsd:CounsellingPerformed>
      <cdsd:Date>${toLocalDate(item.Date)}</cdsd:Date>
    </DiabetesMotivationalCounselling>`
        ).join("")
      : "";

  const xmlDiabetesSelfMgmtCollab =
    jsObj.DiabetesSelfManagementCollaborative?.length > 0
      ? jsObj.DiabetesSelfManagementCollaborative.map(
          (item) =>
            `<DiabetesSelfManagementCollaborative>
      <cdsd:CodeValue>${item.CodeValue ?? ""}</cdsd:CodeValue>
      <cdsd:DocumentedGoals>${item.DocumentedGoals ?? ""}</cdsd:DocumentedGoals>
      <cdsd:Date>${toLocalDate(item.Date)}</cdsd:Date>
    </DiabetesSelfManagementCollaborative>`
        ).join("")
      : "";

  const xmlDiabetesSelfMgmtChallenges =
    jsObj.DiabetesSelfManagementChallenges?.length > 0
      ? jsObj.DiabetesSelfManagementChallenges.map(
          (item) =>
            `<DiabetesSelfManagementChallenges>
      <cdsd:CodeValue>${item.CodeValue ?? ""}</cdsd:CodeValue>
      <cdsd:ChallengesIdentified>${
        item.ChallengesIdentified ?? ""
      }</cdsd:ChallengesIdentified>
      <cdsd:Date>${toLocalDate(item.Date)}</cdsd:Date>
    </DiabetesSelfManagementChallenges>`
        ).join("")
      : "";

  const xmlDiabetesEducSelfManagement =
    jsObj.DiabetesEducationalSelfManagement?.length > 0
      ? jsObj.DiabetesEducationalSelfManagement.map(
          (item) =>
            `<DiabetesEducationalSelfManagement>
      <cdsd:EducationalTrainingPerformed>${
        item.EducationalTrainingPerformed ?? ""
      }</cdsd:EducationalTrainingPerformed>
      <cdsd:Date>${toLocalDate(item.Date)}</cdsd:Date>
    </DiabetesEducationalSelfManagement>`
        ).join("")
      : "";

  const xmlHypoEpisodes =
    jsObj.HypoglycemicEpisodes?.length > 0
      ? jsObj.HypoglycemicEpisodes.map(
          (item) =>
            `<HypoglycemicEpisodes>
  <cdsd:NumOfReportedEpisodes>${
    item.NumOfReportedEpisodes ?? ""
  }</cdsd:NumOfReportedEpisodes>
  <cdsd:Date>${toLocalDate(item.Date)}</cdsd:Date>
</HypoglycemicEpisodes>`
        ).join("")
      : "";

  const xmlSelfMonitoring =
    jsObj.SelfMonitoringBloodGlucose?.length > 0
      ? jsObj.SelfMonitoringBloodGlucose.map(
          (item) =>
            `<SelfMonitoringBloodGlucose>
  <cdsd:SelfMonitoring>${item.SelfMonitoring ?? ""}</cdsd:SelfMonitoring>
  <cdsd:Date>${toLocalDate(item.Date)}</cdsd:Date>
</SelfMonitoringBloodGlucose>`
        ).join("")
      : "";

  const xmlCareElements =
    "<CareElements>" +
    xmlSmokingStatus +
    xmlSmokingPacks +
    xmlWeight +
    xmlHeight +
    xmlWaistCircumference +
    xmlBloodPressure +
    xmlDiabetesComplication +
    xmlDiabetesMotivation +
    xmlDiabetesSelfMgmtCollab +
    xmlDiabetesSelfMgmtChallenges +
    xmlDiabetesEducSelfManagement +
    xmlHypoEpisodes +
    xmlSelfMonitoring +
    "</CareElements>";

  return xmlFormat(xmlCareElements, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlAlerts = (jsObj, patientInfos = null) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataType ?? ""}</cdsd:DataType>
  <cdsd:Content>${dataElement.Content ?? ""}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlDescription = `<AlertDescription>${
    jsObj.AlertDescription ?? ""
  }</AlertDescription>`;

  const xmlNotes = `<Notes>${jsObj.Notes ?? ""}</Notes>`;

  const xmlDateActive = `<DateActive><cdsd:FullDate>${toLocalDate(
    jsObj.DateActive
  )}</cdsd:FullDate></DateActive>`;

  const xmlEndDate = `<EndDate><cdsd:FullDate>${toLocalDate(
    jsObj.EndDate
  )}</cdsd:FullDate></EndDate>`;

  const xmlAlerts =
    "<AlertsAndSpecialNeeds>" +
    xmlResidual +
    xmlDescription +
    xmlNotes +
    xmlDateActive +
    xmlEndDate +
    "</AlertsAndSpecialNeeds>";

  return xmlFormat(xmlAlerts, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlPregnancies = (jsObj, patientInfos = null) => {
  const xmlPregnancies = `<NewCategory>
<CategoryName>Pregnancies</CategoryName>
<CategoryDescription>Encompasses data collected from the patient's pregnancy events</CategoryDescription>
 <ResidualInfo>
${
  jsObj.description
    ? `<cdsd:DataElement>
<cdsd:Name>Description</cdsd:Name>
<cdsd:DataType>text</cdsd:DataType>
<cdsd:Content>${jsObj.description ?? ""}</cdsd:Content>
</cdsd:DataElement>`
    : ""
}
${
  jsObj.date_of_event
    ? `<cdsd:DataElement>
<cdsd:Name>EventDate</cdsd:Name>
<cdsd:DataType>date</cdsd:DataType>
<cdsd:Content>${toLocalDate(jsObj.date_of_event)}</cdsd:Content>
</cdsd:DataElement>`
    : ""
}
${
  jsObj.premises
    ? `<cdsd:DataElement>
<cdsd:Name>Premises</cdsd:Name>
<cdsd:DataType>text</cdsd:DataType>
<cdsd:Content>${jsObj.premises}</cdsd:Content>
</cdsd:DataElement>`
    : ""
}
${
  jsObj.term_nbr_of_weeks
    ? `<cdsd:DataElement>
<cdsd:Name>TermNumberOfWeeks</cdsd:Name>
<cdsd:DataType>number</cdsd:DataType>
<cdsd:Content>${jsObj.term_nbr_of_weeks ?? ""}</cdsd:Content>
</cdsd:DataElement>`
    : ""
}
${
  jsObj.term_nbr_of_days
    ? `<cdsd:DataElement><cdsd:Name>TermNumberOfDays</cdsd:Name><cdsd:DataType>number</cdsd:DataType><cdsd:Content>${jsObj.term_nbr_of_days}</cdsd:Content></cdsd:DataElement>`
    : ""
}
</ResidualInfo>
</NewCategory>`;

  return xmlFormat(xmlPregnancies, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlRelationships = (jsObj, patientInfos = null) => {
  const xmlRelationships = `<NewCategory>
  <CategoryName>Relationships</CategoryName>
  <CategoryDescription>Contains data about the patient’s relationships</CategoryDescription>
   <ResidualInfo>
   ${
     jsObj.relationship
       ? `<cdsd:DataElement>
      <cdsd:Name>RelationType</cdsd:Name>
      <cdsd:DataType>text</cdsd:DataType>
      <cdsd:Content>${jsObj.relationship} of</cdsd:Content>
    </cdsd:DataElement>`
       : ""
   }
    ${
      jsObj.relation_id
        ? `<cdsd:DataElement>
      <cdsd:Name>RelationName</cdsd:Name>
      <cdsd:DataType>text</cdsd:DataType>
      <cdsd:Content>${toPatientName(patientInfos)}</cdsd:Content>
    </cdsd:DataElement>`
        : ""
    }
  </ResidualInfo>
  </NewCategory>`;

  return xmlFormat(xmlRelationships, {
    collapseContent: true,
    indentation: "  ",
  });
};
