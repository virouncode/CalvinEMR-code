export const getImmunizationLogo = (type) => {
  let logo = "";
  switch (type) {
    case "IM":
      logo = "\u25C6";
      break;
    case "IM/SC":
      logo = `\u25C6/\u25A0`;
      break;
    case "SC":
      logo = "\u25A0";
      break;
    case "ORL":
      logo = "\u25B2";
      break;
    default:
      break;
  }
  return logo;
};

//diamond U25C6
//square U25A0
//triangle 25B2
//circle 25CF
