import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import { toLocalDate } from "../../../utils/formatDates";
import { patientIdToName } from "../../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { billingItemSchema } from "../../../validation/billingValidation";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import DiagnosisSearch from "./DiagnosisSearch";
import SinSearch from "./HcnSearch";
import PatientNameSearch from "./PatientNameSearch";
import ReferringOHIPSearch from "./ReferringOHIPSearch";

const BillingTableItem = ({ billing, errMsg, setErrMsg }) => {
  const { auth, user, clinic, socket } = useAuthContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const [hcnSearchVisible, setHcnSearchVisible] = useState(false);
  const [patientNameSearchVisible, setPatientNameSearchVisible] =
    useState(false);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [isPuting, setIsPuting] = useState(false);

  useEffect(() => {
    setItemInfos({
      date: billing.date,
      date_created: billing.date_created,
      provider_ohip_nbr:
        billing.provider_ohip_billing_nbr.ohip_billing_nbr.toString(),
      referrer_ohip_nbr: billing.referrer_ohip_billing_nbr.toString(),
      patient_id: billing.patient_id,
      patient_hcn: billing.patient_hcn,
      diagnosis_code: billing.diagnosis_code.code.toString(),
      billing_code: billing.billing_code.billing_code,
    });
  }, [
    billing.billing_code.billing_code,
    billing.date,
    billing.date_created,
    billing.diagnosis_code.code,
    billing.patient_hcn,
    billing.patient_id,
    billing.provider_ohip_billing_nbr.ohip_billing_nbr,
    billing.referrer_ohip_billing_nbr,
  ]);

  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "date") value = Date.parse(new Date(value));
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleEditClick = () => {
    setErrMsg("");
    setEditVisible(true);
  };
  const handleClickDiagnosis = (e, code) => {
    setErrMsg("");
    setItemInfos({ ...itemInfos, diagnosis_code: code });
    setDiagnosisSearchVisible(false);
  };
  const handleClickHcn = (e, hcn, patientId) => {
    setErrMsg("");
    setItemInfos({ ...itemInfos, patient_hcn: hcn, patient_id: patientId });
    setHcnSearchVisible(false);
  };
  const handleClickPatient = (e, patientId) => {
    setErrMsg("");
    setItemInfos({ ...itemInfos, patient_id: patientId });
    setPatientNameSearchVisible(false);
  };
  const handleClickRefOHIP = (e, ohip) => {
    setErrMsg("");
    setItemInfos({ ...itemInfos, referrer_ohip_nbr: ohip.toString() });
    setRefOHIPSearchVisible(false);
  };

  const handleCancel = () => {
    setErrMsg("");
    setEditVisible(false);
  };

  const handleDuplicateClick = async () => {
    const datasToPost = {
      date: itemInfos.date,
      date_created: Date.now(),
      provider_id: billing.provider_id,
      referrer_ohip_billing_nbr: parseInt(itemInfos.referrer_ohip_nbr),
      patient_id: itemInfos.patient_id,
      patient_hcn: itemInfos.patient_hcn,
      diagnosis_id: (
        await axiosXanoStaff.get(
          `/diagnosis_codes_for_code?code=${itemInfos.diagnosis_code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data.id,
      billing_code_id: (
        await axiosXanoStaff.get(
          `/ohip_fee_schedule_for_code?billing_code=${itemInfos.billing_code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data.id,
    };
    delete datasToPost.id;
    try {
      const response = await axiosXanoStaff.post("/billings", datasToPost, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const feeSchedule = await axiosXanoStaff.get(
        `/ohip_fee_schedule/${datasToPost.billing_code_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const diagnosis = await axiosXanoStaff.get(
        `/diagnosis_codes/${datasToPost.diagnosis_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const datasToEmit = {
        ...response.data,
        provider_ohip_billing_nbr: {
          ohip_billing_nbr: clinic.staffInfos.find(
            ({ id }) => id === datasToPost.provider_id
          ).ohip_billing_nbr,
        },
        billing_code: {
          billing_code: feeSchedule.data.billing_code,
          provider_fee: feeSchedule.data.provider_fee,
          assistant_fee: feeSchedule.data.assistant_fee,
          specialist_fee: feeSchedule.data.specialist_fee,
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
      setEditVisible(false);
      toast.success(`Billing duplicated successfully`, { containerId: "A" });
    } catch (err) {
      toast.error(`Can't duplicate billing: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  const handleSubmit = async () => {
    //Validation
    try {
      await billingItemSchema.validate(itemInfos);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }

    // if (itemInfos.referrer_ohip_nbr.length !== 6) {
    //   setErrMsg("Referrer OHIP nbr field must be 6-digits");
    //   return;
    // }
    // if (itemInfos.provider_ohip_nbr.length !== 6) {
    //   setErrMsg("Referrer OHIP nbr field must be 6-digits");
    //   return;
    // }
    if (
      itemInfos.patient_hcn &&
      !clinic.demographicsInfos.find(
        ({ HealthCard }) => HealthCard.Number === itemInfos.patient_hcn
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
          `/diagnosis_codes_for_code?code=${itemInfos.diagnosis_code}`,
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
    if (itemInfos.billing_code.includes(",")) {
      setErrMsg("Please enter only one billing code");
      return;
    }
    const response = await axiosXanoStaff.get(
      `/ohip_fee_schedule_for_code?billing_code=${itemInfos.billing_code}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      }
    );

    if (response.data === null) {
      setErrMsg(`Billing code ${itemInfos.billing_code} doesn't exists`);
      return;
    }
    //Submission
    setIsPuting(true);
    const datasToPut = {
      date: itemInfos.date,
      provider_id: billing.provider_id,
      referrer_ohip_billing_nbr: parseInt(itemInfos.referrer_ohip_nbr),
      patient_id: itemInfos.patient_id,
      patient_hcn: itemInfos.patient_hcn,
      diagnosis_id: (
        await axiosXanoStaff.get(
          `/diagnosis_codes_for_code?code=${itemInfos.diagnosis_code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data.id,
      billing_code_id: (
        await axiosXanoStaff.get(
          `/ohip_fee_schedule_for_code?billing_code=${itemInfos.billing_code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data.id,
      updates: [
        ...billing.updates,
        {
          updated_by_id: user.id,
          date_updated: Date.now(),
          updated_by_user_type: "Staff",
        },
      ],
    };

    try {
      const response = await axiosXanoStaff.put(
        `/billings/${billing.id}`,
        datasToPut,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const feeSchedule = await axiosXanoStaff.get(
        `/ohip_fee_schedule/${datasToPut.billing_code_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const diagnosis = await axiosXanoStaff.get(
        `/diagnosis_codes/${datasToPut.diagnosis_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const datasToEmit = {
        ...response.data,
        provider_ohip_billing_nbr: {
          ohip_billing_nbr: clinic.staffInfos.find(
            ({ id }) => id === datasToPut.provider_id
          ).ohip_billing_nbr,
        },
        billing_code: {
          billing_code: feeSchedule.data.billing_code,
          provider_fee: feeSchedule.data.provider_fee,
          assistant_fee: feeSchedule.data.assistant_fee,
          specialist_fee: feeSchedule.data.specialist_fee,
          anaesthetist_fee: feeSchedule.data.anaesthetist_fee,
          non_anaesthetist_fee: feeSchedule.data.non_anaesthetist_fee,
        },
        diagnosis_code: {
          code: diagnosis.data.code,
        },
      };
      socket.emit("message", {
        route: "BILLING",
        action: "update",
        content: { id: billing.id, data: datasToEmit },
      });
      setEditVisible(false);
      setIsPuting(false);
      toast.success(`Billing saved successfully`, { containerId: "A" });
    } catch (err) {
      setIsPuting(false);
      toast.error(`Can't save billing: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  const handleDeleteClick = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this billing ?",
      })
    ) {
      try {
        await axiosXanoStaff.delete(`/billings/${billing.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });

        socket.emit("message", {
          route: "BILLING",
          action: "delete",
          content: { id: billing.id },
        });
        toast.success(`Billing deleted successfully`, { containerId: "A" });
      } catch (err) {
        toast.error(`Can't delete billing: ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  return (
    itemInfos && (
      <>
        <tr
          className="billing-table__item"
          style={{ border: errMsg && "solid 1.5px red" }}
        >
          <td>
            {editVisible ? (
              <input
                type="date"
                value={toLocalDate(itemInfos.date)}
                name="date"
                onChange={handleChange}
              />
            ) : (
              toLocalDate(billing.date)
            )}
          </td>
          <td>
            <Tooltip
              title={staffIdToTitleAndName(
                clinic.staffInfos,
                billing.provider_id,
                true
              )}
              placement="top-start"
              arrow
            >
              <span>{billing.provider_ohip_billing_nbr.ohip_billing_nbr}</span>
            </Tooltip>
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.referrer_ohip_nbr}
                  name="referrer_ohip_nbr"
                  onChange={handleChange}
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    top: "8px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setRefOHIPSearchVisible(true)}
                ></i>
              </>
            ) : (
              billing.referrer_ohip_billing_nbr
            )}
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.patient_hcn}
                  name="patient_health_card_nbr"
                  onChange={handleChange}
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    top: "8px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setHcnSearchVisible(true)}
                ></i>
              </>
            ) : (
              billing.patient_hcn
            )}
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={patientIdToName(
                    clinic.demographicsInfos,
                    itemInfos.patient_id
                  )}
                  name="patient_id"
                  readOnly
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    top: "8px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setPatientNameSearchVisible(true)}
                ></i>
              </>
            ) : (
              patientIdToName(clinic.demographicsInfos, billing.patient_id)
            )}
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.diagnosis_code}
                  name="diagnosis_code"
                  onChange={handleChange}
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    top: "8px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setDiagnosisSearchVisible(true)}
                ></i>
              </>
            ) : (
              billing.diagnosis_code.code
            )}
          </td>
          <td>
            {editVisible ? (
              <input
                type="text"
                value={itemInfos.billing_code}
                name="billing_code"
                onChange={handleChange}
              />
            ) : (
              billing.billing_code.billing_code
            )}
          </td>
          <td>{billing.billing_code.provider_fee / 10000} $</td>
          <td>{billing.billing_code.assistant_fee / 10000} $</td>
          <td>{billing.billing_code.specialist_fee / 10000} $</td>
          <td>{billing.billing_code.anaesthetist_fee / 10000} $</td>
          <td>{billing.billing_code.non_anaesthetist_fee / 10000} $</td>
          {user.title !== "Secretary" && (
            <td>
              <div className="billing-table__item-btn-container">
                {!editVisible ? (
                  <>
                    <button onClick={handleEditClick}>Edit</button>
                    <button onClick={handleDeleteClick}>Delete</button>
                    <button onClick={handleDuplicateClick}>Duplicate</button>
                  </>
                ) : (
                  <>
                    {isPuting ? (
                      <CircularProgressMedium />
                    ) : (
                      <input
                        type="submit"
                        value="Save"
                        onClick={handleSubmit}
                      />
                    )}
                    <button onClick={handleCancel} disabled={isPuting}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </td>
          )}
        </tr>
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
            <SinSearch handleClickHcn={handleClickHcn} />
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
      </>
    )
  );
};

export default BillingTableItem;
