import React from "react";
import useAuth from "../../../hooks/useAuth";
import BillingTableItem from "./BillingTableItem";

const BillingTable = ({ billings, setBillings, setErrMsg, filterDatas }) => {
  const { user } = useAuth();
  const filteredBillings = billings.filter(
    (billing) =>
      billing.date_created >= Date.parse(new Date(filterDatas.date_start)) &&
      billing.date_created <= Date.parse(new Date(filterDatas.date_end))
  );

  return (
    <table className="billing-table">
      <thead>
        <tr>
          <th>Date</th>
          <th
            style={
              user.title === "Secretary"
                ? { textDecoration: "underline", cursor: "pointer" }
                : { textDecoration: "none", cursor: "default" }
            }
          >
            Provider OHIP#
          </th>
          <th>Referring MD OHIP#</th>
          <th>Patient SIN</th>
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
        {filteredBillings.map((billing) => (
          <BillingTableItem
            key={billing.id}
            billing={billing}
            setBillings={setBillings}
            setErrMsg={setErrMsg}
          />
        ))}
      </tbody>
      <tfoot>
        <tr
          tr
          className="billing-table__item"
          style={{ border: "solid 2px orange" }}
        >
          <td colspan="6" style={{ fontWeight: "bold", border: "none" }}>
            Total fees
          </td>
          <td style={{ border: "none" }}>
            {filteredBillings
              .map(({ billing_code }) => billing_code.provider_fee / 10000)
              .reduce((acc, current) => {
                return acc + current;
              })}{" "}
            $
          </td>
          <td td style={{ border: "none" }}>
            {filteredBillings
              .map(({ billing_code }) => billing_code.assistant_fee / 10000)
              .reduce((acc, current) => {
                return acc + current;
              })}{" "}
            $
          </td>
          <td td style={{ border: "none" }}>
            {filteredBillings
              .map(({ billing_code }) => billing_code.specialist_fee / 10000)
              .reduce((acc, current) => {
                return acc + current;
              })}{" "}
            $
          </td>
          <td td style={{ border: "none" }}>
            {filteredBillings
              .map(({ billing_code }) => billing_code.anaesthetist_fee / 10000)
              .reduce((acc, current) => {
                return acc + current;
              })}{" "}
            $
          </td>
          <td td style={{ border: "none" }}>
            {filteredBillings
              .map(
                ({ billing_code }) => billing_code.non_anaesthetist_fee / 10000
              )
              .reduce((acc, current) => {
                return acc + current;
              })}{" "}
            $
          </td>
          <td colspan="6" style={{ fontWeight: "bold", border: "none" }}>
            Number of billings: {filteredBillings.length}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default BillingTable;
