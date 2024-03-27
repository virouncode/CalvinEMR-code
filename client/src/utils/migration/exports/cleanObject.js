import { timestampToDateISOTZ } from "./formatDates";

var _ = require("lodash");

// export const cleanObject = (obj) => {
//   // console.log(Object.keys(obj));
//   for (let key of Object.keys(obj)) {
//     // console.log(typeof obj[key]);
//     if (!isObject(obj[key])) {
//       //Si la clé n'est pas un objet
//       if (Array.isArray(obj[key])) {
//         //C'est un tableau
//         //si la clé est un tableau
//         if (obj[key].length === 0) {
//           delete obj[key];
//         } else {
//           for (let item of obj[key]) {
//             cleanObject(item);
//           }
//         }
//       } else if (!obj[key]) {
//         //c'est pas un tableau
//         //et la valeur est nulle
//         delete obj[key]; //on retire la clé
//       } else if (key.includes("Date") || key.includes("date")) {
//         obj[key] = timestampToDateISOTZ(obj[key]);
//       }
//     } else if (isObject(obj[key])) {
//       //si la clé est un objet
//       if (_.isEmpty(obj[key])) {
//         //objet vide
//         delete obj[key];
//       } else {
//         //sinon
//         cleanObject(obj[key]); //On recommence
//       }
//     }
//   }
// };

export const cleanObject = (objet) => {
  for (const cle in objet) {
    if (objet.hasOwnProperty(cle)) {
      if (!objet[cle]) {
        delete objet[cle];
      } else if (cle.includes("Date") || cle.includes("date")) {
        objet[cle] = timestampToDateISOTZ(objet[cle]);
      } else if (typeof objet[cle] === "object") {
        cleanObject(objet[cle]);
        if (Object.keys(objet[cle]).length === 0) {
          delete objet[cle];
        }
      }
    }
  }
  return objet;
};
