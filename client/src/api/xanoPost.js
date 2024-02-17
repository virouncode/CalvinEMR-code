const xanoPost = async (
  url,
  axiosXanoInstance,
  authToken,
  datasToPost,
  abortController = null
) => {
  try {
    return await axiosXanoInstance.post(url, datasToPost, {
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
