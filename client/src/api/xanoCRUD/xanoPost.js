const xanoPost = async (
  url,
  axiosXanoInstance,
  authToken,
  data,
  abortController = null
) => {
  try {
    return await axiosXanoInstance.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
  } catch (err) {
    throw err;
  }
};

export default xanoPost;
