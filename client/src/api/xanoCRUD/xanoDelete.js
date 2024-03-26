import axios from "axios";

const xanoDelete = async (url, userType, abortController = null) => {
  try {
    const config = {
      url: "/xano",
      method: "delete",
      params: {
        url,
        userType,
      },
    };
    if (abortController) config.signal = abortController.signal;
    return await axios(config);
  } catch (err) {
    throw err;
  }
};

export default xanoDelete;
