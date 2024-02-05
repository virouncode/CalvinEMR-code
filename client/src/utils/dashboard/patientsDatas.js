export const getNbrOfPatients = (patientsInfos) => {
  return patientsInfos.length;
};

export const getNbrOfActivePatients = (patientsInfos) => {
  return patientsInfos.filter(
    ({ account_status }) => account_status === "Activated"
  ).length;
};

export const getNbrOfPatientGender = (demographicsInfos, gender) => {
  return demographicsInfos.filter(({ Gender }) => Gender === gender).length;
};

export const getNbrOfNewPatients = (patientsInfos, since) => {
  return patientsInfos.filter(({ date_created }) => date_created >= since)
    .length;
};
