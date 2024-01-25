import React from "react";
import { toast } from "react-toastify";
import { sendEmail } from "../../../api/sendEmail";
import { axiosXanoReset } from "../../../api/xanoReset";

const EmailForm = ({
  setRequestSent,
  setErrMsg,
  type,
  setType,
  setEmailInput,
  emailInput,
}) => {
  const handleTypeChange = (e) => {
    setErrMsg("");
    setType(e.target.value);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    //verifier l'email
    try {
      const response = await axiosXanoReset.get(`/${type}/all_emails`);
      const mail = response.data.find(
        ({ email }) => email === emailInput.toLowerCase()
      );
      if (!mail) {
        setErrMsg(`There is no ${type} account associated with this email`);
        return;
      }
      const user = (
        await axiosXanoReset.get(
          `/auth/${type}/request_temp_password?email=${emailInput.toLowerCase()}`
        )
      ).data;

      sendEmail(
        user.email,
        user.full_name,
        "Temporary Password",
        "",
        "",
        `Please find your temporary password for your ${type} account: ${user.temp_login.temp_password}

          This password will be active for 15 minutes, after this time, please make a new request.
    
    Best wishes,
    Powered by Calvin EMR`
      );
      setRequestSent(true);
    } catch (err) {
      toast.error(`Unable to send the request: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  return (
    <form onSubmit={handleSubmitEmail}>
      <div className="email-form-row-radio">
        <div className="email-form-row-radio-item">
          <input
            type="radio"
            id="staff"
            name="type"
            value="staff"
            checked={type === "staff"}
            onChange={handleTypeChange}
          />
          <label htmlFor="staff">Staff</label>
        </div>
        <div className="email-form-row-radio-item">
          <input
            type="radio"
            id="patient"
            name="type"
            value="patient"
            checked={type === "patient"}
            onChange={handleTypeChange}
          />
          <label htmlFor="patient">Patient</label>
        </div>
        <div className="email-form-row-radio-item">
          <input
            type="radio"
            id="admin"
            name="type"
            value="admin"
            checked={type === "admin"}
            onChange={handleTypeChange}
          />
          <label htmlFor="patient">Admin</label>
        </div>
      </div>
      <div className="email-form-row">
        <label htmlFor="email">Please enter your email: </label>
        <input
          type="email"
          onChange={(e) => {
            setEmailInput(e.target.value);
            setErrMsg("");
          }}
          required
          value={emailInput}
          autoFocus
        />
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
};

export default EmailForm;
