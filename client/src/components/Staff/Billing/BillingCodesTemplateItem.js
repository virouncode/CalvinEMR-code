import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { nowTZTimestamp } from "../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";

const BillingCodesTemplateItem = ({
  template,
  handleSelectTemplate,
  errMsgPost,
  setErrMsgPost,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(template);

  const handleEditClick = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "billing_codes") {
      value = value.split(",").map((billing_code) => billing_code.trim());
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrMsgPost("");
    if (!formDatas.billing_codes.join(",") || !formDatas.name) {
      setErrMsgPost("All fields are required");
      return;
    }
    for (let billing_code of formDatas.billing_codes) {
      billing_code = billing_code.toUpperCase();
      const response = await xanoGet("/ohip_fee_schedule_for_code", "staff", {
        billing_code,
      });
      if (!response.data) {
        setErrMsgPost(`Billing code ${billing_code} doesn't exist`);
        return;
      }
    }
    try {
      const datasToPut = { ...formDatas, date_created: nowTZTimestamp() };
      const response = await xanoPut(
        `/billing_codes_templates/${template.id}`,
        "staff",
        datasToPut
      );
      socket.emit("message", {
        route: "BILLING TEMPLATES",
        action: "update",
        content: { id: response.data.id, data: response.data },
      });
      setEditVisible(false);
      toast.success("Template modified successfully", { containerId: "A" });
    } catch (err) {
      setEditVisible(false);
      toast.error(`Unable to modify template:${err.message}`, {
        containerId: "A",
      });
    }
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setFormDatas(template);
    setEditVisible(false);
  };
  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this template ?",
      })
    ) {
      try {
        setErrMsgPost("");
        await xanoDelete(`/billing_codes_templates/${template.id}`, "staff");
        socket.emit("message", {
          route: "BILLING TEMPLATES",
          action: "delete",
          content: { id: template.id },
        });
        toast.success("Template deleted successfully", { containerId: "A" });
      } catch (err) {
        toast.error(`Unable to delete template:${err.message}`, {
          containerId: "A",
        });
      }
    }
  };
  return editVisible ? (
    <li
      className="billing-codes__templates-list-item billing-codes__templates-list-item--edit"
      key={template.id}
      style={{ border: errMsgPost && "solid 1px red" }}
    >
      <label>Name</label>
      <input
        type="text"
        value={formDatas.name}
        onChange={handleChange}
        name="name"
        autoComplete="off"
      />
      <label>Billing code(s)</label>
      <input
        type="text"
        placeholder="A001,B423,F404,..."
        value={
          formDatas.billing_codes.length > 0
            ? formDatas.billing_codes.join(",")
            : ""
        }
        onChange={handleChange}
        name="billing_codes"
        autoComplete="off"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </li>
  ) : (
    <li
      className="billing-codes__templates-list-item"
      key={template.id}
      onClick={(e) => handleSelectTemplate(e, template.billing_codes)}
    >
      <span>
        {template.name} ({staffIdToTitleAndName(staffInfos, template.author_id)}
        ) : {template.billing_codes.join(", ")}
        {user.id === template.author_id && (
          <>
            <i
              className="fa-solid fa-pen-to-square"
              style={{ marginLeft: "5px" }}
              onClick={handleEditClick}
            ></i>
            <i
              className="fa-solid fa-trash"
              onClick={handleDelete}
              style={{ cursor: "pointer", marginLeft: "5px" }}
            ></i>
          </>
        )}
      </span>
    </li>
  );
};

export default BillingCodesTemplateItem;
