export const getResidualInfo = (name, datas) => {
  return (
    datas.ResidualInfo.DataElement.find(({ Name }) => Name === name)?.Content ||
    ""
  );
};
