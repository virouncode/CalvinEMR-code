import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import { provinceStateTerritoryCT } from "../../../datas/codesTables";
import useAuth from "../../../hooks/useAuth";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { siteSchema } from "../../../validation/siteValidation";
import GenericList from "../../All/UI/Lists/GenericList";
import RoomsForm from "./RoomsForm";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const SiteForm = ({ setAddVisible }) => {
  const { auth, socket, user } = useAuth();
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [err, setErr] = useState(false);
  const [formDatas, setFormDatas] = useState({
    name: "",
    address: "",
    postal_code: "",
    province_state: "",
    city: "",
    phone: "",
    fax: "",
    logo: null,
    rooms: [],
  });

  const handleCancel = (e) => {
    setAddVisible(false);
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
    const datasToPost = {
      ...formDatas,
      name: firstLetterUpper(formDatas.name),
      address: firstLetterUpper(formDatas.address),
      city: firstLetterUpper(formDatas.city),
      rooms: [
        ...formDatas.rooms.map((room) => {
          return { id: room.id, title: firstLetterUpper(room.title) };
        }),
        { id: "z", title: "To be determined" },
      ],
      created_by_id: user.id,
      date_created: Date.now(),
    };
    //Validation
    if (formDatas.rooms.length === 0) {
      setErr("Please add at least one room for the appointments");
      return;
    }
    try {
      await siteSchema.validate(datasToPost);
    } catch (err) {
      setErr(err.message);
      return;
    }

    //Submission
    try {
      const response = await axiosXanoAdmin.post("/sites", datasToPost, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      socket.emit("message", {
        route: "SITES",
        action: "create",
        content: { data: response.data },
      });
      setAddVisible(false);
      toast.success(`New site successfully added to database`, {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Unable to add new site to database: ${err.message}`, {
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
              autoComplete="off"
            />
          </div>
          <div className="site-form__row">
            <label>Address*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="address"
              value={formDatas.address}
              autoComplete="off"
            />
          </div>
          <div className="site-form__row">
            <label>Postal code*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="postal_code"
              value={formDatas.postal_code}
              autoComplete="off"
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
              autoComplete="off"
            />
          </div>
          <div className="site-form__row">
            <label>Phone number*:</label>
            <input
              type="tel"
              onChange={handleChange}
              name="phone"
              value={formDatas.phone}
              autoComplete="off"
            />
          </div>
          <div className="site-form__row">
            <label>Fax number:</label>
            <input
              type="tel"
              onChange={handleChange}
              name="fax"
              value={formDatas.fax}
              autoComplete="off"
            />
          </div>
          <div className="site-form__row site-form__row--special">
            <label>Site logo: </label>
            <div className="site-form__row-image">
              {isLoadingFile ? (
                <CircularProgress size="1rem" style={{ margin: "5px" }} />
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
          <RoomsForm
            formDatas={formDatas}
            setFormDatas={setFormDatas}
            setErr={setErr}
          />
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

export default SiteForm;