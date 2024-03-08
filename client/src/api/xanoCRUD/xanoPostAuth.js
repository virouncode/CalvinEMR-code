import axios from "axios";

const xanoPostAuth = async (url, userType, data) => {
  try {
    const config = {
      url: "/xano/auth",
      method: "post",
      data,
      params: {
        url,
        userType,
      },
    };
    return await axios(config);
  } catch (err) {
    throw err;
  }
};

export default xanoPostAuth;
