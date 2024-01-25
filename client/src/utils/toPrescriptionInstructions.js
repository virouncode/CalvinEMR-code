import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  routeCT,
  toCodeTableName,
} from "../datas/codesTables";

export const toPrescriptionInstructions = (
  drugName,
  form,
  route,
  dosage,
  dosageUnit,
  frequency,
  duration,
  substitution,
  quantity
) => {
  const medicament = drugName.toUpperCase() || "";
  const forme = form ? ` (${toCodeTableName(formCT, form) || form})` : "";
  const dose = dosage ? `, ${dosage}` : "";
  const unite = dosageUnit
    ? ` ${toCodeTableName(dosageUnitCT, dosageUnit) || dosageUnit}`
    : "";
  const frequence = frequency
    ? `, ${toCodeTableName(frequencyCT, frequency) || frequency}`
    : "";
  const voie = route ? `, ${toCodeTableName(routeCT, route) || route}` : "";
  const duree = duration ? `, during ${duration}` : "";
  const sub = substitution === "Y" ? `, Substitution not allowed` : "";
  const quantite = quantity ? `, ${quantity}` : "";

  return (
    medicament +
    forme +
    voie +
    dose +
    unite +
    frequence +
    duree +
    sub +
    quantite
  );
};
