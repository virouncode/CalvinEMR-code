import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import xanoGet from "../../../api/xanoGet";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import {
  getUnreadMessagesExternalNbr,
  getUnreadMessagesNbr,
} from "../../../utils/getUnreadMessagesNbr";
import { userSchema } from "../../../validation/userValidation";
import CircularProgressSmallWhite from "../UI/Progress/CircularProgressSmallWhite";
const LOGIN_URL = "/auth/login";
const USERINFO_URL = "/auth/me";

const LoginNewCard = () => {
  //HOOKS
  const { setAuth } = useAuthContext();
  const { setUser } = useUserContext();
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

    //************************************* STAFF USER *************************************//
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
        const response4 = await xanoGet(
          `/messages_for_staff`,
          axiosXanoStaff,
          authToken,
          "staff_id",
          user.id
        );
        const unreadMessagesNbr = getUnreadMessagesNbr(response4.data, user.id);

        // Get user unread external messages
        const response5 = await xanoGet(
          `/messages_external_for_staff`,
          axiosXanoStaff,
          authToken,
          "staff_id",
          user.id
        );

        const unreadMessagesExternalNbr = getUnreadMessagesExternalNbr(
          response5.data,
          "staff",
          user.id
        );
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
    }
  };
  // } else if (formDatasToPost.type === "patient") {
  //   //PATIENT
  //   try {
  //     //=============== AUTH =================//
  //     const response = await axiosXanoPatient.post(
  //       LOGIN_URL,
  //       { email, password },
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     const authToken = response?.data?.authToken;
  //     setAuth({ email, authToken });
  //     localStorage.setItem("auth", JSON.stringify({ email, authToken }));

  //     //================ USER ===================//
  //     const response2 = await axiosXanoPatient.get(USERINFO_URL, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });
  //     if (response2.data.account_status === "Suspended") {
  //       navigate("/suspended");
  //       return;
  //     }
  //     const id = response2?.data?.id;
  //     const access_level = response2?.data?.access_level;

  //     const response3 = await axiosXanoPatient.get(
  //       `/demographics_for_patient?patient_id=${id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );
  //     const demographics = response3?.data[0];

  //     // Get user unread messages
  //     const response4 = await axiosXanoPatient.get(
  //       `/messages_external_for_patient?patient_id=${id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );
  //     const unreadMessagesExternalNbr = getUnreadMessagesExternalNbr(
  //       response4.data,
  //       "patient",
  //       id
  //     );
  //     const unreadNbr = unreadMessagesExternalNbr;

  //     setUser({
  //       id,
  //       access_level,
  //       demographics,
  //       unreadNbr,
  //     });
  //     localStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         id,
  //         access_level,
  //         demographics,
  //         unreadNbr,
  //       })
  //     );

  //     //================== CLINIC ===================//
  //     const response5 = await axiosXanoPatient.get("/staff", {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const staffInfos = response5.data.sort((a, b) =>
  //       a.last_name.localeCompare(b.last_name)
  //     );

  //     const response6 = await axiosXanoPatient.get("/demographics", {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const demographicsInfos = response6.data.sort((a, b) =>
  //       a.Names.LegalName.LastName.Part.localeCompare(
  //         b.Names.LegalName.LastName.Part
  //       )
  //     );

  //     const response7 = await axiosXanoPatient.get("/patients", {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const patientsInfos = response7.data;

  //     setClinic({ staffInfos, demographicsInfos, patientsInfos });
  //     localStorage.setItem(
  //       "clinic",
  //       JSON.stringify({ staffInfos, demographicsInfos, patientsInfos })
  //     );
  //     navigate(from, { replace: true });
  //   } catch (err) {
  //     if (!err?.response) {
  //       setErr("No server response");
  //     } else if (err.response?.response?.status === 400) {
  //       setErr("Missing email or password");
  //     } else if (err.response?.response?.status === 401) {
  //       setErr("Unhauthorized");
  //     } else {
  //       setErr("Login failed, please try again");
  //     }
  //   }
  // } else {
  //   //ADMIN
  //   try {
  //     //=============== AUTH =================//
  //     const response = await axiosXanoAdmin.post(
  //       LOGIN_URL,
  //       JSON.stringify({ email, password }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     const authToken = response?.data?.authToken;
  //     setAuth({ email, authToken });
  //     localStorage.setItem("auth", JSON.stringify({ email, authToken }));
  //     //================ USER ===================//
  //     const response2 = await axiosXanoAdmin.get(USERINFO_URL, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });
  //     const id = response2?.data?.id;
  //     const name = response2?.data?.full_name;
  //     const access_level = response2?.data?.access_level;

  //     setUser({
  //       id,
  //       name,
  //       access_level,
  //     });
  //     localStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         id,
  //         name,
  //         access_level,
  //       })
  //     );

  //     //================== CLINIC ===================//
  //     const response4 = await axiosXanoAdmin.get("/staff", {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const staffInfos = response4.data.sort((a, b) =>
  //       a.last_name.localeCompare(b.last_name)
  //     );

  //     const response5 = await axiosXanoAdmin.get("/demographics", {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const demographicsInfos = response5.data.sort((a, b) =>
  //       a.Names.LegalName.LastName.Part.localeCompare(
  //         b.Names.LegalName.LastName.Part
  //       )
  //     );

  //     const response6 = await axiosXanoAdmin.get("/patients", {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const patientsInfos = response6.data;

  //     const response7 = await axiosXanoAdmin.get("/admin", {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const adminsInfos = response7.data;

  //     setClinic({
  //       staffInfos,
  //       demographicsInfos,
  //       patientsInfos,
  //       adminsInfos,
  //     });

  //     localStorage.setItem(
  //       "clinic",
  //       JSON.stringify({
  //         staffInfos,
  //         demographicsInfos,
  //         patientsInfos,
  //         adminsInfos,
  //       })
  //     );
  //     navigate(from, { replace: true });
  //   } catch (err) {
  //     if (!err?.response) {
  //       setErr("No server response");
  //     } else if (err.response?.response?.status === 400) {
  //       setErr("Missing email or password");
  //     } else if (err.response?.response?.status === 401) {
  //       setErr("Unhauthorized");
  //     } else {
  //       setErr("Login failed, please try again");
  //     }
  //   }
  // }
  // };

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
        {err && <p className={"login-errmsg"}>{err}</p>}
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

export default LoginNewCard;
