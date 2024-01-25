export const patientIdToName = (
  demographicsInfos,
  patientId,
  prefixAndSuffix = false
) => {
  if (!patientId) return "";
  const patientInfo = demographicsInfos.find(
    ({ patient_id }) => patient_id === patientId
  );
  if (patientInfo) {
    const prefix = patientInfo.Names.NamePrefix
      ? `${patientInfo.Names.NamePrefix}`
      : "";
    const firstName = ` ${patientInfo.Names.LegalName.FirstName.Part}`;
    const lastName = ` ${patientInfo.Names.LegalName.LastName.Part}`;
    const middleName = patientInfo.Names.LegalName.OtherName.length
      ? patientInfo.Names.LegalName.OtherName[0].Part
        ? ` ${patientInfo.Names.LegalName.OtherName[0].Part}`
        : ""
      : "";
    const suffix = patientInfo.Names.LastNameSuffix
      ? ` ${patientInfo.Names.LastNameSuffix}`
      : "";

    const fullName = prefixAndSuffix
      ? prefix + firstName + middleName + lastName + suffix
      : firstName + middleName + lastName;
    return fullName;
  } else {
    return "";
  }
};
export const patientIdToFirstName = (demographicsInfos, patientId) => {
  if (!patientId) return "";
  const patientInfo = demographicsInfos.find(
    ({ patient_id }) => patient_id === patientId
  );
  if (patientInfo) {
    return patientInfo.Names.LegalName.FirstName.Part;
  } else {
    return "";
  }
};
export const patientIdToLastName = (demographicsInfos, patientId) => {
  if (!patientId) return "";
  const patientInfo = demographicsInfos.find(
    ({ patient_id }) => patient_id === patientId
  );
  if (patientInfo) {
    return patientInfo.Names.LegalName.LastName.Part;
  } else {
    return "";
  }
};
export const patientIdToMiddleName = (demographicsInfos, patientId) => {
  if (!patientId) return "";
  const patientInfo = demographicsInfos.find(
    ({ patient_id }) => patient_id === patientId
  );
  if (patientInfo) {
    if (patientInfo.Names.LegalName?.OtherNames.length) {
      return patientInfo.Names.LegalName.OtherNames[0].OtherName?.Part
        ? patientInfo.Names.LegalName.OtherNames[0].OtherName?.Part
        : "";
    }
  } else {
    return "";
  }
};
