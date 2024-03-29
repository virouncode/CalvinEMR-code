import axios from "axios";

const xanoPostReset = async (
  url,
  userType,
  tempToken,
  data,
  abortController = null
) => {
  try {
    const config = {
      url: "/xano/reset",
      method: "post",
      data,
      params: {
        url,
        userType,
        tempToken,
      },
    };
    if (abortController) config.signal = abortController.signal;
    return await axios(config);
  } catch (err) {
    throw err;
  }
};

export default xanoPostReset;
