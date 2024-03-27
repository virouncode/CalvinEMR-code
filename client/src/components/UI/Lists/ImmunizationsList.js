const ImmunizationsList = ({
  list,
  value,
  name,
  handleChange,
  placeHolder,
  noneOption = true,
}) => {
  return (
    <select value={value} name={name} onChange={handleChange}>
      <option value="" disabled>
        {placeHolder}
      </option>
      {noneOption && <option value="">(None)</option>}
      {list.map((item) => (
        <option value={item.code} key={item.code}>
          {item.code} ({item.name})
        </option>
      ))}
    </select>
  );
};

export default ImmunizationsList;
