export const toInverseRelation = (relation, gender) => {
  switch (relation) {
    case "Aunt - maternal":
      return gender === "Female" || gender === "Other"
        ? "Niece - maternal"
        : "Nephew - maternal";
    case "Aunt - paternal":
      return gender === "Female" || gender === "Other"
        ? "Niece - paternal"
        : "Nephew - paternal";
    case "Boyfriend":
      return gender === "Female" || gender === "Other"
        ? "Girlfriend"
        : "Boyfriend";
    case "Brother":
      return gender === "Female" || gender === "Other" ? "Sister" : "Brother";
    case "Cousin - maternal":
      return "Cousin - maternal";
    case "Cousin - paternal":
      return "Cousin - paternal";
    case "Daughter":
      return gender === "Female" || gender === "Other" ? "Mother" : "Father";
    case "Father":
      return gender === "Female" || gender === "Other" ? "Daughter" : "Son";
    case "Friend":
      return "Friend";
    case "Girlfriend":
      return gender === "Female" || gender === "Other"
        ? "Girlfriend"
        : "Boyfriend";
    case "Granddaughter - maternal":
      return gender === "Female" || gender === "Other"
        ? "Grandmother - maternal"
        : "Grandfather - maternal";
    case "Granddaughter - paternal":
      return gender === "Female" || gender === "Other"
        ? "Grandmother - paternal"
        : "Grandfather - paternal";
    case "Grandson - maternal":
      return gender === "Female" || gender === "Other"
        ? "Grandmother - maternal"
        : "Grandfather - maternal";
    case "Grandson - paternal":
      return gender === "Female" || gender === "Other"
        ? "Grandmother - paternal"
        : "Grandfather - paternal";
    case "Half-brother":
      return gender === "Female" || gender === "Other"
        ? "Half-sister"
        : "Half-brother";
    case "Half-sister":
      return gender === "Female" || gender === "Other"
        ? "Half-sister"
        : "Half-brother";
    case "Husband":
      return gender === "Female" || gender === "Other" ? "Wife" : "Husband";
    case "Mother":
      return gender === "Female" || gender === "Other" ? "Daughter" : "Son";
    case "Nephew - maternal":
      return gender === "Female" || gender === "Other"
        ? "Aunt - maternal"
        : "Uncle - maternal";
    case "Nephew - paternal":
      return gender === "Female" || gender === "Other"
        ? "Aunt - paternal"
        : "Uncle - paternal";
    case "Niece - maternal":
      return gender === "Female" || gender === "Other"
        ? "Aunt - maternal"
        : "Uncle - maternal";
    case "Niece - paternal":
      return gender === "Female" || gender === "Other"
        ? "Aunt - paternal"
        : "Uncle - paternal";
    case "Sister":
      return gender === "Female" || gender === "Other" ? "Sister" : "Brother";
    case "Son":
      return gender === "Female" || gender === "Other" ? "Mother" : "Father";
    case "Uncle - maternal":
      return gender === "Female" || gender === "Other"
        ? "Niece - maternal"
        : "Nephew - maternal";
    case "Uncle - paternal":
      return gender === "Female" || gender === "Other"
        ? "Niece - paternal"
        : "Nephew - paternal";
    case "Wife":
      return gender === "Female" || gender === "Other" ? "Wife" : "Husband";
    default:
      return "Undefined";
  }
};
