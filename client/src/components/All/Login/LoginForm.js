import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import xanoGet from "../../../api/xanoGet";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAdminsInfosContext from "../../../hooks/useAdminsInfosContext";
import useAuthContext from "../../../hooks/useAuthContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { toPatientName } from "../../../utils/toPatientName";
import { userSchema } from "../../../validation/userValidation";
import CircularProgressSmallWhite from "../UI/Progress/CircularProgressSmallWhite";
const LOGIN_URL = "/auth/login";
const USERINFO_URL = "/auth/me";

const LoginForm = () => {
  //HOOKS
  const { setAuth } = useAuthContext();
  const { setUser } = useUserContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setStaffInfos } = useStaffInfosContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [from, setFrom] = useState(
    location.state?.from?.pathname || "/staff/calendar"
  ); //où on voulait aller ou calendar staff (car pour l'instant type: "staff")
  const [err, setErr] = useState("");
  const [formDatas, setFormDatas] = useState({
    email: "",
    password: "",
    type: "staff",
  });

  const [loading, setLoading] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setErr("");
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
      setErr(err.message);
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

    //************************************* STAFF *************************************//
    if (formDatasToPost.type === "staff") {
      try {
        setLoading(true);
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

        //================ USER INFOS ===================//

        const response2 = await xanoGet(
          USERINFO_URL,
          axiosXanoStaff,
          authToken
        );
        if (response2.data.account_status === "Suspended") {
          navigate("/suspended");
          return;
        }
        const user = response2?.data;

        //================ USER SETTINGS ===================//
        const response3 = await xanoGet(
          `/settings_for_staff`,
          axiosXanoStaff,
          authToken,
          "staff_id",
          user.id
        );
        const settings = response3?.data;

        //================ USER UNREAD MESSAGES =============//
        const unreadMessagesNbr = (
          await xanoGet(
            `/unread_messages_for_staff`,
            axiosXanoStaff,
            authToken,
            "staff_id",
            user.id
          )
        ).data;
        const unreadMessagesExternalNbr = (
          await xanoGet(
            `/unread_messages_external_for_staff`,
            axiosXanoStaff,
            authToken,
            "staff_id",
            user.id
          )
        ).data;
        const unreadNbr = unreadMessagesExternalNbr + unreadMessagesNbr;

        setUser({
          ...user,
          settings,
          unreadMessagesNbr,
          unreadMessagesExternalNbr,
          unreadNbr,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            settings,
            unreadMessagesNbr,
            unreadMessagesExternalNbr,
            unreadNbr,
          })
        );

        //================== STAFF INFOS ====================//
        const response6 = await xanoGet("/staff", axiosXanoStaff, authToken);
        const staffInfos = response6.data;
        setStaffInfos(staffInfos);
        localStorage.setItem("staffInfos", JSON.stringify(staffInfos));

        setLoading(false);
        navigate(from, { replace: true }); //on renvoit vers là où on voulait aller
      } catch (err) {
        setLoading(false);
        if (!err?.response) {
          setErr("No server response");
        } else if (err.response?.response?.status === 400) {
          setErr("Missing email or password");
        } else if (err.response?.response?.status === 401) {
          setErr("Unhauthorized");
        } else {
          setErr("Login failed, please try again");
        }
      }
      //************************************* PATIENT *************************************//
    } else if (formDatasToPost.type === "patient") {
      try {
        setLoading(true);
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

        //================ USER INFOS ===================//

        const response2 = await xanoGet(
          USERINFO_URL,
          axiosXanoPatient,
          authToken
        );
        if (response2.data.account_status === "Suspended") {
          navigate("/suspended");
          return;
        }
        const user = response2.data;

        //================ USER DEMOGRAPHICS =============//
        const response3 = await xanoGet(
          `/demographics_for_patient`,
          axiosXanoPatient,
          authToken,
          "patient_id",
          user.id
        );
        const demographics = response3?.data[0];

        //================ USER UNREAD MESSAGES =============//
        const unreadNbr = (
          await xanoGet(
            `/unread_messages_for_patient`,
            axiosXanoPatient,
            authToken,
            "patient_id",
            user.id
          )
        ).data;

        setUser({
          ...user,
          full_name: toPatientName(demographics),
          demographics,
          unreadNbr,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            demographics,
            unreadNbr,
          })
        );

        //================== STAFF INFOS ====================//
        const response6 = await xanoGet("/staff", axiosXanoPatient, authToken);
        const staffInfos = response6.data;
        setStaffInfos(staffInfos);
        localStorage.setItem("staffInfos", JSON.stringify(staffInfos));

        setLoading(false);
        navigate(from, { replace: true }); //on renvoit vers là où on voulait aller
      } catch (err) {
        setLoading(false);
        if (!err?.response) {
          setErr("No server response");
        } else if (err.response?.response?.status === 400) {
          setErr("Missing email or password");
        } else if (err.response?.response?.status === 401) {
          setErr("Unhauthorized");
        } else {
          setErr("Login failed, please try again");
        }
      }
    }
    //************************************* ADMIN *************************************//
    else if (formDatasToPost.type === "admin") {
      try {
        setLoading(true);
        //=============== AUTH =================//
        const response = await axiosXanoAdmin.post(
          LOGIN_URL,
          { email, password },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const authToken = response?.data?.authToken;
        setAuth({ email, authToken });
        localStorage.setItem("auth", JSON.stringify({ email, authToken }));

        //=============== AUTH =================//
        const response2 = await xanoGet(
          USERINFO_URL,
          axiosXanoAdmin,
          authToken
        );
        const user = response2?.data;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        //=============== STAFF INFOS =================//
        const response3 = await xanoGet("/staff", axiosXanoAdmin, authToken);
        const staffInfos = response3.data;
        setStaffInfos(staffInfos);
        localStorage.setItem("staffInfos", JSON.stringify(staffInfos));

        //=============== ADMIN INFOS =================//
        const response4 = await xanoGet("/admins", axiosXanoAdmin, authToken);
        const adminsInfos = response4.data;
        setAdminsInfos(adminsInfos);
        localStorage.setItem("adminsInfos", JSON.stringify(adminsInfos));

        setLoading(false);
        navigate(from, { replace: true }); //on renvoit vers là où on voulait aller
      } catch (err) {
        setLoading(false);
        if (!err?.response) {
          setErr("No server response");
        } else if (err.response?.response?.status === 400) {
          setErr("Missing email or password");
        } else if (err.response?.response?.status === 401) {
          setErr("Unhauthorized");
        } else {
          setErr("Login failed, please try again");
        }
      }
    }
  };

  const handleClickForgot = () => {
    navigate("/reset-password");
  };
  return (
    <div className="login-newcard">
      <div className="login-newcard__title">Welcome to Calvin EMR</div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form__row-radio">
          <div className="login-form__row-radio-item">
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
          <div className="login-form__row-radio-item">
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
          <div className="login-form__row-radio-item">
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
        {err ? (
          <p className={"login__err"}>{err}</p>
        ) : (
          <p className={"login__err"} style={{ visibility: "hidden" }}>
            Placeholder
          </p>
        )}
        <div className="login-form__row">
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
        <div className="login-form__row">
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
        <div className="login-form__btn-container">
          <button>
            {loading ? <CircularProgressSmallWhite /> : "Sign In"}
          </button>
        </div>
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
  );
};

export default LoginForm;
