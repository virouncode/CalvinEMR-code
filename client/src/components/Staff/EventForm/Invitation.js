import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendEmail } from "../../../api/sendEmail";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import AddressesList from "../../All/UI/Lists/AddressesList";
import TemplatesRadio from "./TemplatesRadio";

const Invitation = ({
  setInvitationVisible,
  hostId,
  staffInfos,
  start,
  end,
  patientsGuestsInfos,
  staffGuestsInfos,
  settings,
}) => {
  //HOOKS
  const { auth, user } = useAuth();
  const [message, setMessage] = useState(
    settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    ).message
  );
  const [intro, setIntro] = useState(
    settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    ).intro
  );
  const [templateSelected, setTemplateSelected] = useState(
    "In person appointment"
  );
  const [siteSelectedId, setSiteSelectedId] = useState(settings.site_id || "");
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchSites = async () => {
      try {
        const response = await axiosXanoStaff.get(`/sites`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setSites(response.data);
      } catch (err) {
        toast.error(`Error: unable to get clinic sites: ${err.message}`, {
          containerId: "A",
        });
      }
    };
    fetchSites();
    return () => abortController.abort();
  }, [auth.authToken]);

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
    const hostName = staffIdToTitleAndName(staffInfos, hostId, true);

    let optionsDate = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    let optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const subject = `Appointment ${new Date(start).toLocaleString(
      "en-CA",
      optionsDate
    )} - ${new Date(start).toLocaleTimeString("en-CA", optionsTime)}`;

    const clinic = sites.find(({ id }) => id === siteSelectedId);
    const clinicName = clinic?.name;
    const adressToSend = clinic?.address;
    const postalCodeToSend = clinic?.postal_code;
    const cityToSend = clinic?.city;
    const countryToSend = clinic?.country;

    const infosToSend = settings.invitation_templates
      .find(({ name }) => name === templateSelected)
      .infos.replace("[host_name]", hostName)
      .replace(
        "[date]",
        `${new Date(start).toLocaleString("en-CA", optionsDate)} ${new Date(
          start
        ).toLocaleTimeString("en-CA", optionsTime)} - ${new Date(
          end
        ).toLocaleTimeString("en-CA", optionsTime)}`
      )
      .replace(
        "[address_of_clinic]",
        `${clinicName} ${adressToSend} ${postalCodeToSend} ${cityToSend} ${countryToSend}`
      )
      .replace(
        "[video_call_link]",
        staffInfos.find(({ id }) => id === user.id).video_link
      );

    for (const patientInfos of patientsGuestsInfos) {
      const patientName =
        patientInfos.Names.LegalName.FirstName.Part +
        " " +
        patientInfos.Names.LegalName.OtherName.Part +
        " " +
        patientInfos.Names.LegalName.LastName.Part;
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
      }
      fetch("/api/twilio/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // from: "New Life",
          to: "+33683267962", //to be changed to patientInfos.cell_phone
          body: `
Hello ${patientName},
          
${intro}
          
${infosToSend}
          
${message}
          
Best wishes,
Powered by Calvin EMR`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
          } else {
            console.log("error");
            toast.error(`Couldn't send the sms invitation`, {
              containerId: "A",
            });
          }
        });
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
      }
      fetch("/api/twilio/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // from: "New Life",
          to: "+33683267962", //to be changed to staffInfos.cell_phone
          body: `
Hello ${staffGuestInfos.full_name},
          
${intro}
          
${infosToSend}
          
${message}
          
Best wishes,
Powered by Calvin EMR`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
          } else {
            console.log("error");
            toast.error(`Couldn't send the sms invitation : $(err.text)`, {
              containerId: "A",
            });
          }
        });
    }
  };
  const handleSendAndSave = async (e) => {
    e.preventDefault();
    handleSend(e);
    const newTemplates = [...settings.invitation_templates];
    newTemplates.find(({ name }) => name === templateSelected).intro = intro;
    newTemplates.find(({ name }) => name === templateSelected).message =
      message;
    try {
      await axiosXanoStaff.put(
        `/settings/${settings.id}`,
        { ...settings, invitation_templates: newTemplates },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    } catch (err) {
      toast.error(`Error: unable to get user settings: ${err.message}`, {
        containerId: "A",
      });
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
      settings.invitation_templates.find(({ name }) => name === e.target.name)
        .intro
    );
    setMessage(
      settings.invitation_templates.find(({ name }) => name === e.target.name)
        .message
    );
  };
  const handleSiteChange = async (e) => {
    setSiteSelectedId(parseInt(e.target.value));
    try {
      await axiosXanoStaff.put(
        `/settings/${settings.id}`,
        { ...settings, site_id: parseInt(e.target.value) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="invitation">
      <div className="invitation__edit">
        <div className="invitation__row">
          <TemplatesRadio
            handleTemplateChange={handleTemplateChange}
            templates={settings.invitation_templates}
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
            <label>
              Appointment Infos (read only)
              {templateSelected !== "Video appointment" &&
                templateSelected !== "Phone appointment" &&
                templateSelected !== "[Blank]" && (
                  <AddressesList
                    handleSiteChange={handleSiteChange}
                    siteSelectedId={siteSelectedId}
                    sites={sites}
                  />
                )}
            </label>
          )}
          <textarea
            value={
              settings.invitation_templates.find(
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
          <button onClick={handleSendAndSave}>Send & Save Template</button>
        )}
        <button onClick={handleSend}>Send</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default Invitation;
