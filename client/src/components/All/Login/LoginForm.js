import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";
import {
  getUnreadMessagesExternalNbr,
  getUnreadMessagesNbr,
} from "../../../utils/getUnreadMessagesNbr";
import { userSchema } from "../../../validation/userValidation";

const LOGIN_URL = "/auth/login";
const USERINFO_URL = "/auth/me";

const LoginForm = () => {
  //HOOKS
  const { setAuth, setClinic, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [from, setFrom] = useState(
    location.state?.from?.pathname || "/staff/calendar"
  ); //où on voulait aller ou calendar staff (car pour l'instant type: "staff")
  const [errMsg, setErrMsg] = useState("");
  const [formDatas, setFormDatas] = useState({
    email: "",
    password: "",
    type: "staff",
  });

  //HANDLERS
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setErrMsg("");
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleChangeType = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
    if (value === "patient")
      setFrom(location.state?.from?.pathname || "/patient/messages");
    //où on voulait aller ou messages patient
    else if (value === "admin")
      setFrom(location.state?.from?.pathname || "/admin/dashboard");
    //où on voulait aller ou admin dashboard
    else if (value === "staff")
      setFrom(location.state?.from?.pathname || "/staff/calendar"); //où on voulait aller ou staff calendar
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await userSchema.validate(formDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Formatting
    const formDatasToPost = {
      ...formDatas,
      email: formDatas.email.toLowerCase(),
    };
    const email = formDatasToPost.email;
    const password = formDatasToPost.password;
    //Submission
    if (formDatasToPost.type === "staff") {
      try {
        //=============== AUTH =================//
        const response = await axiosXanoStaff.post(
          LOGIN_URL,
          { email, password },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const authToken = response?.data?.authToken;
        setAuth({ email, authToken });
        localStorage.setItem("auth", JSON.stringify({ email, authToken }));

        //================ USER ===================//
        const response2 = await axiosXanoStaff.get(USERINFO_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response2.data.account_status === "Suspended") {
          navigate("/suspended");
          return;
        }
        const id = response2?.data?.id;
        const first_name = response2.data?.first_name;
        const last_name = response2.data?.last_name;
        const full_name = response2.data?.full_name;
        const title = response2?.data?.title;
        const licence_nbr = response2?.data?.licence_nbr;
        const ohip_billing_nbr = response2?.data?.ohip_billing_nbr;
        const access_level = response2?.data?.access_level;
        const sign = response2?.data?.sign;
        const ai_consent = response2?.data?.ai_consent;

        //Get user settings
        const response3 = await axiosXanoStaff.get(
          `/settings_for_staff?staff_id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const settings = response3?.data;
        // Get user unread messages
        const response4 = await axiosXanoStaff.get(
          `/messages_for_staff?staff_id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const unreadMessagesNbr = getUnreadMessagesNbr(response4.data, id);

        // Get user unread external messages
        const response5 = await axiosXanoStaff.get(
          `/messages_external_for_staff?staff_id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const unreadMessagesExternalNbr = getUnreadMessagesExternalNbr(
          response5.data,
          "staff",
          id
        );
        const unreadNbr = unreadMessagesExternalNbr + unreadMessagesNbr;

        setUser({
          id,
          first_name,
          last_name,
          full_name,
          title,
          licence_nbr,
          ohip_billing_nbr,
          access_level,
          sign,
          ai_consent,
          settings,
          unreadMessagesNbr,
          unreadMessagesExternalNbr,
          unreadNbr,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            id,
            first_name,
            last_name,
            full_name,
            title,
            licence_nbr,
            access_level,
            sign,
            ai_consent,
            settings,
            unreadMessagesNbr,
            unreadMessagesExternalNbr,
            unreadNbr,
          })
        );

        //================== CLINIC ===================//
        const response6 = await axiosXanoStaff.get("/staff", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const staffInfos = response6?.data.sort((a, b) =>
          a.last_name.localeCompare(b.last_name)
        );
        const response7 = await axiosXanoStaff.get("/demographics", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const demographicsInfos = response7.data.sort((a, b) =>
          a.Names.LegalName.LastName.Part.localeCompare(
            b.Names.LegalName.LastName.Part
          )
        );
        const response8 = await axiosXanoStaff.get("/patients", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const patientsInfos = response8.data;
        setClinic({ staffInfos, demographicsInfos, patientsInfos });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            staffInfos,
            demographicsInfos,
            patientsInfos,
          })
        );
        navigate(from, { replace: true }); //on renvoit vers là où on voulait aller
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No server response");
        } else if (err.response?.response?.status === 400) {
          setErrMsg("Missing email or password");
        } else if (err.response?.response?.status === 401) {
          setErrMsg("Unhauthorized");
        } else {
          setErrMsg("Login failed, please try again");
        }
      }
    } else if (formDatasToPost.type === "patient") {
      //PATIENT
      try {
        //=============== AUTH =================//
        const response = await axiosXanoPatient.post(
          LOGIN_URL,
          { email, password },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const authToken = response?.data?.authToken;
        setAuth({ email, authToken });
        localStorage.setItem("auth", JSON.stringify({ email, authToken }));

        //================ USER ===================//
        const response2 = await axiosXanoPatient.get(USERINFO_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response2.data.account_status === "Suspended") {
          navigate("/suspended");
          return;
        }
        const id = response2?.data?.id;
        const access_level = response2?.data?.access_level;

        const response3 = await axiosXanoPatient.get(
          `/demographics_for_patient?patient_id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const demographics = response3?.data[0];

        // Get user unread messages
        const response4 = await axiosXanoPatient.get(
          `/messages_external_for_patient?patient_id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const unreadMessagesExternalNbr = getUnreadMessagesExternalNbr(
          response4.data,
          "patient",
          id
        );
        const unreadNbr = unreadMessagesExternalNbr;

        setUser({
          id,
          access_level,
          demographics,
          unreadNbr,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            id,
            access_level,
            demographics,
            unreadNbr,
          })
        );

        //================== CLINIC ===================//
        const response5 = await axiosXanoPatient.get("/staff", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const staffInfos = response5.data.sort((a, b) =>
          a.last_name.localeCompare(b.last_name)
        );

        const response6 = await axiosXanoPatient.get("/demographics", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const demographicsInfos = response6.data.sort((a, b) =>
          a.Names.LegalName.LastName.Part.localeCompare(
            b.Names.LegalName.LastName.Part
          )
        );

        const response7 = await axiosXanoPatient.get("/patients", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const patientsInfos = response7.data;

        setClinic({ staffInfos, demographicsInfos, patientsInfos });
        localStorage.setItem(
          "clinic",
          JSON.stringify({ staffInfos, demographicsInfos, patientsInfos })
        );
        navigate(from, { replace: true });
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No server response");
        } else if (err.response?.response?.status === 400) {
          setErrMsg("Missing email or password");
        } else if (err.response?.response?.status === 401) {
          setErrMsg("Unhauthorized");
        } else {
          setErrMsg("Login failed, please try again");
        }
      }
    } else {
      //ADMIN
      try {
        //=============== AUTH =================//
        const response = await axiosXanoAdmin.post(
          LOGIN_URL,
          JSON.stringify({ email, password }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const authToken = response?.data?.authToken;
        setAuth({ email, authToken });
        localStorage.setItem("auth", JSON.stringify({ email, authToken }));
        //================ USER ===================//
        const response2 = await axiosXanoAdmin.get(USERINFO_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const id = response2?.data?.id;
        const name = response2?.data?.full_name;
        const access_level = response2?.data?.access_level;

        setUser({
          id,
          name,
          access_level,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            id,
            name,
            access_level,
          })
        );

        //================== CLINIC ===================//
        const response4 = await axiosXanoAdmin.get("/staff", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const staffInfos = response4.data.sort((a, b) =>
          a.last_name.localeCompare(b.last_name)
        );

        const response5 = await axiosXanoAdmin.get("/demographics", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const demographicsInfos = response5.data.sort((a, b) =>
          a.Names.LegalName.LastName.Part.localeCompare(
            b.Names.LegalName.LastName.Part
          )
        );

        const response6 = await axiosXanoAdmin.get("/patients", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const patientsInfos = response6.data;

        const response7 = await axiosXanoAdmin.get("/admin", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const adminsInfos = response7.data;

        setClinic({
          staffInfos,
          demographicsInfos,
          patientsInfos,
          adminsInfos,
        });

        localStorage.setItem(
          "clinic",
          JSON.stringify({
            staffInfos,
            demographicsInfos,
            patientsInfos,
            adminsInfos,
          })
        );
        navigate(from, { replace: true });
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No server response");
        } else if (err.response?.response?.status === 400) {
          setErrMsg("Missing email or password");
        } else if (err.response?.response?.status === 401) {
          setErrMsg("Unhauthorized");
        } else {
          setErrMsg("Login failed, please try again");
        }
      }
    }
  };

  const handleClickForgot = () => {
    navigate("/reset-password");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <p className="login-title">Welcome to Calvin EMR</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-row-radio">
            <div className="login-form-row-radio-item">
              <input
                type="radio"
                id="staff"
                name="type"
                value="staff"
                checked={formDatas.type === "staff"}
                onChange={handleChangeType}
              />
              <label htmlFor="staff">Staff</label>
            </div>
            <div className="login-form-row-radio-item">
              <input
                type="radio"
                id="patient"
                name="type"
                value="patient"
                checked={formDatas.type === "patient"}
                onChange={handleChangeType}
              />
              <label htmlFor="patient">Patient</label>
            </div>
            <div className="login-form-row-radio-item">
              <input
                type="radio"
                id="admin"
                name="type"
                value="admin"
                checked={formDatas.type === "admin"}
                onChange={handleChangeType}
              />
              <label htmlFor="admin">Admin</label>
            </div>
          </div>
          {errMsg && <p className={"login-errmsg"}>{errMsg}</p>}
          <div className="login-form-row">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              autoComplete="off"
              onChange={handleChange}
              value={formDatas.email}
              autoFocus
            />
          </div>
          <div className="login-form-row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={formDatas.password}
              autoComplete="off"
            />
          </div>
          <button>Sign In</button>
        </form>
        <p className="login-forgot">
          <span
            onClick={handleClickForgot}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            I forgot my password
          </span>
        </p>
      </div>
    </div>
  );
};
export default LoginForm;
