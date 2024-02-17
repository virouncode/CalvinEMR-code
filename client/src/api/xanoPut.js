const xanoPut = async (
  url,
  axiosXanoInstance,
  authToken,
  datasToPut,
  idToPut,
  abortController = null
) => {
  const finalUrl = `${url}/${parseInt(idToPut)}`;
  try {
    return await axiosXanoInstance.put(finalUrl, datasToPut, {
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

export default xanoPut;
