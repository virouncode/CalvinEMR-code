import React, { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { toLocalDate } from "../../../utils/formatDates";

const BillingFilter = ({ filterDatas, setFilterDatas, billings }) => {
  // const { auth } = useAuth();
  // const [hinSearchVisible, setSinSearchVisible] = useState(false);
  // const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const initialFilterDatas = useRef(filterDatas);
  const [all, setAll] = useState(false);

  const filteredBillings = billings.filter(
    (billing) =>
      billing.date_created >= Date.parse(new Date(filterDatas.date_start)) &&
      billing.date_created <= Date.parse(new Date(filterDatas.date_end))
  );
  const csvDatas = filteredBillings.map((filteredBilling) => {
    return {
      ...filteredBilling,
      date: toLocalDate(filteredBilling.date),
      billing_code: {
        ...filteredBilling.billing_code,
        provider_fee: filteredBilling.billing_code.provider_fee / 10000,
        specialist_fee: filteredBilling.billing_code.specialist_fee / 10000,
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
    { label: "Patient SIN", key: "patient_sin.SIN" },
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
      setFilterDatas({ date_start: "1970-01-01", date_end: "3000-01-01" });
    } else {
      setAll(false);
      setFilterDatas({
        date_start: initialFilterDatas.current.date_start,
        date_end: initialFilterDatas.current.date_end,
      });
    }
  };
  const handleDateChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (value === "" && name === "date_start") {
      value = "1970-01-01";
    } else if (value === "" && name === "date_end") {
      value = "3000-01-01";
    }
    setFilterDatas({ ...filterDatas, [name]: value });
  };

  return (
    <div className="billing-filter">
      <div className="billing-filter__row">
        <div className="billing-filter__title">Filter</div>
        <div className="billing-filter__item">
          <label htmlFor="">From</label>
          <input
            type="date"
            value={filterDatas.date_start}
            name="date_start"
            onChange={handleDateChange}
            disabled={all}
          />
        </div>
        <div className="billing-filter__item">
          <label htmlFor="">To</label>
          <input
            type="date"
            value={filterDatas.date_end}
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
              filename={`Billings_${filterDatas.date_start}_${filterDatas.date_end}`}
              target="_blank"
              headers={headers}
              style={{ color: "#FEFEFE" }}
            >
              Export to CSV
            </CSVLink>
          </button>
        </div>

        {/* <div className="billing-filter-row-item">
          <label htmlFor="">Referrer OHIP nbr</label>
          <input
            type="text"
            value={filterDatas.ohip}
            name="ohip"
            onChange={handleChange}
          />
        </div> */}
      </div>
      {/* <div className="billing-filter-row">
        <div className="billing-filter-row-item">
          <label htmlFor="">Patient HIN</label>
          <input
            type="text"
            value={filterDatas.hin}
            name="hin"
            onChange={handleChange}
          />
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setSinSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-filter-row-item">
          <label htmlFor="">Diagnosis code</label>
          <input
            type="text"
            value={filterDatas.diagnosis}
            name="diagnosis"
            onChange={handleChange}
          />
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setDiagnosisSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-filter-row-item">
          <label htmlFor="">Billing Code</label>
          <input
            type="text"
            value={filterDatas.billing_code}
            name="billing_code"
            onChange={handleChange}
          />
        </div>
      </div>
      {hinSearchVisible && (
        <FakeWindow
          title="HEALTH INSURANCE NUMBER SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setSinSearchVisible}
        >
          <SinSearch handleClickHin={handleClickHin} />
        </FakeWindow>
      )}
      {diagnosisSearchVisible && (
        <FakeWindow
          title="DIAGNOSIS CODES SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setDiagnosisSearchVisible}
        >
          <DiagnosisSearch handleClickDiagnosis={handleClickDiagnosis} />
        </FakeWindow>
      )} */}
    </div>
  );
};

export default BillingFilter;
