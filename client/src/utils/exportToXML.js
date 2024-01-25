import axios from "axios";

export const exportToXML = (jsonToExport, xmlFileName) => {
  axios.post("/api/exportToXML", { jsonToExport, xmlFileName });
};
