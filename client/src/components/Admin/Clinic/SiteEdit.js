import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import { provinceStateTerritoryCT } from "../../../datas/codesTables";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { siteSchema } from "../../../validation/siteValidation";
import GenericList from "../../All/UI/Lists/GenericList";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import RoomsForm from "./RoomsForm";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const SiteEdit = ({ infos, setEditVisible }) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [err, setErr] = useState(false);
  const [formDatas, setFormDatas] = useState(infos);

  const handleCancel = (e) => {
    setEditVisible(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErr("");
    if (file.size > 25000000) {
      toast.error("The file is over 25Mb, please choose another file", {
        containerId: "A",
      });
      return;
    }
    setIsLoadingFile(true);
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        let fileToUpload = await axiosXanoAdmin.post(
          "/upload/attachment",
          {
            content: content,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setFormDatas({ ...formDatas, logo: fileToUpload.data });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
        setIsLoadingFile(false);
      }
    };
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setErr("");
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...formDatas,
      name: firstLetterUpper(formDatas.name),
      address: firstLetterUpper(formDatas.address),
      city: firstLetterUpper(formDatas.city),
      rooms: [
        ...formDatas.rooms.map((room) => {
          return { id: room.id, title: firstLetterUpper(room.title) };
        }),
      ],
      updates: [
        ...formDatas.updates,
        { updated_by_id: user.id, date_updated: Date.now() },
      ],
    };
    //Validation
    if (formDatas.rooms.length === 0) {
      alert("Please add at least one room for the appointments");
      return;
    }
    try {
      await siteSchema.validate(datasToPut);
    } catch (err) {
      setErr(err.message);
      return;
    }

    //Submission
    try {
      const response = await axiosXanoAdmin.put(
        `/sites/${infos.id}`,
        datasToPut,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      socket.emit("message", {
        route: "SITES",
        action: "update",
        content: { id: infos.id, data: response.data },
      });
      setEditVisible(false);
      toast.success(`Site successfully updated`, {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Unable to update site: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  return (
    <div
      className="site-form__container"
      style={{ border: err && "solid 1px red" }}
    >
      {err && <p className="site-form__err">{err}</p>}
      <form className="site-form">
        <div className="site-form__column">
          <div className="site-form__row">
            <label>Site name*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="name"
              value={formDatas.name}
            />
          </div>
          <div className="site-form__row">
            <label>Address*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="address"
              value={formDatas.address}
            />
          </div>
          <div className="site-form__row">
            <label>Postal code*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="postal_code"
              value={formDatas.postal_code}
            />
          </div>
          <div className="site-form__row">
            <label>Province/State*:</label>
            <GenericList
              list={provinceStateTerritoryCT}
              value={formDatas.province_state}
              handleChange={handleChange}
              name="province_state"
            />
          </div>
          <div className="site-form__row">
            <label>City*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="city"
              value={formDatas.city}
            />
          </div>
          <div className="site-form__row">
            <label>Phone number*:</label>
            <input
              type="tel"
              onChange={handleChange}
              name="phone"
              value={formDatas.phone}
            />
          </div>
          <div className="site-form__row">
            <label>Fax number:</label>
            <input
              type="tel"
              onChange={handleChange}
              name="fax"
              value={formDatas.fax}
            />
          </div>
          <div className="site-form__row site-form__row--special">
            <label>Site logo: </label>
            <div className="site-form__row-image">
              {isLoadingFile ? (
                <CircularProgressMedium />
              ) : formDatas.logo ? (
                <img
                  src={`${BASE_URL}${formDatas.logo?.path}`}
                  alt="site-logo"
                  width="150px"
                />
              ) : (
                <img
                  src="https://placehold.co/200x100/png?font=roboto&text=Sign"
                  alt="logo-placeholder"
                />
              )}
              <input
                name="logo"
                type="file"
                accept=".jpeg, .jpg, .png, .tif, .pdf, .svg"
                onChange={handleLogoChange}
              />
            </div>
          </div>
        </div>
        <div className="site-form__column">
          <RoomsForm formDatas={formDatas} setFormDatas={setFormDatas} />
        </div>
      </form>
      <div className="site-form__btn-container">
        <button onClick={handleSubmit}>Save</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SiteEdit;
