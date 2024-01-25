import React from "react";
import { Combobox } from "react-widgets/cjs";

const GenericCombo = ({ list, value, handleChange, placeHolder }) => {
  return (
    <Combobox
      placeholder={placeHolder}
      value={list.find(({ code }) => code === value)?.name || value}
      onChange={(value) => handleChange(value)}
      data={list.map(({ name }) => name)}
    />
    // <select value={value} name={name} onChange={handleChange}>
    //   <option value="" disabled>
    //     {placeHolder}
    //   </option>
    //   {noneOption && <option value="">(None)</option>}
    //   {list.map((item) => (
    //     <option value={item.code} key={item.code}>
    //       {item.name}
    //     </option>
    //   ))}
    // </select>
  );
};

export default GenericCombo;
