export const getAge = (dateMs) => {
  if (!dateMs) return "";
  var today = new Date();
  var birthDate = new Date(dateMs);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
