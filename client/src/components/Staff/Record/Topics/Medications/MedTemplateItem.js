import React from "react";
import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  routeCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";

const MedTemplateItem = ({ med, body, setBody }) => {
  const instruction = `\n\n- ${med.DrugName}, ${med.Dosage} ${
    toCodeTableName(dosageUnitCT, med.DosageUnitOfMeasure) ||
    med.DosageUnitOfMeasure
  } ${toCodeTableName(formCT, med.Form) || med.Form}, ${
    med.SubstitutionNotAllowed === "Y" ? "Substitution not allowed" : ""
  }, ${toCodeTableName(routeCT, med.Route) || med.Route}, ${
    toCodeTableName(frequencyCT, med.Frequency) || med.Frequency
  }, during ${med.Duration}`;
  const handleClickMed = (e) => {
    setBody(body + instruction);
  };

  return (
    <li className="prescription__templates-item" onClick={handleClickMed}>
      {instruction}
    </li>
  );
};

export default MedTemplateItem;
