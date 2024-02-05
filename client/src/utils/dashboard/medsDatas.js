export const getTop5Meds = (allmeds) => {
  const counts = {};
  for (let med of allmeds) {
    counts[med.DrugName] = (counts[med.DrugName] || 0) + 1;
  }
  // Convert counts object to an array of objects
  const countsArray = Object.entries(counts).map(([item, count]) => ({
    item,
    count,
  }));

  // Sort the array based on count in descending order
  countsArray.sort((a, b) => b.count - a.count);

  // Get the top 5 items
  return countsArray.slice(0, 5);
};
