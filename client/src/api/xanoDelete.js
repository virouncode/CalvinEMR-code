const xanoDelete = async (
  url,
  axiosXanoInstance,
  authToken,
  idToDelete,
  abortController
) => {
  const finalUrl = `${url}/${parseInt(idToDelete)}`;
  try {
    return await axiosXanoInstance.delete(finalUrl, {
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

export default xanoDelete;
