const xanoPost = async (
  url,
  axiosXanoInstance,
  authToken = null,
  data,
  abortController = null
) => {
  const headers = {
    "Content-Type": "application/json",
  };
  authToken && (headers.Authorization = `Bearer ${authToken}`);
  try {
    return await axiosXanoInstance.post(url, data, {
      headers,
      ...(abortController && { signal: abortController.signal }),
    });
  } catch (err) {
    throw err;
  }
};

export default xanoPost;
