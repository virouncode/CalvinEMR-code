import axios from "axios";

const xanoPut = async (url, userType, data, abortController = null) => {
  try {
    const config = {
      url: "/xano",
      method: "put",
      params: {
        url,
        userType,
      },
      data,
    };
    if (abortController) config.signal = abortController.signal;
    return await axios(config);
  } catch (err) {
    throw err;
  }
};

export default xanoPut;
