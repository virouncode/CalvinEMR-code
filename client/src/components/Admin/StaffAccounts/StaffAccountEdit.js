import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { myAccountSchema } from "../../../validation/myAccountValidation";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import SelectSite from "../../Staff/EventForm/SelectSite";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const StaffAccountEdit = ({ infos, editVisible, setEditVisible, sites }) => {
  //HOOKS
  const [formDatas, setFormDatas] = useState(null);
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setFormDatas(infos);
  }, [infos]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSiteChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    setFormDatas({ ...formDatas, site_id: parseInt(value) });
  };

  const handleCancel = () => {
    setEditVisible(false);
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
        let fileToUpload = await xanoPost(
          "/upload/attachment",
          "admin",

          { content }
        );
        setFormDatas({ ...formDatas, sign: fileToUpload.data });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "A",
        });
      }
    };
  };

  const handleSave = async (e) => {
    try {
      setProgress(true);
      const full_name =
        formDatas.first_name +
        " " +
        (formDatas.middle_name ? formDatas.middle_name + " " : "") +
        formDatas.last_name;

      const datasToPut = { ...formDatas };

      //Formatting
      datasToPut.first_name = firstLetterUpper(datasToPut.first_name);
      datasToPut.middle_name = firstLetterUpper(datasToPut.middle_name);
      datasToPut.last_name = firstLetterUpper(datasToPut.last_name);
      datasToPut.full_name = firstLetterUpper(full_name);
      datasToPut.speciality = firstLetterUpper(datasToPut.speciality);
      datasToPut.subspeciality = firstLetterUpper(datasToPut.subspeciality);
      datasToPut.updates = [
        ...formDatas.updates,
        {
          date_updated: Date.now(),
          updated_by_id: user.id,
          updated_by_user_type: "admin",
        },
      ];
      let urlFormatted;
      if (
        !datasToPut.video_link.includes("http") ||
        !datasToPut.video_link.includes("https")
      ) {
        urlFormatted = ["https://", datasToPut.video_link].join("");
        datasToPut.video_link = urlFormatted;
      }

      //Validation
      try {
        await myAccountSchema.validate(datasToPut);
      } catch (err) {
        setErrMsg(err.message);
        setProgress(false);
        return;
      }
      //Submission
      const response = await xanoPut(`/staff/${infos.id}`, "admin", datasToPut);
      socket.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: infos.id,
          data: response.data,
        },
      });
      setEditVisible(false);
      toast.success("Infos changed successfully", { containerId: "A" });
      setProgress(false);
    } catch (err) {
      setErrMsg(`Error: unable to save infos: ${err.message}`);
      setProgress(false);
    }
  };

  return (
    <div
      className="staff-account__container"
      style={{ border: errMsg && editVisible && "solid 1.5px red" }}
    >
      {errMsg && <p className="staff-account__err">{errMsg}</p>}
      {formDatas && (
        <div className="staff-account__form">
          <div className="staff-account__column">
            <div className="staff-account__row">
              <label>Email*: </label>
              <p>{formDatas.email}</p>
            </div>
            <div className="staff-account__row">
              <label>First Name*: </label>
              <input
                type="text"
                required
                value={formDatas.first_name}
                onChange={handleChange}
                name="first_name"
                autoComplete="off"
              />
            </div>
            <div className="staff-account__row">
              <label>Middle Name: </label>
              <input
                type="text"
                value={formDatas.middle_name}
                onChange={handleChange}
                name="middle_name"
                autoComplete="off"
              />
            </div>
            <div className="staff-account__row">
              <label>Last Name*: </label>
              <input
                type="text"
                required
                value={formDatas.last_name}
                onChange={handleChange}
                name="last_name"
                autoComplete="off"
              />
            </div>
            <div className="staff-account__row">
              <label htmlFor="">Site*: </label>
              <SelectSite
                handleSiteChange={handleSiteChange}
                sites={sites}
                value={formDatas.site_id}
                label={false}
              />
            </div>
            <div className="staff-account__row">
              <label>Gender*: </label>
              <select
                required
                value={formDatas.gender}
                onChange={handleChange}
                name="gender"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="staff-account__row">
              <label>Occupation*: </label>
              <select
                required
                value={formDatas.title}
                onChange={handleChange}
                name="title"
              >
                <option value="Doctor">Doctor</option>
                <option value="Medical Student">Medical Student</option>
                <option value="Nurse">Nurse</option>
                <option value="Nursing Student">Nursing Student</option>
                <option value="Secretary">Secretary</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Ultra Sound Technician">
                  Ultra Sound Technician
                </option>
                <option value="Nutritionist">Nutritionist</option>
                <option value="Physiotherapist">Physiotherapist</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="staff-account__row">
              <label>Account status*: </label>
              <select
                required
                value={formDatas.account_status}
                onChange={handleChange}
                name="account_status"
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="staff-account__column">
            <div className="staff-account__row">
              <label>Speciality: </label>
              <input
                type="text"
                value={formDatas.speciality}
                onChange={handleChange}
                name="speciality"
                autoComplete="off"
              />
            </div>
            <div className="staff-account__row">
              <label>Subspeciality: </label>
              <input
                type="text"
                value={formDatas.subspeciality}
                onChange={handleChange}
                name="subspeciality"
                autoComplete="off"
              />
            </div>
            <div className="staff-account__row">
              <label>Licence#: </label>
              <input
                type="text"
                value={formDatas.licence_nbr}
                onChange={handleChange}
                name="licence_nbr"
                autoComplete="off"
                required={formDatas.title === "Doctor"}
              />
            </div>
            <div className="staff-account__row">
              <label>OHIP#: </label>
              <input
                type="text"
                value={formDatas.ohip_billing_nbr}
                onChange={handleChange}
                name="ohip_billing_nbr"
                autoComplete="off"
                required={formDatas.title === "Doctor"}
              />
            </div>
            <div className="staff-account__row">
              <label>Cell phone*: </label>
              <input
                type="text"
                value={formDatas.cell_phone}
                onChange={handleChange}
                name="cell_phone"
                autoComplete="off"
                required
              />
            </div>
            <div className="staff-account__row">
              <label>Backup phone: </label>
              <input
                type="text"
                value={formDatas.backup_phone}
                onChange={handleChange}
                name="backup_phone"
                autoComplete="off"
              />
            </div>
            <div className="staff-account__row">
              <label>Link for video calls: </label>
              <input
                name="video_link"
                type="text"
                autoComplete="off"
                value={formDatas.video_link}
                onChange={handleChange}
              />
            </div>
            <div className="myaccount-section__row">
              <label>AI consent: </label>
              <select
                value={formDatas.ai_consent}
                onChange={handleChange}
                name="ai_consent"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
            <div className="staff-account__row">
              <label>E-sign: </label>
              <div className="staff-account__image">
                {isLoadingFile ? (
                  <CircularProgressMedium />
                ) : formDatas.sign ? (
                  <img
                    src={`${BASE_URL}${formDatas.sign?.path}`}
                    alt="e-sign"
                    width="150px"
                  />
                ) : (
                  <img
                    src="https://placehold.co/200x100/png?font=roboto&text=Sign"
                    alt="user-avatar-placeholder"
                  />
                )}

                <input
                  name="sign"
                  type="file"
                  accept=".jpeg, .jpg, .png, .tif, .pdf, .svg"
                  onChange={handleSignChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="staff-account__btns">
        <button onClick={handleSave} disabled={isLoadingFile || progress}>
          Save
        </button>
        <button onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default StaffAccountEdit;
