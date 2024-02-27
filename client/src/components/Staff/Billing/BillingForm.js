import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoGet";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useFetchDatas from "../../../hooks/useFetchDatas";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { toLocalDate } from "../../../utils/formatDates";
import { staffIdToOHIP } from "../../../utils/staffIdToName";
import { toPatientName } from "../../../utils/toPatientName";
import { billingFormSchema } from "../../../validation/billingValidation";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import SelectSite from "../EventForm/SelectSite";
import DiagnosisSearch from "./DiagnosisSearch";
import PatientChartHealthSearch from "./PatientChartHealthSearch";
import ReferringOHIPSearch from "./ReferringOHIPSearch";

const BillingForm = ({ setAddVisible, setErrMsgPost }) => {
  const navigate = useNavigate();
  const { pid, pName, hcn, date } = useParams();
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const [sites] = useFetchDatas("/sites", axiosXanoStaff, auth.authToken);

  const [formDatas, setFormDatas] = useState({
    date: toLocalDate(Date.now()),
    provider_ohip_billing_nbr: staffIdToOHIP(staffInfos, user.id),
    referrer_ohip_billing_nbr: "",
    patient_id: 0,
    patient_hcn: "",
    patient_name: "",
    diagnosis_code: "",
    billing_codes: [],
    site_id: user.site_id,
  });
  const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);

  useEffect(() => {
    if (date) {
      setFormDatas({
        ...formDatas,
        patient_hcn: hcn || "",
        patient_id: parseInt(pid) || "",
        patient_name: pName || "",
        date: toLocalDate(Date.parse(new Date(parseInt(date)))),
      });
      navigate("/staff/billing");
    }
  }, [date, formDatas, hcn, navigate, pName, pid]);

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "billing_codes") {
      value = value.split(",").map((billing_code) => billing_code.trim());
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSiteChange = (e) => {
    const value = e.target.value;
    setFormDatas({ ...formDatas, site_id: value });
  };
  const handleClickDiagnosis = (e, code) => {
    setErrMsgPost("");
    setFormDatas({ ...formDatas, diagnosis_code: code });
    setDiagnosisSearchVisible(false);
  };
  const handleClickPatient = (e, item) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      patient_id: item.patient_id,
      patient_name: toPatientName(item),
      patient_hcn: item.HealthCard?.Number || "",
    });
    setPatientSearchVisible(false);
  };
  const handleClickRefOHIP = (e, ohip) => {
    setErrMsgPost("");
    setFormDatas({ ...formDatas, referrer_ohip_billing_nbr: ohip.toString() });
    setRefOHIPSearchVisible(false);
  };
  const handleCancel = (e) => {
    setErrMsgPost("");
    setAddVisible(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await billingFormSchema.validate({
        ...formDatas,
        billing_codes: formDatas.billing_codes.join(","),
      });
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (
      (
        await axiosXanoStaff.get(
          `/diagnosis_codes_for_code?code=${formDatas.diagnosis_code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data === null
    ) {
      setErrMsgPost("There is no existing diagnosis with this code");
      return;
    }
    for (const billing_code of formDatas.billing_codes) {
      const response = await axiosXanoStaff.get(
        `/ohip_fee_schedule_for_code?billing_code=${billing_code}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );

      if (response.data === null) {
        setErrMsgPost(`Billing code ${billing_code} doesn't exists`);
        return;
      }
    }

    //Submission
    try {
      setProgress(true);
      for (const billing_code of formDatas.billing_codes) {
        const datasToPost = {
          date: Date.parse(new Date(formDatas.date)),
          date_created: Date.now(),
          provider_id: user.id,
          referrer_ohip_billing_nbr: parseInt(
            formDatas.referrer_ohip_billing_nbr
          ),
          patient_id: formDatas.patient_id,
          diagnosis_id: (
            await xanoGet(
              `/diagnosis_codes_for_code`,
              axiosXanoStaff,
              auth.authToken,
              "code",
              formDatas.diagnosis_code
            )
          ).data.id,
          billing_code_id: (
            await xanoGet(
              `/ohip_fee_schedule_for_code`,
              axiosXanoStaff,
              auth.authToken,
              "billing_code",
              billing_code
            )
          ).data.id,
          site_id: formDatas.site_id,
        };
        const response = await axiosXanoStaff.post("/billings", datasToPost, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        socket.emit("message", {
          route: "BILLING",
          action: "create",
          content: { data: response.data },
        });
      }
      setAddVisible(false);
      toast.success(`Billing(s) saved successfully`, { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Can't save billing(s): ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };
  return (
    <form className="billing-form" onSubmit={handleSubmit}>
      <div className="billing-form__title">Add a new billing</div>
      <div className="billing-form__row">
        <div className="billing-form__item">
          <label htmlFor="">Date*</label>
          <input
            type="date"
            value={formDatas.date}
            name="date"
            onChange={handleChange}
          />
        </div>
        <div className="billing-form__item">
          <label htmlFor="">Provider OHIP#*</label>
          <input
            type="text"
            value={formDatas.provider_ohip_billing_nbr.toString()}
            name="provider_ohip_billing_nbr"
            readOnly
            style={{ textAlign: "end" }}
          />
        </div>
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="">Referring MD OHIP#</label>
          <input
            type="text"
            value={formDatas.referrer_ohip_billing_nbr}
            name="referrer_ohip_billing_nbr"
            onChange={handleChange}
            autoComplete="off"
            autoFocus
          />
          <i
            style={{ cursor: "pointer", position: "absolute", right: "5px" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setRefOHIPSearchVisible(true)}
          ></i>
        </div>
      </div>
      <div className="billing-form__row">
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="">Patient Health Card#</label>
          <input
            type="text"
            value={formDatas.patient_hcn}
            name="patient_hcn"
            onChange={handleChange}
            autoComplete="off"
            readOnly
          />
          <i
            style={{ cursor: "pointer", position: "absolute", right: "5px" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setPatientSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="">Diagnosis code*</label>
          <input
            type="text"
            value={formDatas.diagnosis_code}
            name="diagnosis_code"
            onChange={handleChange}
            autoComplete="off"
          />
          <i
            style={{ cursor: "pointer", position: "absolute", right: "5px" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setDiagnosisSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-form__item">
          <label htmlFor="">Billing code(s)*</label>
          <input
            type="text"
            placeholder="A001,B423,F404,..."
            value={
              formDatas.billing_codes.length > 0
                ? formDatas.billing_codes.join(",")
                : ""
            }
            name="billing_codes"
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="billing-form__row">
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="">Patient Name*</label>
          <input
            type="text"
            value={formDatas.patient_name}
            name="patient_id"
            readOnly
          />
          <i
            style={{ cursor: "pointer", position: "absolute", right: "5px" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setPatientSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-form__item">
          <SelectSite
            handleSiteChange={handleSiteChange}
            sites={sites}
            value={formDatas.site_id}
          />
        </div>
      </div>
      <div className="billing-form__btns">
        <input type="submit" disabled={progress} />
        <button onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
      </div>
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
      )}
      {refOHIPSearchVisible && (
        <FakeWindow
          title="REFERRING MD OHIP# SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setRefOHIPSearchVisible}
        >
          <ReferringOHIPSearch handleClickRefOHIP={handleClickRefOHIP} />
        </FakeWindow>
      )}
      {patientSearchVisible && (
        <FakeWindow
          title="PATIENT SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setPatientSearchVisible}
        >
          <PatientChartHealthSearch handleClickPatient={handleClickPatient} />
        </FakeWindow>
      )}
    </form>
  );
};

export default BillingForm;
