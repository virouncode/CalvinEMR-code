import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";

const BillingCodesTemplateForm = ({
  errMsgPost,
  setErrMsgPost,
  setNewTemplateVisible,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [formDatas, setFormDatas] = useState({
    name: "",
    author_id: user.id,
    billing_codes: [],
  });

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
      const datasToPost = {
        ...formDatas,
        date_created: nowTZTimestamp(),
        billing_codes: formDatas.billing_codes.map((billing_code) =>
          billing_code.toUpperCase()
        ),
      };
      const response = await xanoPost(
        `/billing_codes_templates`,
        "staff",
        datasToPost
      );
      socket.emit("message", {
        route: "BILLING TEMPLATES",
        action: "create",
        content: { id: response.data.id, data: response.data },
      });
      setNewTemplateVisible(false);
      toast.success("Template created successfully", { containerId: "A" });
    } catch (err) {
      setNewTemplateVisible(false);
      toast.error(`Unable to create template:${err.message}`, {
        containerId: "A",
      });
    }
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setErrMsgPost("");
    setNewTemplateVisible(false);
  };

  return (
    <li
      className="billing-codes__templates-list-item billing-codes__templates-list-item--edit"
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
  );
};

export default BillingCodesTemplateForm;
