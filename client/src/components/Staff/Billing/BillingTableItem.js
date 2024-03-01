import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import xanoGet from "../../../api/xanoGet";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { toLocalDate } from "../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/toPatientName";
import { toSiteName } from "../../../utils/toSiteName";
import { billingItemSchema } from "../../../validation/billingValidation";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import SelectSite from "../EventForm/SelectSite";
import DiagnosisSearch from "./DiagnosisSearch";
import PatientChartHealthSearch from "./PatientChartHealthSearch";
import ReferringOHIPSearch from "./ReferringOHIPSearch";

const BillingTableItem = ({
  billing,
  errMsgPost,
  setErrMsgPost,
  lastItemRef = null,
  sites,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const axiosXanoInstance =
    user.access_level === "Admin" ? axiosXanoAdmin : axiosXanoStaff;

  useEffect(() => {
    setItemInfos({
      date: billing.date,
      provider_ohip_billing_nbr:
        billing.provider_ohip_billing_nbr.ohip_billing_nbr,
      referrer_ohip_billing_nbr: billing.referrer_ohip_billing_nbr,
      patient_id: billing.patient_id,
      patient_hcn: billing.patient_infos.HealthCard?.Number,
      patient_name: toPatientName(billing.patient_infos),
      diagnosis_code: billing.diagnosis_code.code,
      billing_code: billing.billing_infos.billing_code,
      site_id: billing.site_id,
      provider_fee: billing.billing_infos.provider_fee,
      assistant_fee: billing.billing_infos.assistant_fee,
      specialist_fee: billing.billing_infos.specialist_fee,
      anaesthetist_fee: billing.billing_infos.anaesthetist_fee,
      non_anaesthetist_fee: billing.billing_infos.non_anaesthetist_fee,
    });
  }, [billing]);

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "date") value = Date.parse(new Date(value));
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSiteChange = (e) => {
    setItemInfos({ ...itemInfos, site_id: parseInt(e.target.value) });
  };
  const handleEditClick = () => {
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleClickDiagnosis = (e, code) => {
    setErrMsgPost("");
    setItemInfos({ ...itemInfos, diagnosis_code: code });
    setDiagnosisSearchVisible(false);
  };
  const handleClickPatient = (e, item) => {
    setErrMsgPost("");
    setItemInfos({
      ...itemInfos,
      patient_id: item.patient_id,
      patient_name: toPatientName(item),
      patient_hcn: item.HealthCard?.Number || "",
    });
    setPatientSearchVisible(false);
  };
  const handleClickRefOHIP = (e, ohip) => {
    setErrMsgPost("");
    setItemInfos({ ...itemInfos, referrer_ohip_billing_nbr: ohip.toString() });
    setRefOHIPSearchVisible(false);
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setEditVisible(false);
  };

  const handleDuplicateClick = async () => {
    const datasToPost = {
      date: itemInfos.date,
      date_created: Date.now(),
      provider_id: billing.provider_id,
      referrer_ohip_billing_nbr: parseInt(itemInfos.referrer_ohip_billing_nbr),
      patient_id: itemInfos.patient_id,
      diagnosis_id: (
        await xanoGet(
          `/diagnosis_codes_for_code`,
          axiosXanoInstance,
          auth.authToken,
          "code",
          itemInfos.diagnosis_code
        )
      ).data.id,
      billing_code_id: (
        await xanoGet(
          `/ohip_fee_schedule_for_code`,
          axiosXanoInstance,
          auth.authToken,
          "billing_code",
          itemInfos.billing_code
        )
      ).data.id,
      site_id: itemInfos.site_id,
    };
    try {
      const response = await axiosXanoInstance.post("/billings", datasToPost, {
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
      setErrMsgPost(err.message);
      return;
    }
    if (
      (
        await axiosXanoInstance.get(
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
      setErrMsgPost("There is no existing diagnosis with this code");
      return;
    }
    if (itemInfos.billing_code.includes(",")) {
      setErrMsgPost("Please enter only one billing code");
      return;
    }
    const response = await axiosXanoInstance.get(
      `/ohip_fee_schedule_for_code?billing_code=${itemInfos.billing_code}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      }
    );
    if (response.data === null) {
      setErrMsgPost(`Billing code ${itemInfos.billing_code} doesn't exists`);
      return;
    }
    //Submission
    const datasToPut = {
      date: itemInfos.date,
      date_created: billing.date_created,
      provider_id: billing.provider_id,
      referrer_ohip_billing_nbr: parseInt(itemInfos.referrer_ohip_billing_nbr),
      patient_id: itemInfos.patient_id,
      diagnosis_id: (
        await xanoGet(
          `/diagnosis_codes_for_code`,
          axiosXanoInstance,
          auth.authToken,
          "code",
          itemInfos.diagnosis_code
        )
      ).data.id,
      billing_code_id: (
        await xanoGet(
          `/ohip_fee_schedule_for_code`,
          axiosXanoInstance,
          auth.authToken,
          "billing_code",
          itemInfos.billing_code
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
      site_id: itemInfos.site_id,
    };
    try {
      setProgress(true);
      const response = await axiosXanoInstance.put(
        `/billings/${billing.id}`,
        datasToPut,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );

      socket.emit("message", {
        route: "BILLING",
        action: "update",
        content: { id: billing.id, data: response.data },
      });
      setEditVisible(false);
      setProgress(false);
      toast.success(`Billing saved successfully`, { containerId: "A" });
    } catch (err) {
      setProgress(false);
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
        await axiosXanoInstance.delete(`/billings/${billing.id}`, {
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
          style={{ border: errMsgPost && "solid 1.5px red" }}
          ref={lastItemRef}
        >
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
                    {progress ? (
                      <CircularProgressMedium />
                    ) : (
                      <input
                        type="submit"
                        value="Save"
                        onClick={handleSubmit}
                      />
                    )}
                    <button onClick={handleCancel} disabled={progress}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </td>
          )}
          <td>
            {editVisible ? (
              <input
                type="date"
                value={toLocalDate(itemInfos.date)}
                name="date"
                onChange={handleChange}
              />
            ) : (
              toLocalDate(itemInfos.date)
            )}
          </td>
          <td>
            {editVisible ? (
              <SelectSite
                handleSiteChange={handleSiteChange}
                sites={sites}
                value={itemInfos.site_id}
                label={false}
              />
            ) : (
              toSiteName(sites, itemInfos.site_id)
            )}
          </td>
          <td>
            <Tooltip
              title={staffIdToTitleAndName(
                staffInfos,
                billing.provider_id,
                true
              )}
              placement="top-start"
              arrow
            >
              <span>{itemInfos.provider_ohip_billing_nbr}</span>
            </Tooltip>
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.referrer_ohip_billing_nbr}
                  name="referrer_ohip_nbr"
                  onChange={handleChange}
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "12px",
                    top: "17px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setRefOHIPSearchVisible(true)}
                ></i>
              </>
            ) : (
              itemInfos.referrer_ohip_billing_nbr
            )}
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.patient_hcn}
                  name="patient_health_card_nbr"
                  readOnly
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "12px",
                    top: "17px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setPatientSearchVisible(true)}
                ></i>
              </>
            ) : (
              itemInfos.patient_hcn
            )}
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.patient_name}
                  name="patient_id"
                  readOnly
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "12px",
                    top: "17px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setPatientSearchVisible(true)}
                ></i>
              </>
            ) : (
              itemInfos.patient_name
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
                    right: "12px",
                    top: "17px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setDiagnosisSearchVisible(true)}
                ></i>
              </>
            ) : (
              itemInfos.diagnosis_code
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
              itemInfos.billing_code
            )}
          </td>
          <td>{itemInfos.provider_fee / 10000} $</td>
          <td>{itemInfos.assistant_fee / 10000} $</td>
          <td>{itemInfos.specialist_fee / 10000} $</td>
          <td>{itemInfos.anaesthetist_fee / 10000} $</td>
          <td>{itemInfos.non_anaesthetist_fee / 10000} $</td>
        </tr>
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
      </>
    )
  );
};

export default BillingTableItem;
