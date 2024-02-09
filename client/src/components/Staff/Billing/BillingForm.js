import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";
import { toLocalDate } from "../../../utils/formatDates";
import { patientIdToName } from "../../../utils/patientIdToName";
import { staffIdToOHIP } from "../../../utils/staffIdToName";
import { billingFormSchema } from "../../../validation/billingValidation";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import SelectSite from "../EventForm/SelectSite";
import DiagnosisSearch from "./DiagnosisSearch";
import HcnSearch from "./HcnSearch";
import PatientNameSearch from "./PatientNameSearch";
import ReferringOHIPSearch from "./ReferringOHIPSearch";

const BillingForm = ({ setAddVisible, setErrMsg }) => {
  const navigate = useNavigate();
  const { pid, hcn, date } = useParams();
  const { auth, user, clinic, socket } = useAuth();
  const [formDatas, setFormDatas] = useState({
    date: toLocalDate(Date.now()),
    provider_ohip_nbr: staffIdToOHIP(clinic.staffInfos, user.id),
    referrer_ohip_nbr: "",
    patient_hcn: "",
    diagnosis_code: "",
    billing_codes: [],
    patient_id: "",
    site_id: user.settings.site_id,
  });
  const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const [hcnSearchVisible, setHcnSearchVisible] = useState(false);
  const [patientNameSearchVisible, setPatientNameSearchVisible] =
    useState(false);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    if (date) {
      console.log(typeof pid, pid);
      setFormDatas({
        ...formDatas,
        patient_hcn: hcn || "",
        patient_id: parseInt(pid) || "",
        date: toLocalDate(Date.parse(new Date(parseInt(date)))),
      });
      navigate("/staff/billing");
    }
  }, [date, formDatas, hcn, navigate, pid]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchSites = async () => {
      try {
        const response = await axiosXanoStaff.get("/sites", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setSites(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        toast.error(`Error: unable to get clinic sites: ${err.message}`, {
          containerId: "A",
        });
      }
    };
    fetchSites();
    return () => abortController.abort();
  }, [auth.authToken]);

  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "billing_codes") {
      value = value.split(",").map((billing_code) => billing_code.trim());
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleChangeSite = (e) => {
    const value = e.target.value;
    setFormDatas({ ...formDatas, site_id: value });
  };
  const handleClickDiagnosis = (e, code) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, diagnosis_code: code });
    setDiagnosisSearchVisible(false);
  };
  const handleClickHcn = (e, hcn, patientId) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, patient_hcn: hcn, patient_id: patientId });
    setHcnSearchVisible(false);
  };
  const handleClickPatient = (e, patientId) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, patient_id: patientId });
    setPatientNameSearchVisible(false);
  };
  const handleClickRefOHIP = (e, ohip) => {
    setErrMsg("");
    setFormDatas({ ...formDatas, referrer_ohip_nbr: ohip.toString() });
    setRefOHIPSearchVisible(false);
  };
  const handleCancel = (e) => {
    setErrMsg("");
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
      setErrMsg(err.message);
      return;
    }
    if (formDatas.referrer_ohip_nbr.length !== 6) {
      setErrMsg("Referrer OHIP nbr field must be 6-digits");
      return;
    }
    if (formDatas.provider_ohip_nbr.length !== 6) {
      setErrMsg("Referrer OHIP nbr field must be 6-digits");
      return;
    }
    if (
      formDatas.patient_hcn &&
      !clinic.demographicsInfos.find(
        ({ HealthCard }) => HealthCard.Number === formDatas.patient_hcn
      )
    ) {
      setErrMsg(
        "There is no patient with this Health Card Number in the clinic's database"
      );
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
      setErrMsg("There is no existing diagnosis with this code");
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
        setErrMsg(`Billing code ${billing_code} doesn't exists`);
        return;
      }
    }

    //Submission
    try {
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
        const billing_code_id = response.data.id;
        const datasToPost = {
          date: Date.parse(new Date(formDatas.date)),
          date_created: Date.now(),
          provider_id: user.id,
          referrer_ohip_billing_nbr: parseInt(formDatas.referrer_ohip_nbr),
          patient_id: formDatas.patient_id,
          patient_hcn: formDatas.patient_hcn,
          diagnosis_id: (
            await axiosXanoStaff.get(
              `/diagnosis_codes_for_code?code=${formDatas.diagnosis_code}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.authToken}`,
                },
              }
            )
          ).data.id,
          billing_code_id,
          site_id: formDatas.site_id,
        };
        const response2 = await axiosXanoStaff.post("/billings", datasToPost, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        const feeSchedule = await axiosXanoStaff.get(
          `/ohip_fee_schedule/${response2.data.billing_code_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        const diagnosis = await axiosXanoStaff.get(
          `/diagnosis_codes/${response2.data.diagnosis_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        const datasToEmit = {
          ...response2.data,
          provider_ohip_billing_nbr: {
            ohip_billing_nbr: clinic.staffInfos.find(
              ({ id }) => id === response2.data.provider_id
            ).ohip_billing_nbr,
          },
          billing_code: {
            billing_code: feeSchedule.data.billing_code,
            provider_fee: feeSchedule.data.provider_fee,
            specialist_fee: feeSchedule.data.specialist_fee,
            assistant_fee: feeSchedule.data.assistant_fee,
            anaesthetist_fee: feeSchedule.data.anaesthetist_fee,
            non_anaesthetist_fee: feeSchedule.data.non_anaesthetist_fee,
          },
          diagnosis_code: {
            code: diagnosis.data.code,
          },
        };
        socket.emit("message", {
          route: "BILLING",
          action: "create",
          content: { data: datasToEmit },
        });
      }

      setAddVisible(false);
      toast.success(`Billing(s) saved successfully`, { containerId: "A" });
    } catch (err) {
      toast.error(`Can't save billing(s): ${err.message}`, {
        containerId: "A",
      });
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
            value={formDatas.provider_ohip_nbr.toString()}
            name="provider_ohip_nbr"
            readOnly
            style={{ textAlign: "end" }}
          />
        </div>
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="">Referring MD OHIP#</label>
          <input
            type="text"
            value={formDatas.referrer_ohip_nbr}
            name="referrer_ohip_nbr"
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
            // readOnly
            // style={{ width: "130px" }}
          />
          <i
            style={{ cursor: "pointer", position: "absolute", right: "5px" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setHcnSearchVisible(true)}
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
            value={patientIdToName(
              clinic.demographicsInfos,
              formDatas.patient_id
            )}
            name="patient_id"
            autoComplete="off"
            readOnly
            style={{ width: "200px" }}
          />
          <i
            style={{ cursor: "pointer", position: "absolute", right: "5px" }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setPatientNameSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-form__item">
          <SelectSite
            handleChangeSite={handleChangeSite}
            sites={sites}
            value={formDatas.site_id}
          />
        </div>
      </div>
      <div className="billing-form__btns">
        <input type="submit" />
        <button onClick={handleCancel}>Cancel</button>
      </div>
      {hcnSearchVisible && (
        <FakeWindow
          title="HEALTH CARD NUMBER SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setHcnSearchVisible}
        >
          <HcnSearch handleClickHcn={handleClickHcn} />
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
      {patientNameSearchVisible && (
        <FakeWindow
          title="PATIENT NAME SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setPatientNameSearchVisible}
        >
          <PatientNameSearch handleClickPatient={handleClickPatient} />
        </FakeWindow>
      )}
    </form>
  );
};

export default BillingForm;
