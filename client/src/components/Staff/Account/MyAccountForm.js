import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { myAccountSchema } from "../../../validation/myAccountValidation";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const MyAccountForm = () => {
  //HOOKS
  const { user, setUser } = useUserContext();
  const { staffInfos, setStaffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(null);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  // const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setFormDatas(staffInfos.find(({ id }) => id === user.id));
    setTempFormDatas(staffInfos.find(({ id }) => id === user.id));
  }, [staffInfos, user.id]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleChangeCredentials = (e) => {
    navigate("/staff/credentials");
  };

  const handleEdit = (e) => {
    setEditVisible(true);
  };

  const handleSave = async (e) => {
    //Validation
    try {
      await myAccountSchema.validate(tempFormDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    try {
      //Submission
      setProgress(true);
      const response = await xanoPut(
        `/staff/${user.id}`,
        "staff",
        tempFormDatas
      );
      setSuccessMsg("Infos changed successfully");

      socket.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            cell_phone: tempFormDatas.cell_phone,
            backup_phone: tempFormDatas.backup_phone,
            video_link: tempFormDatas.video_link,
          },
        },
      });
      socket.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: user.id,
          data: response.data,
        },
      });

      setEditVisible(false);
      setProgress(false);
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      setErrMsg(`Error: unable to save infos: ${err.message}`);
      setProgress(false);
    }
  };

  const handleCancel = (e) => {
    setErrMsg("");
    setTempFormDatas(formDatas);
    setEditVisible(false);
  };

  return (
    <div className="myaccount-section__container">
      {errMsg && <p className="myaccount-section__err">{errMsg}</p>}
      {successMsg && <p className="myaccount-section__success">{successMsg}</p>}
      {tempFormDatas && (
        <div className="myaccount-section__form">
          <div className="myaccount-section__column">
            <div className="myaccount-section__row">
              <label>Email*: </label>
              <p>{tempFormDatas.email}</p>
            </div>
            <div className="myaccount-section__row">
              <label>First Name*: </label>
              <p>{tempFormDatas.first_name}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Middle Name: </label>
              <p>{tempFormDatas.middle_name}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Last Name*: </label>
              <p>{tempFormDatas.last_name}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Site*: </label>
              <p>{tempFormDatas.site_infos.name}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Gender*: </label>
              <p>{tempFormDatas.gender}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Occupation*: </label>
              <p>{tempFormDatas.title}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Speciality: </label>
              <p>{tempFormDatas.speciality}</p>
            </div>
          </div>
          <div className="myaccount-section__column">
            <div className="myaccount-section__row">
              <label>Subspeciality: </label>
              <p>{tempFormDatas.subspeciality}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Licence#: </label>
              <p>{tempFormDatas.licence_nbr}</p>
            </div>
            <div className="myaccount-section__row">
              <label>OHIP#: </label>
              <p>{tempFormDatas.licence_nbr}</p>
            </div>
            <div className="myaccount-section__row">
              <label>Cell phone*: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.cell_phone}
                  onChange={handleChange}
                  name="cell_phone"
                  autoComplete="off"
                  required
                />
              ) : (
                <p>{tempFormDatas.cell_phone}</p>
              )}
            </div>
            <div className="myaccount-section__row">
              <label>Backup phone: </label>
              {editVisible ? (
                <input
                  type="text"
                  value={tempFormDatas.backup_phone}
                  onChange={handleChange}
                  name="backup_phone"
                  autoComplete="off"
                />
              ) : (
                <p>{tempFormDatas.backup_phone}</p>
              )}
            </div>
            <div className="myaccount-section__row">
              <label>Link for video calls: </label>
              {editVisible ? (
                <input
                  name="video_link"
                  type="text"
                  autoComplete="off"
                  value={tempFormDatas.video_link}
                  onChange={handleChange}
                />
              ) : (
                <p>{tempFormDatas.video_link}</p>
              )}
            </div>
            <div className="myaccount-section__row">
              <label>AI consent: </label>
              <p>{tempFormDatas.ai_consent ? "Yes" : "No"}</p>
            </div>
            <div className="myaccount-section__row">
              <label>E-sign: </label>
              <div className="myaccount-section__image">
                {tempFormDatas.sign ? (
                  <img
                    src={`${BASE_URL}${tempFormDatas.sign?.path}`}
                    alt="e-sign"
                    width="150px"
                  />
                ) : (
                  <img
                    src="https://placehold.co/150x100/png?font=roboto&text=Sign"
                    alt="user-avatar-placeholder"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="myaccount-section__btns">
        {editVisible ? (
          <>
            <button onClick={handleSave} disabled={progress}>
              Save
            </button>
            <button onClick={handleCancel} disabled={progress}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} disabled={progress}>
              Edit
            </button>
            <button onClick={handleChangeCredentials} disabled={progress}>
              Change email/password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccountForm;
