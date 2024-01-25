import xmlFormat from "xml-formatter";
import { toLocalDate } from "../formatDates";

export const toXmlDemographics = (jsObj) => {
  console.log("toXmlDemographics");
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
          ? jsObj.Names?.LegalName?.OtherName.map(
              (otherName) =>
                `<cdsd:OtherName>
            <cdsd:Part>${otherName.Part ?? ""}</cdsd:Part>
            <cdsd:PartType>${otherName.PartType ?? ""}</cdsd:PartType>
            <cdsd:PartQualifier>${
              otherName.PartQualifier ?? ""
            }</cdsd:PartQualifier>
          </cdsd:OtherName>`
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
          ? item.OtherName.map(
              (otherName) => `<cdsd:OtherName>
      <cdsd:Part>${otherName.Part ?? ""}</cdsd:Part>
      <cdsd:PartType>${otherName.PartType ?? ""}</cdsd:PartType>
      <cdsd:PartQualifier>${otherName.PartQualifier ?? ""}</cdsd:PartQualifier>
    </cdsd:OtherName>`
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
          <cdsd:PostalCode>${
            address.Structured?.PostalZipCode?.PostalCode ?? ""
          }</cdsd:PostalCode>
          <cdsd:ZipCode>${
            address.Structured?.PostalZipCode?.ZipCode ?? ""
          }</cdsd:ZipCode>
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
      <cdsd:phoneNumber>${item.phoneNumber ?? ""}</cdsd:phoneNumber>
      <cdsd:extension>${item.extension ?? ""}</cdsd:extension>
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
    jsObj.Contact.length > 0
      ? jsObj.Contact.map(
          (contact) =>
            `<Contact>
        <ContactPurpose>
          <cdsd:PurposeAsEnum>${
            contact.ContactPurpose?.PurposeAsEnum ?? ""
          }</cdsd:PurposeAsEnum>
          <cdsd:PurposeAsPlainText>${
            contact.ContactPurpose?.PurposeAsPlainText ?? ""
          }</cdsd:PurposeAsPlainText>
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
            <cdsd:phoneNumber>${item.phoneNumber ?? ""}</cdsd:phoneNumber>
            <cdsd:extension>${item.extension ?? ""}</cdsd:extension>
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
        jsObj.Enrolment.EnrolmentHistory.length > 0
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
        <PersonStatusAsEnum>${
          jsObj.PersonStatusCode?.PersonStatusAsEnum ?? ""
        }</PersonStatusAsEnum>
        <PersonStatusAsPlainText>${
          jsObj.PersonStatusCode?.PersonStatusAsPlainText ?? ""
        }</PersonStatusAsPlainText>
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
          <cdsd:PostalCode>${
            jsObj.PreferredPharmacy?.Address?.Structured?.PostalZipCode
              ?.PostalCode ?? ""
          }</cdsd:PostalCode>
          <cdsd:ZipCode>${
            jsObj.PreferredPharmacy?.Address?.Structured?.PostalZipCode
              ?.ZipCode ?? ""
          }</cdsd:ZipCode>
        </cdsd:PostalZipCode>
      </cdsd:Structured>
    </Address>
    ${
      jsObj.PreferredPharmacy?.PhoneNumber?.length > 0
        ? jsObj.PreferredPharmacy.PhoneNumber.map(
            (item) =>
              `<PhoneNumber phoneNumberType=${item._phoneNumberType}>
        <cdsd:phoneNumber>${item.phoneNumber ?? ""}</cdsd:phoneNumber>
        <cdsd:extension>${item.extension ?? ""}</cdsd:extension></PhoneNumber>`
          ).join("")
        : ""
    }
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

export const toXmlFamHistory = (jsObj) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo.DataElement.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataTYpe ?? ""}</cdsd:DataType>
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

export const toXmlPastHealth = (jsObj) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo.DataElement.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataTYpe ?? ""}</cdsd:DataType>
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

export const toXmlProblemList = (jsObj) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo.DataElement.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataTYpe ?? ""}</cdsd:DataType>
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

export const toXmlRiskFactors = (jsObj) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo.DataElement.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataTYpe ?? ""}</cdsd:DataType>
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

export const toXmlAllergies = (jsObj) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo.DataElement.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataTYpe ?? ""}</cdsd:DataType>
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

export const toXmlMedications = (jsObj) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo.DataElement.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataTYpe ?? ""}</cdsd:DataType>
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

export const toXmlImmunizations = (jsObj) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo.DataElement.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${dataElement.Name ?? ""}</cdsd:Name>
  <cdsd:DataType>${dataElement.DataTYpe ?? ""}</cdsd:DataType>
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

export const toXmlLabResults = (jsObj) => {
  return "";
};

export const toXmlAppointments = (jsObj) => {
  const xmlTime = `<AppointmentTime>${
    jsObj.AppointmentTime ?? ""
  }</AppointmentTime>`;
  const xmlDuration = `<Duration>${jsObj.Duration ?? ""}</Duration>`;
  const xmlStatus = `<AppointmentStatus>${
    jsObj.AppointmentStatus ?? ""
  }</AppointmentStatus>`;
  const xmlDate = `<AppointmentDate><cdsd:FullDate>${toLocalDate(
    jsObj.AppointmentDate
  )}</cdsd:FullDate></AppointmentDate>`;
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
