import axios from "axios";

const xanoPut = async (url, userType, data, abortController = null) => {
  try {
    const config = {
      url: "/api/xano",
      method: "put",
      params: {
        url,
        userType,
        abortController,
      },
      data,
    };
    return await axios(config);
  } catch (err) {
    throw err;
  }
};

export default xanoPut;
