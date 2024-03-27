export const categoryToTitle = (category) => {
  switch (category) {
    case "Doctors":
      return "Doctor";
    case "Medical Students":
      return "Medical Student";
    case "Nurses":
      return "Nurse";
    case "Nursing Students":
      return "Nursing Student";
    case "Secretaries":
      return "Secretary";
    case "Ultra Sound Techs":
      return "Ultra Sound Technician";
    case "Lab Techs":
      return "Lab Technician";
    case "Nutritionists":
      return "Nutritionist";
    case "Physiotherapists":
      return "Physiotherapist";
    case "Psychologists":
      return "Psychologist";
    case "Others":
      return "Other";
    default:
      break;
  }
};
