import React, { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import useAuthContext from "../../../hooks/useAuthContext";
import { toLocalDate } from "../../../utils/formatDates";
import { toExportCSVName } from "../../../utils/toExportCSVName";

const BillingFilter = ({
  billings,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
}) => {
  const { user, clinic } = useAuthContext();
  const initialRangeStart = useRef(rangeStart);
  const initialRangeEnd = useRef(rangeEnd);
  const [all, setAll] = useState(false);
  const csvDatas = billings.map((billing) => {
    return {
      ...billing,
      date: toLocalDate(billing.date),
      billing_code: {
        ...billing.billing_code,
        provider_fee: billing.billing_code.provider_fee / 10000,
        specialist_fee: billing.billing_code.specialist_fee / 10000,
        assistant_fee: billing.billing_code.assistant_fee / 10000,
        anaesthetist_fee: billing.billing_code.anaesthetist_fee / 10000,
        non_anaesthetist_fee: billing.billing_code.non_anaesthetist_fee / 10000,
      },
    };
  });
  const headers = [
    { label: "Date", key: "date" },
    {
      label: "Provider OHIP#",
      key: "provider_ohip_billing_nbr.ohip_billing_nbr",
    },
    { label: "Referring MD OHIP#", key: "referrer_ohip_billing_nbr" },
    { label: "Patient Health Card#", key: "patient_hcn" },
    { label: "Diagnosis code", key: "diagnosis_code.code" },
    { label: "Billing code", key: "billing_code.billing_code" },
    { label: "Provider fee ($)", key: "billing_code.provider_fee" },
    { label: "Specialist fee ($)", key: "billing_code.specialist_fee" },
    { label: "Assistant fee ($)", key: "billing_code.assistant_fee" },
    { label: "Anaesthetist fee ($)", key: "billing_code.anaesthetist_fee" },
    {
      label: "Non anaesthetist fee ($)",
      key: "billing_code.non_anaesthetist_fee",
    },
  ];

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setAll(true);
      setRangeStart(Date.parse(new Date("1970-01-01")));
      setRangeEnd(Date.parse(new Date("3000-01-01")));
    } else {
      setAll(false);
      setRangeStart(initialRangeStart.current);
      setRangeEnd(initialRangeEnd.current);
    }
  };

  const handleDateChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "date_start") {
      if (value === "") {
        value = "1970-01-01";
      }
      initialRangeStart.current = Date.parse(new Date(value));
      setRangeStart(Date.parse(new Date(value)));
    }
    if (name === "date_end") {
      if (value === "") {
        value = "3000-01-01";
      }
      initialRangeEnd.current = Date.parse(new Date(value));
      setRangeEnd(Date.parse(new Date(value)));
    }
  };

  return (
    <div className="billing-filter">
      <div className="billing-filter__row">
        <div className="billing-filter__title">Filter</div>
        <div className="billing-filter__item">
          <label htmlFor="">From</label>
          <input
            type="date"
            value={toLocalDate(rangeStart)}
            name="date_start"
            onChange={handleDateChange}
            disabled={all}
          />
        </div>
        <div className="billing-filter__item">
          <label htmlFor="">To</label>
          <input
            type="date"
            value={toLocalDate(rangeEnd)}
            name="date_end"
            onChange={handleDateChange}
            disabled={all}
          />
        </div>
        <div className="billing-filter__item">
          <input
            type="checkbox"
            value={all}
            name="all"
            onChange={handleCheckAll}
          />
          <label htmlFor="">All</label>
        </div>
        <div className="billing-filter__btn-container">
          <button>
            <CSVLink
              data={csvDatas}
              filename={toExportCSVName(
                user.access_level,
                user.title || "",
                rangeStart,
                rangeEnd,
                all,
                clinic.staffInfos,
                user.id
              )}
              target="_blank"
              headers={headers}
              style={{ color: "#FEFEFE" }}
            >
              Export to CSV
            </CSVLink>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingFilter;
