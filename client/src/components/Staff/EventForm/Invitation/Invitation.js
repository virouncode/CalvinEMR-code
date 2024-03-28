import React, { useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import { sendEmail } from "../../../../api/sendEmail";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import SiteSelect from "../SiteSelect";
import TemplatesRadio from "../Templates/TemplatesRadio";

const Invitation = ({
  setInvitationVisible,
  hostId,
  staffInfos,
  start,
  end,
  patientsGuestsInfos,
  staffGuestsInfos,
  sites,
  siteId,
  allDay,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [message, setMessage] = useState(
    user.settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    ).message
  );
  const [intro, setIntro] = useState(
    user.settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    ).intro
  );
  const [templateSelected, setTemplateSelected] = useState(
    "In person appointment"
  );
  const [siteSelectedId, setSiteSelectedId] = useState(siteId || "");
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleSend = async (e) => {
    e.preventDefault();
    if (
      templateSelected !== "Video appointment" &&
      templateSelected !== "Phone appointment" &&
      templateSelected !== "[Blank]" &&
      !siteSelectedId
    ) {
      toast.error("Please choose a clinic address first", { containerId: "A" });
      return;
    }

    if (
      templateSelected === "Video appointment" &&
      !staffInfos.find(({ id }) => id === user.id).video_link
    ) {
      toast.error(
        "You can't send a video appointment invitation without a video call link, please see My Account section",
        { containerId: "A" }
      );
      return;
    }
    const hostName = staffIdToTitleAndName(staffInfos, hostId);

    const subject = allDay
      ? `Appointment ${timestampToHumanDateTZ(start)} All Day`
      : `Appointment ${timestampToHumanDateTimeTZ(
          start
        )} - ${timestampToHumanDateTimeTZ(end)}`;

    const site = sites.find(({ id }) => id === siteSelectedId);
    const siteName = site?.name;
    const adressToSend = site?.address;
    const cityToSend = site?.city;
    const provinceToSend = site?.province_state;
    const postalCodeToSend = site?.postal_code || site?.zip_code;

    const infosToSend = user.settings.invitation_templates
      .find(({ name }) => name === templateSelected)
      .infos.replace("[host_name]", hostName)
      .replace(
        "[date]",
        allDay
          ? `${timestampToHumanDateTZ(start)} All Day`
          : `Appointment ${timestampToHumanDateTimeTZ(
              start
            )} - ${timestampToHumanDateTimeTZ(end)}`
      )
      .replace(
        "[address_of_clinic]",
        `${siteName}, ${adressToSend} ${cityToSend} ${provinceToSend} ${postalCodeToSend}`
      )
      .replace(
        "[video_call_link]",
        staffInfos.find(({ id }) => id === user.id).video_link
      );
    setProgress(true);
    for (const patientInfos of patientsGuestsInfos) {
      const patientName = toPatientName(patientInfos);
      try {
        await sendEmail(
          "virounk@gmail.com", //to be changed to patientInfo.email
          patientName,
          subject,
          intro,
          infosToSend,
          message,
          `Best wishes, \nPowered by Calvin EMR`
        );
        toast.success(`Invitation sent successfully to ${patientName}`, {
          containerId: "A",
        });
      } catch (err) {
        toast.error(`Couldn't send the invitation : ${err.text}`, {
          containerId: "A",
        });
        setProgress(false);
      }
      try {
        await axios({
          url: "/twilio",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            // from: "New Life",
            to: "+33683267962", //to be changed to patientInfos.cell_phone
            body: `
Hello ${patientName},
          
${intro}
          
${infosToSend}
          
${message}
          
Best wishes,
Powered by Calvin EMR`,
          },
        });
      } catch (err) {
        toast.error(`Couldn't send the sms invitation:${err.message}`);
      }
    }
    for (const staffGuestInfos of staffGuestsInfos) {
      try {
        await sendEmail(
          "virounk@gmail.com", //to be changed to patientInfo.mail
          staffGuestInfos.full_name,
          subject,
          intro,
          infosToSend,
          message,
          `Best wishes, \nPowered by Calvin EMR`
        );
        toast.success(
          `Invitation email successfully sent to ${staffGuestInfos.full_name}`,
          { containerId: "A" }
        );
      } catch (err) {
        toast.error(`Couldn't send the invitation email : ${err.text}`, {
          containerId: "A",
        });
        setProgress(false);
      }
      try {
        await axios({
          url: "/twilio",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            // from: "New Life",
            to: "+33683267962", //to be changed to staffInfos.cell_phone
            body: `
Hello ${staffGuestInfos.full_name},
          
${intro}
          
${infosToSend}
          
${message}
          
Best wishes,
Powered by Calvin EMR`,
          },
        });
      } catch (err) {
        toast.error(`Couldn't send the sms invitation:${err.message}`);
      }
    }
    setProgress(false);
    setInvitationVisible(false);
  };
  const handleSendAndSave = async (e) => {
    e.preventDefault();
    handleSend(e);
    const newTemplates = [...user.settings.invitation_templates];
    newTemplates.find(({ name }) => name === templateSelected).intro = intro;
    newTemplates.find(({ name }) => name === templateSelected).message =
      message;
    setProgress(true);
    try {
      await xanoPut(`/settings/${user.settings.id}`, "staff", {
        ...user.settings,
        invitation_templates: newTemplates,
      });
    } catch (err) {
      toast.error(`Error: unable to save templates: ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleIntroChange = (e) => {
    setIntro(e.target.value);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setInvitationVisible(false);
  };
  const handleTemplateChange = (e) => {
    setTemplateSelected(e.target.name);
    setIntro(
      user.settings.invitation_templates.find(
        ({ name }) => name === e.target.name
      ).intro
    );
    setMessage(
      user.settings.invitation_templates.find(
        ({ name }) => name === e.target.name
      ).message
    );
  };
  const handleSiteChange = async (e) => {
    setSiteSelectedId(parseInt(e.target.value));
  };

  return (
    <form className="invitation">
      <div className="invitation__edit">
        <div className="invitation__row">
          <TemplatesRadio
            handleTemplateChange={handleTemplateChange}
            templates={user.settings.invitation_templates}
            templateSelected={templateSelected}
          />
        </div>
        <div className="invitation__row">
          <label>Introduction</label>
          <textarea
            onChange={handleIntroChange}
            value={intro}
            style={{ height: "60px" }}
          />
        </div>
        <div className="invitation__row">
          {templateSelected === "Video appointment" ? (
            <label>
              Appointment Infos (read only,{" "}
              <span style={{ color: "red" }}>
                please be sure you provided a video call link, see "My Account"
                section
              </span>
              )
            </label>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <label>Appointment Infos (read only)</label>
              {templateSelected !== "Video appointment" &&
                templateSelected !== "Phone appointment" &&
                templateSelected !== "[Blank]" && (
                  <div>
                    <SiteSelect
                      handleSiteChange={handleSiteChange}
                      sites={sites}
                      value={siteSelectedId}
                    />
                  </div>
                )}
            </div>
          )}
          <textarea
            value={
              user.settings.invitation_templates.find(
                ({ name }) => name === templateSelected
              ).infos
            }
            readOnly
            style={{ height: "130px" }}
          />
        </div>
        <div className="invitation__row">
          <label>Message</label>
          <textarea
            onChange={handleMessageChange}
            value={message}
            style={{ height: "170px" }}
          />
        </div>
      </div>
      <div className="invitation__btns">
        {user.id === hostId && (
          <button onClick={handleSendAndSave} disabled={progress}>
            Send & Save template
          </button>
        )}
        <button onClick={handleSend} disabled={progress}>
          Send
        </button>
        <button onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Invitation;
