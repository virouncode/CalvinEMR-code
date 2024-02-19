export const isUpdated = (data) => {
  if (!data.updates) {
    return false;
  } else if (data.updates.length === 0) {
    return false;
  } else {
    return true;
  }
};

export const getLastUpdate = (data) => {
  if (!isUpdated(data)) {
    return;
  } else {
    return data.updates.sort((a, b) => b.date_updated - a.date_updated)[0];
  }
};

export const sortByDate = (array, order) => {
  if (order === "asc") {
    return array.sort(
      (a, b) =>
        (isUpdated(a) ? getLastUpdate(a).date_updated : a.date_created) -
        (isUpdated(b) ? getLastUpdate(b).date_updated : b.date_created)
    );
  } else {
    return array.sort(
      (a, b) =>
        (isUpdated(b) ? getLastUpdate(b).date_updated : b.date_created) -
        (isUpdated(a) ? getLastUpdate(a).date_updated : a.date_created)
    );
  }
};
