const xanoGet = async (
  url,
  axiosXanoInstance,
  authToken,
  params = null,
  abortController = null
) => {
  try {
    return await axiosXanoInstance.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      params,
      ...(abortController && { signal: abortController.signal }),
    });
  } catch (err) {
    throw err;
  }
};

export default xanoGet;
