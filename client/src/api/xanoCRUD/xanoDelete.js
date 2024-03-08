import axios from "axios";

const xanoDelete = async (url, userType, abortController) => {
  try {
    const config = {
      url: "/api/xano",
      method: "delete",
      params: {
        url,
        userType,
        abortController,
      },
    };
    return await axios(config);
  } catch (err) {
    throw err;
  }
};

export default xanoDelete;
