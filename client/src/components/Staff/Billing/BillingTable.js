import React from "react";
import BillingTableItem from "./BillingTableItem";

const BillingTable = ({ billings, errMsg, setErrMsg }) => {
  return (
    <table className="billing-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Provider OHIP#</th>
          <th>Referring MD OHIP#</th>
          <th>Patient Health Card#</th>
          <th>Patient name</th>
          <th>Diagnosis code</th>
          <th>Billing code</th>
          <th>Provider fee</th>
          <th>Assistant fee</th>
          <th>Specialist fee</th>
          <th>Anaesthetist fee</th>
          <th>Non-anaesthetist fee</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {billings.map((billing) => (
          <BillingTableItem
            key={billing.id}
            billing={billing}
            errMsg={errMsg}
            setErrMsg={setErrMsg}
          />
        ))}
      </tbody>
      <tfoot>
        <tr
          className="billing-table__item"
          style={{ border: "solid 2px orange" }}
        >
          <td colSpan="7" style={{ fontWeight: "bold", border: "none" }}>
            Total fees
          </td>
          <td style={{ border: "none" }}>
            {Math.round(
              billings
                .map(({ billing_code }) => billing_code.provider_fee / 10000)
                .reduce((acc, current) => {
                  return acc + current;
                }, 0) * 100
            ) / 100}{" "}
            $
          </td>
          <td style={{ border: "none" }}>
            {Math.round(
              billings
                .map(({ billing_code }) => billing_code.assistant_fee / 10000)
                .reduce((acc, current) => {
                  return acc + current;
                }, 0) * 100
            ) / 100}{" "}
            $
          </td>
          <td style={{ border: "none" }}>
            {Math.round(
              billings
                .map(({ billing_code }) => billing_code.specialist_fee / 10000)
                .reduce((acc, current) => {
                  return acc + current;
                }, 0) * 100
            ) / 100}{" "}
            $
          </td>
          <td style={{ border: "none" }}>
            {Math.round(
              billings
                .map(
                  ({ billing_code }) => billing_code.anaesthetist_fee / 10000
                )
                .reduce((acc, current) => {
                  return acc + current;
                }, 0) * 100
            ) / 100}{" "}
            $
          </td>
          <td style={{ border: "none" }}>
            {Math.round(
              billings
                .map(
                  ({ billing_code }) =>
                    billing_code.non_anaesthetist_fee / 10000
                )
                .reduce((acc, current) => {
                  return acc + current;
                }, 0) * 100
            ) / 100}{" "}
            $
          </td>
          <td style={{ fontWeight: "bold", border: "none" }}>
            Nbr of billings: {billings.length}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default BillingTable;
