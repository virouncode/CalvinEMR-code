import React, { useRef, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import BillingTableItem from "./BillingTableItem";

const BillingTable = ({ billings, setBillings, setErrMsg, filterDatas }) => {
  const { user } = useAuth();
  const direction = useRef(false);
  const [columnToSort, setColumnToSort] = useState("date_created");
  const filteredBillings = billings.filter(
    (billing) =>
      billing.date_created >= Date.parse(new Date(filterDatas.date_start)) &&
      billing.date_created <= Date.parse(new Date(filterDatas.date_end))
  );

  const handleSort = (columnName) => {
    direction.current = !direction.current;
    setColumnToSort(columnName);
    setBillings([...billings]);
  };

  return (
    <table className="billing-table">
      <thead>
        <tr>
          <th onClick={() => handleSort("date_created")}>Date</th>
          <th
            style={
              user.title === "Secretary"
                ? { textDecoration: "underline", cursor: "pointer" }
                : { textDecoration: "none", cursor: "default" }
            }
            onClick={
              user.title === "Secretary"
                ? () => handleSort("provider_id")
                : null
            }
          >
            Provider OHIP#
          </th>
          <th onClick={() => handleSort("referrer_ohip_billing_nbr")}>
            Referring MD OHIP#
          </th>
          <th onClick={() => handleSort("patient_id")}>Patient SIN</th>
          <th onClick={() => handleSort("diagnosis_id")}>Diagnosis code</th>
          <th onClick={() => handleSort("billing_code_id")}>Billing code</th>
          <th style={{ textDecoration: "none", cursor: "default" }}>
            Provider fee
          </th>
          <th style={{ textDecoration: "none", cursor: "default" }}>
            Assistant fee
          </th>
          <th style={{ textDecoration: "none", cursor: "default" }}>
            Specialist fee
          </th>
          <th style={{ textDecoration: "none", cursor: "default" }}>
            Anaesthetist fee
          </th>
          <th style={{ textDecoration: "none", cursor: "default" }}>
            Non-anaesthetist fee
          </th>
          {user.title !== "Secretary" && (
            <th style={{ textDecoration: "none", cursor: "default" }}>
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {direction.current
          ? filteredBillings
              .sort((a, b) =>
                a[columnToSort]
                  ?.toString()
                  .localeCompare(b[columnToSort]?.toString())
              )
              .map((billing) => (
                <BillingTableItem
                  key={billing.id}
                  billing={billing}
                  setBillings={setBillings}
                  setErrMsg={setErrMsg}
                />
              ))
          : filteredBillings
              .sort((a, b) =>
                b[columnToSort]
                  ?.toString()
                  .localeCompare(a[columnToSort]?.toString())
              )
              .map((billing) => (
                <BillingTableItem
                  key={billing.id}
                  billing={billing}
                  setBillings={setBillings}
                  setErrMsg={setErrMsg}
                />
              ))}
      </tbody>
    </table>
  );
};

export default BillingTable;
