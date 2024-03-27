export const toPatientName = (patientInfos, formatted = true) => {
  if (!patientInfos) return "";
  const firstName = patientInfos.Names?.LegalName?.FirstName?.Part || "";
  const lastName = `${patientInfos.Names?.LegalName?.LastName?.Part || ""}`;
  const middleName = patientInfos.Names?.LegalName?.OtherName?.[0]?.Part
    ? ` ${patientInfos.Names?.LegalName?.OtherName?.[0]?.Part}`
    : "";
  const title =
    patientInfos.Gender === "M"
      ? "Mr. "
      : patientInfos.Gender === "F"
      ? "Mrs. "
      : "";
  return formatted
    ? title + lastName + ", " + firstName + middleName
    : title + firstName + middleName + " " + lastName;
};

export const toPatientFirstName = (patientInfos) => {
  if (!patientInfos) return "";
  const firstName = patientInfos.Names?.LegalName?.FirstName?.Part || "";

  return firstName;
};

export const toPatientMiddleName = (patientInfos) => {
  if (!patientInfos) return "";
  const middleName = patientInfos.Names?.LegalName?.OtherName?.[0]?.Part
    ? ` ${patientInfos.Names?.LegalName?.OtherName?.[0]?.Part}`
    : "";
  return middleName;
};

export const toPatientLastName = (patientInfos) => {
  if (!patientInfos) return "";
  const lastName = ` ${patientInfos.Names?.LegalName?.LastName?.Part || ""}`;
  return lastName;
};
