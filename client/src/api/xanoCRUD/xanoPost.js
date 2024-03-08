import axios from "axios";

const xanoPost = async (url, userType, data, abortController = null) => {
  try {
    const config = {
      url: "/xano",
      method: "post",
      data,
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

export default xanoPost;
