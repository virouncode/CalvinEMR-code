import axios from "axios";

const xanoGet = async (
  url,
  userType,
  params = null,
  abortController = null
) => {
  try {
    const config = {
      url: "/xano",
      method: "get",
      params: {
        url,
        userType,
      },
    };
    if (abortController) config.signal = abortController.signal;
    if (params) config.params.params = params;
    return await axios(config);
  } catch (err) {
    throw err;
  }
};

export default xanoGet;
