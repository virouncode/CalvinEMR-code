import React from "react";
import { Combobox } from "react-widgets/cjs";

const pregnancyEvents = [
  "Abortion - 1st trimester",
  "Abortion - 2nd trimester",
  "Abortion - 3rd trimester",
  "Miscarriage - 1st trimester",
  "Second trimester fetal loss",
  "Third trimester fetal loss",
  "Intra-uterine fetal death",
  "Ectopic pregnancy",
  "Vaginal birth",
  "Vaginal birth - forceps",
  "Vaginal birth - vacuum",
  "Cesarean section",
];

const PregnanciesList = ({ value, handleChange }) => {
  return (
    <Combobox
      placeholder="Choose or type an event..."
      value={pregnancyEvents.find((event) => event === value) || value}
      onChange={(value) => handleChange(value)}
      data={pregnancyEvents}
    />
  );
};

export default PregnanciesList;
