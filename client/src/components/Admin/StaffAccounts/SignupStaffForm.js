import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendEmail } from "../../../api/sendEmail";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { generatePassword } from "../../../utils/generatePassword";
import { staffSchema } from "../../../validation/staffValidation";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const SignupStaffForm = ({ setAddVisible }) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [errMsg, setErrMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [formDatas, setFormDatas] = useState({
    email: "",
    password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "Male",
    title: "Doctor",
    access_level: "User",
    speciality: "",
    subspeciality: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    account_status: "Activated",
    cell_phone: "",
    backup_phone: "",
    video_link: "",
    sign: null,
  });
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchSites = async () => {
      try {
        const response = await axiosXanoAdmin.get("/sites", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setSites(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        toast.error(`Error: unable to get clinic sites: ${err.message}`, {
          containerId: "A",
        });
      }
    };
    fetchSites();
    return () => abortController.abort();
  }, [auth.authToken]);

  const handleSiteChange = (e) => {
    setSiteId(parseInt(e.target.value));
  };

  const handleCancel = () => {
    setAddVisible(false);
  };

  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSignChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsg("");
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
        setFormDatas({ ...formDatas, sign: fileToUpload.data });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
        setIsLoadingFile(false);
      }
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      const staff = await axiosXanoAdmin.get("/staff", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      if (
        staff.data.find(
          ({ email }) => email.toLowerCase() === formDatas.email.toLowerCase()
        )
      ) {
        setErrMsg(
          "There is already an account with this email, please choose another one"
        );
        return;
      }
    } catch (err) {
      setErrMsg(`Error: unable to sign up staff: ${err.message}`);
      return;
    }
    // if (
    //   formDatas.ohip_billing_nbr.toString().length !== 6 &&
    //   formDatas.title === "Doctor"
    // ) {
    //   setErrMsg("OHIP Billing number should be 6-digits");
    //   return;
    // }
    if (!siteId) {
      setErrMsg("Clinic site field is required");
      return;
    }
    try {
      const full_name =
        formDatas.first_name +
        " " +
        (formDatas.middle_name ? formDatas.middle_name + " " : "") +
        formDatas.last_name;

      const datasToPost = {
        ...formDatas,
        created_by_id: user.id,
        date_created: Date.now(),
      };

      //Formatting
      datasToPost.email = datasToPost.email.toLowerCase();
      datasToPost.first_name = firstLetterUpper(datasToPost.first_name);
      datasToPost.middle_name = firstLetterUpper(datasToPost.middle_name);
      datasToPost.last_name = firstLetterUpper(datasToPost.last_name);
      datasToPost.full_name = firstLetterUpper(full_name);
      datasToPost.speciality = firstLetterUpper(datasToPost.speciality);
      datasToPost.subspeciality = firstLetterUpper(datasToPost.subspeciality);
      datasToPost.date_created = Date.now();
      datasToPost.ohip_billing_nbr = parseInt(datasToPost.ohip_billing_nbr);

      const newPassword = generatePassword();
      datasToPost.password = newPassword;

      //Validation
      try {
        await staffSchema.validate(datasToPost);
      } catch (err) {
        setErrMsg(err.message);
        return;
      }
      //Submission
      const response = await axiosXanoAdmin.post("/staff", datasToPost, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      socket.emit("message", {
        route: "STAFF",
        action: "create",
        content: { data: response.data },
      });

      await axiosXanoAdmin.post(
        "/settings",
        {
          staff_id: response.data.id,
          slot_duration: "00:15",
          first_day: "0",
          invitation_templates: [
            {
              name: "In person appointment",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
            },
            {
              name: "Video appointment",
              intro: `This email/text message is to remind you about your upcoming VIDEO appointment.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: This appointment is online. DO NOT COME TO THE CLINIC.\n\nPlease login 5 minutes before your appointment by clicking the following link:\n[video_call_link]\n\n`,
              message: `You will be directed to the virtual waiting room. The physician will let you in the meeting once available.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
            },
            {
              name: "Phone appointment",
              intro: `This email/text message is to remind you about your upcoming PHONE appointment.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: This appointment is a phone call. DO NOT COME TO THE CLINIC.\n\n`,
              message: `Please make sure your phone is on and not on mute. The call will come from the clinic, or a No Caller ID number.\nIf you do not answer the phone, the appointment could be cancelled and rescheduled.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
            },
            {
              name: "Surgery/Procedure",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your Surgery/Procedure.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
            },
            {
              name: "Meeting",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\n`,
            },
            {
              name: "Diagnostic Imaging",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your Diagnostic Imaging procedure (ultrasound, X-ray, etc…)\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
            },
            {
              name: "Blood test / Urine test",
              intro: `This email/text message is to remind you about your upcoming IN-PERSON appointment for your blood and/or urine test.\n`,
              infos: `You have an appointment with: [host_name]\nAppointment time: [date]\nLocation: [address_of_clinic]\n\n`,
              message: `Please arrive 10 minutes before your appointment to check in at the front desk.\nBring your OHIP card and any relevant documentation.\nDue to the high volume of patients, we cannot guarantee that you will see the physician exactly at the time of your appointment. However, we make every effort possible to be respectful of your time.\n\nPlease inform the clinic at least 24 hours in advance if you need to cancel or reschedule your appointment.\n\nSpecial instructions:\nPlease do not eat or drink for at least 6 hours before your appointment.\n\n`,
            },
            { name: "[Blank]", intro: "", infos: "", message: "" },
          ],
          date_created: Date.now(),
          progress_notes_order: "top",
          site_id: siteId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );

      await axiosXanoAdmin.post(
        "/availability",
        {
          staff_id: response.data.id,
          date_created: Date.now(),
          schedule_morning: {
            monday: [
              { hours: "09", min: "00", ampm: "AM" },
              { hours: "12", min: "00", ampm: "PM" },
            ],
            tuesday: [
              { hours: "09", min: "00", ampm: "AM" },
              { hours: "12", min: "00", ampm: "PM" },
            ],
            wednesday: [
              { hours: "09", min: "00", ampm: "AM" },
              { hours: "12", min: "00", ampm: "PM" },
            ],
            thursday: [
              { hours: "09", min: "00", ampm: "AM" },
              { hours: "12", min: "00", ampm: "PM" },
            ],
            friday: [
              { hours: "09", min: "00", ampm: "AM" },
              { hours: "12", min: "00", ampm: "PM" },
            ],
            saturday: [
              { hours: "09", min: "00", ampm: "AM" },
              { hours: "12", min: "00", ampm: "PM" },
            ],
            sunday: [
              { hours: "09", min: "00", ampm: "AM" },
              { hours: "12", min: "00", ampm: "PM" },
            ],
          },
          schedule_afternoon: {
            monday: [
              { hours: "01", min: "00", ampm: "PM" },
              { hours: "04", min: "00", ampm: "PM" },
            ],
            tuesday: [
              { hours: "01", min: "00", ampm: "PM" },
              { hours: "04", min: "00", ampm: "PM" },
            ],
            wednesday: [
              { hours: "01", min: "00", ampm: "PM" },
              { hours: "04", min: "00", ampm: "PM" },
            ],
            thursday: [
              { hours: "01", min: "00", ampm: "PM" },
              { hours: "04", min: "00", ampm: "PM" },
            ],
            friday: [
              { hours: "01", min: "00", ampm: "PM" },
              { hours: "04", min: "00", ampm: "PM" },
            ],
            saturday: [
              { hours: "01", min: "00", ampm: "PM" },
              { hours: "04", min: "00", ampm: "PM" },
            ],
            sunday: [
              { hours: "01", min: "00", ampm: "PM" },
              { hours: "04", min: "00", ampm: "PM" },
            ],
          },
          unavailability: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
          },
          default_duration_hours: 1,
          default_duration_min: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      sendEmail(
        //formDatas.email,
        "virounk@gmail.com",
        datasToPost.full_name,
        "Welcome to Calvin EMR : New Life Fertility Center",
        "",
        "",
        `Please find your password for your account: ${newPassword}

          You can change your password anytime in "My account" section
    
    Best wishes,
    Powered by Calvin EMR`
      );

      toast.success("Staff member added successfully", { containerId: "A" });
      setAddVisible(false);
    } catch (err) {
      setErrMsg(err.message);
    }
  };
  return (
    <div
      className="signup-staff__container"
      style={{ border: errMsg && "solid 1px red" }}
    >
      {errMsg && <p className="signup-staff__err">{errMsg}</p>}
      <form className="signup-staff__form">
        <div className="signup-staff__column">
          <div className="signup-staff__row">
            <label>Email*: </label>
            <input
              type="email"
              value={formDatas.email}
              name="email"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-staff__row">
            <label>First Name*: </label>
            <input
              type="text"
              value={formDatas.first_name}
              onChange={handleChange}
              name="first_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff__row">
            <label>Middle Name: </label>
            <input
              type="text"
              value={formDatas.middle_name}
              onChange={handleChange}
              name="middle_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff__row">
            <label>Last Name*: </label>
            <input
              type="text"
              value={formDatas.last_name}
              onChange={handleChange}
              name="last_name"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff__row">
            <label>Gender*: </label>
            <select
              value={formDatas.gender}
              onChange={handleChange}
              name="gender"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="signup-staff__row">
            <label>Occupation*: </label>
            <select
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
          <div className="signup-staff__row">
            <label>Link for video calls: </label>
            <input
              name="video_link"
              type="text"
              autoComplete="off"
              value={formDatas.video_link}
              onChange={handleChange}
            />
          </div>
          <div className="signup-staff__row">
            <label>Clinic site*: </label>
            <select value={siteId} onChange={handleSiteChange}>
              {sites.map((site) => (
                <option value={site.id} name={site.id} key={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="signup-staff__column">
          <div className="signup-staff__row">
            <label>Speciality: </label>
            <input
              type="text"
              value={formDatas.speciality}
              onChange={handleChange}
              name="speciality"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff__row">
            <label>Subspeciality: </label>
            <input
              type="text"
              value={formDatas.subspeciality}
              onChange={handleChange}
              name="subspeciality"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff__row">
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
          <div className="signup-staff__row">
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
          <div className="signup-staff__row">
            <label>Cell phone*: </label>
            <input
              type="text"
              value={formDatas.cell_phone}
              onChange={handleChange}
              name="cell_phone"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff__row">
            <label>Backup phone: </label>
            <input
              type="text"
              value={formDatas.backup_phone}
              onChange={handleChange}
              name="backup_phone"
              autoComplete="off"
            />
          </div>
          <div className="signup-staff__row">
            <label>E-sign: </label>
            <div className="signup-staff__image">
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
      </form>
      <div className="signup-staff__submit">
        <button
          type="button"
          onClick={handleSubmit}
          value="Sign Up"
          disabled={isLoadingFile}
        >
          Sign Up
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SignupStaffForm;
