import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { myAccountSchema } from "../../../validation/myAccountValidation";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const MyAccountForm = () => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user, setUser } = useUserContext();
  const { staffInfos, setStaffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(null);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

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

  // const handleSignChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   setErrMsg("");
  //   if (file.size > 25000000) {
  //     setErrMsg("File is over 25Mb, please choose another file");
  //     return;
  //   }
  //   // setting up the reader
  //   setIsLoadingFile(true);
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   // here we tell the reader what to do when it's done reading...
  //   reader.onload = async (e) => {
  //     let content = e.target.result; // this is the content!
  //     try {
  //       let fileToUpload = await axiosXanoStaff.post(
  //         "/upload/attachment",
  //         {
  //           content: content,
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${auth.authToken}`,
  //           },
  //         }
  //       );
  //       setTempFormDatas({ ...tempFormDatas, sign: fileToUpload.data });
  //       setIsLoadingFile(false);
  //     } catch (err) {
  //       toast.error(`Error: unable to load file: ${err.message}`, {
  //         containerId: "A",
  //       });
  //     }
  //   };
  // };
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
      const response = await axiosXanoStaff.put(
        `/staff/${user.id}`,
        tempFormDatas,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
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
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      setErrMsg(`Error: unable to save infos: ${err.message}`);
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
            <button onClick={handleSave} disabled={isLoadingFile}>
              Save
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleChangeCredentials}>
              Change email/password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccountForm;
