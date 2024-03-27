import axios from "axios";

export const extractToText = async (docUrl, mime) => {
  const response = await axios.post("/extractToText", { docUrl, mime });
  return response.data;
};
