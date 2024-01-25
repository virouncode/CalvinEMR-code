import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { myAccountSchema } from "../../../validation/myAccountValidation";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const MyAccountForm = () => {
  //HOOKS
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(null);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const { auth, user, socket, clinic } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  useEffect(() => {
    setFormDatas(clinic.staffInfos.find(({ id }) => id === user.id));
    setTempFormDatas(clinic.staffInfos.find(({ id }) => id === user.id));
  }, [clinic.staffInfos, user.id]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setTempFormDatas({ ...tempFormDatas, [name]: value });
  };

  const handleChangeCredentials = (e) => {
    navigate("/credentials");
  };

  const handleSignChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsg("");
    if (file.size > 25000000) {
      setErrMsg("File is over 25Mb, please choose another file");
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        let fileToUpload = await axiosXanoStaff.post(
          "/upload/attachment",
          {
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setTempFormDatas({ ...tempFormDatas, sign: fileToUpload.data });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "A",
        });
      }
    };
  };
  const handleEdit = (e) => {
    setEditVisible(true);
  };

  const handleSave = async (e) => {
    try {
      const full_name =
        tempFormDatas.first_name +
        " " +
        (tempFormDatas.middle_name ? tempFormDatas.middle_name + " " : "") +
        tempFormDatas.last_name;

      const datasToPut = { ...tempFormDatas };

      //Formatting
      datasToPut.first_name = firstLetterUpper(datasToPut.first_name);
      datasToPut.middle_name = firstLetterUpper(datasToPut.middle_name);
      datasToPut.last_name = firstLetterUpper(datasToPut.last_name);
      datasToPut.full_name = firstLetterUpper(full_name);
      datasToPut.speciality = firstLetterUpper(datasToPut.speciality);
      datasToPut.subspeciality = firstLetterUpper(datasToPut.subspeciality);
      datasToPut.date_created = Date.now();

      if (
        tempFormDatas.ohip_billing_nbr.toString().length !== 6 &&
        tempFormDatas.title === "Doctor"
      ) {
        setErrMsg("OHIP billing number should be 6-digits");
        return;
      }
      datasToPut.ohip_billing_nbr = parseInt(datasToPut.ohip_billing_nbr);
      //Validation
      try {
        await myAccountSchema.validate(datasToPut);
      } catch (err) {
        setErrMsg(err.message);
        return;
      }

      //Submission
      await axiosXanoStaff.put(`/staff/${user.id}`, datasToPut, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      setSuccessMsg("Infos changed successfully");
      //update clinic context staffInfos
      socket.emit("message", {
        route: "STAFF",
        action: "update",
        content: { id: user.id, data: datasToPut },
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
