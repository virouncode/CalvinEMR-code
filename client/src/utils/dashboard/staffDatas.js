export const getNbrOfStaff = (staffInfos) => {
  return staffInfos.length;
};

export const getNbrOfActiveStaff = (staffInfos) => {
  return staffInfos.filter(({ account_status }) => account_status === "Active")
    .length;
};

export const getNbrOfStaffGender = (staffInfos, gender) => {
  return staffInfos.filter(({ Gender }) => Gender === gender).length;
};

export const getNbrOfNewStaff = (staffInfos, since) => {
  return staffInfos.filter(({ date_created }) => date_created >= since).length;
};
