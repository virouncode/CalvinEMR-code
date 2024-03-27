import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  routeCT,
  strengthUnitCT,
  toCodeTableName,
} from "../../omdDatas/codesTables";

export const toPrescriptionInstructions = (
  drugName,
  strength,
  strengthUnit,
  substitution,
  quantity,
  form,
  route,
  dosage,
  dosageUnit,
  frequency,
  duration,
  numberOfRefills,
  refillQuantity,
  refillDuration
) => {
  const medicament = drugName.toUpperCase() || "";
  const force = strength ? ` ${strength}` : "";
  const forceUnit = strengthUnit
    ? ` ${toCodeTableName(strengthUnitCT, strengthUnit) || strengthUnit}`
    : "";
  const forme = form ? ` (${toCodeTableName(formCT, form) || form})` : "";
  const quantite = quantity ? `, ${quantity}` : "";
  const sub = substitution === "Y" ? `, Substitution not allowed` : "";
  const dose = dosage ? `Take ${dosage}` : "";
  const doseUnit = dosageUnit
    ? ` ${toCodeTableName(dosageUnitCT, dosageUnit) || dosageUnit}`
    : "";
  const voie = route ? `, ${toCodeTableName(routeCT, route) || route}` : "";
  const frequence = frequency
    ? `, ${toCodeTableName(frequencyCT, frequency) || frequency}`
    : "";
  const duree = duration ? `, during ${duration}` : "";
  const refillNombre = numberOfRefills
    ? `Number of refills: ${numberOfRefills} - `
    : "";
  const refillQuantite = refillQuantity
    ? `Refill quantity: ${refillQuantity} - `
    : "";
  const refillDuree =
    refillQuantity && refillDuration ? ` during ${refillDuration}` : "";

  return (
    medicament +
    force +
    forceUnit +
    forme +
    quantite +
    sub +
    "\n" +
    dose +
    doseUnit +
    voie +
    frequence +
    duree +
    "\n" +
    refillNombre +
    refillQuantite +
    refillDuree
  );
};
