const xanoGet = async (
  url,
  axiosXanoInstance,
  authToken,
  queryParam = null,
  queryValue = null,
  abortController = null
) => {
  const finalUrl = queryParam ? `${url}?${queryParam}=${queryValue}` : url;
  try {
    return await axiosXanoInstance.get(finalUrl, {
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

export default xanoGet;
