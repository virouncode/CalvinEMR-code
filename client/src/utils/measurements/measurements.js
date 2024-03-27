export const bodyMassIndex = (heightCm, weightKg) => {
  if (!heightCm || !weightKg) return "";
  return (
    Math.round(
      (parseFloat(weightKg) /
        ((parseFloat(heightCm) / 100) * (parseFloat(heightCm) / 100))) *
        10
    ) / 10
  );
};

export const bodySurfaceArea = (heightCm, weightKg) => {
  if (!heightCm || !weightKg) return "";
  return (
    Math.round(
      0.007184 *
        Math.pow(parseFloat(heightCm), 0.725) *
        Math.pow(parseFloat(weightKg), 0.425) *
        10
    ) / 10
  );
};

export const kgToLbs = (weightKg) => {
  if (!weightKg) return "";
  return Math.round(parseFloat(weightKg) * 2.205 * 10) / 10;
};

export const lbsToKg = (weightLbs) => {
  if (!weightLbs) return "";
  return Math.round(parseFloat(weightLbs) / 2.205);
};

export const cmToFeet = (heightCm) => {
  if (!heightCm) return "";
  return Math.round((parseFloat(heightCm) / 30.48) * 10) / 10;
};

export const feetToCm = (heightFeet) => {
  if (!heightFeet) return "";
  return Math.round(parseFloat(heightFeet) * 30.48);
};
