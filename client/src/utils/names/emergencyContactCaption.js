export const emergencyContactCaption = (emergencyContact) => {
  const firstName = emergencyContact?.Name?.FirstName
    ? `${emergencyContact?.Name?.FirstName}`
    : "";
  const middleName = emergencyContact?.Name?.MiddleName
    ? ` ${emergencyContact?.Name?.MiddleName}`
    : "";
  const lastName = emergencyContact?.Name?.LastName
    ? ` ${emergencyContact?.Name?.LastName}`
    : "";
  const email = emergencyContact?.EmailAddress
    ? `, ${emergencyContact?.EmailAddress}`
    : "";
  const phone = emergencyContact?.PhoneNumber?.length
    ? `, ${emergencyContact.PhoneNumber.map(
        ({ phoneNumber }) => phoneNumber
      ).join(", ")}`
    : "";

  return firstName + middleName + lastName + email + phone;
};
