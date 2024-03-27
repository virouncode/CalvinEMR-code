export const toggleMultiplesClasses = (el, ...cls) =>
  cls.map((cl) => el.classList.toggle(cl));
