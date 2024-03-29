import React, { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { toExportCSVName } from "../../../utils/files/toExportCSVName";

const BillingFilter = ({
  billings,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  paging,
  setPaging,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const initialRangeStart = useRef(rangeStart);
  const initialRangeEnd = useRef(rangeEnd);
  const [all, setAll] = useState(false);
  const headers = [
    { label: "Date", key: "date" },
    {
      label: "Provider OHIP#",
      key: "provider_ohip_billing_nbr.ohip_billing_nbr",
    },
    { label: "Referring MD OHIP#", key: "referrer_ohip_billing_nbr" },
    { label: "Patient Health Card#", key: "patient_infos.HealthCard.Number" },
    { label: "Diagnosis code", key: "diagnosis_code.code" },
    { label: "Billing code", key: "billing_infos.billing_code" },
    { label: "Provider fee ($)", key: "billing_infos.provider_fee" },
    { label: "Specialist fee ($)", key: "billing_infos.specialist_fee" },
    { label: "Assistant fee ($)", key: "billing_infos.assistant_fee" },
    { label: "Anaesthetist fee ($)", key: "billing_infos.anaesthetist_fee" },
    {
      label: "Non anaesthetist fee ($)",
      key: "billing_infos.non_anaesthetist_fee",
    },
  ];

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setAll(true);
      setRangeStart(dateISOToTimestampTZ("1970-01-01"));
      setRangeEnd(dateISOToTimestampTZ("3000-01-01"));
      setPaging({ ...paging, page: 1 });
    } else {
      setAll(false);
      setRangeStart(initialRangeStart.current);
      setRangeEnd(initialRangeEnd.current);
      setPaging({ ...paging, page: 1 });
    }
  };

  const handleDateChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    setPaging({ ...paging, page: 1 });
    if (name === "date_start") {
      if (value === "") {
        value = "1970-01-01";
      }
      initialRangeStart.current = dateISOToTimestampTZ(value);
      setRangeStart(dateISOToTimestampTZ(value));
    }
    if (name === "date_end") {
      if (value === "") {
        value = "3000-01-01";
      }
      initialRangeEnd.current = dateISOToTimestampTZ(value);
      setRangeEnd(dateISOToTimestampTZ(value));
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
            value={timestampToDateISOTZ(rangeStart, "America/Toronto")}
            name="date_start"
            onChange={handleDateChange}
            disabled={all}
          />
        </div>
        <div className="billing-filter__item">
          <label htmlFor="">To</label>
          <input
            type="date"
            value={timestampToDateISOTZ(rangeEnd, "America/Toronto")}
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
              data={billings}
              filename={toExportCSVName(
                user.access_level,
                user.title || "",
                rangeStart,
                rangeEnd,
                all,
                staffInfos,
                user.id
              )}
              // target="_blank"
              headers={headers}
              style={{ color: "#3D375A" }}
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
