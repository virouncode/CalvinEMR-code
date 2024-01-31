import { CircularProgress } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import printJS from "print-js";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import logo from "../../../../assets/img/logoLoginTest.png";
import { genderCT, toCodeTableName } from "../../../../datas/codesTables";
import useAuth from "../../../../hooks/useAuth";
import {
  toLocalDate,
  toLocalDateAndTimeWithSeconds,
} from "../../../../utils/formatDates";
import { getAge } from "../../../../utils/getAge";
import { patientIdToName } from "../../../../utils/patientIdToName";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import AddressesList from "../../../All/UI/Lists/AddressesList";
import MedsTemplatesList from "../Topics/Medications/MedsTemplatesList";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const PrescriptionPU = ({ demographicsInfos, setPresVisible }) => {
  const { auth, user, clinic, socket } = useAuth();
  const [progress, setProgress] = useState(false);
  const printRef = useRef();
  const [sites, setSites] = useState([]);
  const [siteSelectedId, setSiteSelectedId] = useState(user.settings.site_id);
  const [settings, setSettings] = useState();
  const [body, setBody] = useState("");
  const [medsTemplates, setMedsTemplates] = useState(null);

  // const [fileToUpload, setFileToUpload] = useState(null);

  // useEffect(() => {
  //   const printListener = async () => {
  //     console.log("afterprint");
  //     //ADD TO CLINICAL NOTES
  //     setProgress(true);
  //     const datasAttachment = [
  //       {
  //         file: fileToUpload.data,
  //         alias: `Prescription ${patientIdToName(
  //           clinic.demographicsInfos,
  //           demographicsInfos.patient_id
  //         )} ${toLocalDateAndTimeWithSeconds(new Date())}`,
  //         date_created: Date.now(),
  //         created_by_id: user.id,
  //         created_by_user_type: "staff",
  //       },
  //     ];
  //     try {
  //       const attach_ids = (
  //         await postPatientRecord("/attachments", user.id, auth.authToken, {
  //           attachments_array: datasAttachment,
  //         })
  //       ).data;

  //       await postPatientRecord(
  //         "/clinical_notes",
  //         user.id,
  //         auth.authToken,
  //         {
  //           patient_id: demographicsInfos.patient_id,
  //           subject: `Prescription ${toLocalDateAndTimeWithSeconds(
  //             new Date()
  //           )}`,
  //           MyClinicalNotesContent: "See attachment",
  //           ParticipatingProviders: [
  //             {
  //               Name: {
  //                 FirstName: staffIdToFirstName(clinic.staffInfos, user.id),
  //                 LastName: staffIdToLastName(clinic.staffInfos, user.id),
  //               },
  //               OHIPPhysicianId: staffIdToOHIP(clinic.staffInfos, user.id),
  //               DateTimeNoteCreated: Date.now(),
  //             },
  //           ],
  //           version_nbr: 1,
  //           attachments_ids: attach_ids,
  //         },
  //         socket,
  //         "CLINICAL NOTES"
  //       );
  //       setProgress(false);
  //       toast.success("Saved succesfully to clinical notes", {
  //         containerId: "C",
  //       });
  //     } catch (err) {
  //       setProgress(false);
  //       toast.error(
  //         `Error: unable to save prescription to clinical notes: ${err.message}`,
  //         { containerId: "C" }
  //       );
  //     }
  //   };
  //   window.addEventListener("afterprint", printListener);
  //   return () => {
  //     window.removeEventListener("afterprint", printListener);
  //   };
  // }, [
  //   auth.authToken,
  //   clinic.demographicsInfos,
  //   clinic.staffInfos,
  //   demographicsInfos.patient_id,
  //   fileToUpload?.data,
  //   socket,
  //   user.id,
  // ]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchTemplates = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/medications_templates_for_staff?staff_id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setMedsTemplates(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch clinic sites: ${err.message}`, {
            containerId: "B",
          });
      }
    };
    fetchTemplates();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchSites = async () => {
      try {
        const response = await axiosXanoStaff.get(`/sites`, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        if (abortController.signal.aborted) return;
        setSites(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to fetch clinic sites: ${err.message}`, {
            containerId: "B",
          });
      }
    };
    fetchSites();
    return () => abortController.abort();
  }, [auth.authToken]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAddress = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/settings_for_staff?staff_id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setSiteSelectedId(response.data.site_id);
        setSettings(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error: unable to fetch user preferred site address: ${err.message}`,
            { containerId: "B" }
          );
      }
    };
    fetchAddress();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  // useEffect(() => {
  //   setBody(
  //     medsRx
  //       .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
  //       .join("\n\n")
  //   );
  // }, [medsRx]);

  const handleCancel = (e) => {
    setPresVisible(false);
  };

  const handlePrint = async (e) => {
    if (!siteSelectedId) {
      alert("Please choose an address first");
      return;
    }
    setProgress(true);
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      useCORS: true,
      scale: 2,
    });
    const dataURL = canvas.toDataURL("image/png");
    const pdf = new jsPDF("portrait", "pt", "a4");
    // const imgProperties = pdf.getImageProperties(dataURL);
    pdf.addImage(
      dataURL,
      "PNG",
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight()
    );
    let fileToUpload = await axiosXanoStaff.post(
      "/upload/attachment",
      {
        content: pdf.output("dataurlstring"),
      },
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
      }
    );
    setProgress(false);
    printJS(`${BASE_URL}${fileToUpload.data.path}`);
    // setFileToUpload(response);
    setProgress(true);
    const datasAttachment = [
      {
        file: fileToUpload.data,
        alias: `Prescription ${patientIdToName(
          clinic.demographicsInfos,
          demographicsInfos.patient_id
        )} ${toLocalDateAndTimeWithSeconds(new Date())}`,
        date_created: Date.now(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ];

    try {
      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: datasAttachment,
        })
      ).data;

      await postPatientRecord(
        "/clinical_notes",
        user.id,
        auth.authToken,
        {
          patient_id: demographicsInfos.patient_id,
          subject: `Prescription ${toLocalDateAndTimeWithSeconds(new Date())}`,
          MyClinicalNotesContent: "See attachment",
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(clinic.staffInfos, user.id),
                LastName: staffIdToLastName(clinic.staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(clinic.staffInfos, user.id),
              DateTimeNoteCreated: Date.now(),
            },
          ],
          version_nbr: 1,
          attachments_ids: attach_ids,
        },
        socket,
        "CLINICAL NOTES"
      );
      setProgress(false);
      toast.success("Saved succesfully to clinical notes", {
        containerId: "B",
      });
    } catch (err) {
      setProgress(false);
      toast.error(
        `Error: unable to save prescription to clinical notes: ${err.message}`,
        { containerId: "B" }
      );
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setBody(value);
  };

  const handleSiteChange = async (e) => {
    setSiteSelectedId(parseInt(e.target.value));
    try {
      await axiosXanoStaff.put(
        `/settings/${settings.id}`,
        { ...settings, site_id: parseInt(e.target.value) },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleFax = async () => {
    if (!siteSelectedId) {
      alert("Please choose an address first");
      return;
    }
    setProgress(true);
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      useCORS: true,
      scale: 2,
    });
    const dataURL = canvas.toDataURL("image/png");
    const pdf = new jsPDF("portrait", "pt", "a4");
    // const imgProperties = pdf.getImageProperties(dataURL);
    pdf.addImage(
      dataURL,
      "PNG",
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight()
    );
    let fileToUpload = await axiosXanoStaff.post(
      "/upload/attachment",
      {
        content: pdf.output("dataurlstring"),
      },
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
      }
    );

    const datasAttachment = [
      {
        file: fileToUpload.data,
        alias: `Prescription ${patientIdToName(
          clinic.demographicsInfos,
          demographicsInfos.patient_id
        )} ${toLocalDateAndTimeWithSeconds(new Date())}`,
        date_created: Date.now(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ];

    try {
      const attach_ids = (
        await postPatientRecord("/attachments", user.id, auth.authToken, {
          attachments_array: datasAttachment,
        })
      ).data;

      await postPatientRecord(
        "/clinical_notes",
        user.id,
        auth.authToken,
        {
          patient_id: demographicsInfos.patient_id,
          subject: `Prescription ${toLocalDateAndTimeWithSeconds(new Date())}`,
          MyClinicalNotesContent: "See attachment",
          ParticipatingProviders: [
            {
              Name: {
                FirstName: staffIdToFirstName(clinic.staffInfos, user.id),
                LastName: staffIdToLastName(clinic.staffInfos, user.id),
              },
              OHIPPhysicianId: staffIdToOHIP(clinic.staffInfos, user.id),
              DateTimeNoteCreated: Date.now(),
            },
          ],
          version_nbr: 1,
          attachments_ids: attach_ids,
        },
        socket,
        "CLINICAL NOTES"
      );
      setProgress(false);
      toast.success("Saved succesfully to clinical notes", {
        containerId: "B",
      });
    } catch (err) {
      setProgress(false);
      toast.error(
        `Error: unable to save prescription to clinical notes: ${err.message}`,
        { containerId: "B" }
      );
    }
  };

  return (
    <>
      <div className="prescription__actions">
        <button onClick={handlePrint} disabled={progress}>
          Print
        </button>
        <button onClick={handleFax} disabled={progress}>
          Fax
        </button>
        <button onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
        <AddressesList
          handleSiteChange={handleSiteChange}
          siteSelectedId={siteSelectedId}
          sites={sites}
        />
        {progress && <CircularProgress />}
      </div>
      <div className="prescription__section">
        <div ref={printRef} className="prescription__page">
          <div className="prescription__container">
            <div className="prescription__header">
              <div className="prescription__doctor-infos">
                <p>
                  {staffIdToTitleAndName(clinic.staffInfos, user.id)} (LIC.{" "}
                  {user.licence_nbr})
                </p>
                <p>{sites.find(({ id }) => id === siteSelectedId)?.name}</p>
                <p>
                  {sites.find(({ id }) => id === siteSelectedId)?.address}{" "}
                  {sites.find(({ id }) => id === siteSelectedId)?.postal_code}{" "}
                  {
                    sites.find(({ id }) => id === siteSelectedId)
                      ?.province_state
                  }{" "}
                  {sites.find(({ id }) => id === siteSelectedId)?.city}
                </p>
                <p>
                  Phone: {sites.find(({ id }) => id === siteSelectedId)?.phone}
                </p>
                <p>Fax: {sites.find(({ id }) => id === siteSelectedId)?.fax}</p>
              </div>
              <div className="prescription__logo">
                <img
                  src={
                    sites.find(({ id }) => id === siteSelectedId)?.logo?.url ||
                    logo
                  }
                  alt="prescription-logo"
                />
              </div>
            </div>
            <div className="prescription__subheader">
              <div className="prescription__patient-infos">
                <p>
                  Patient:{" "}
                  {patientIdToName(
                    clinic.demographicsInfos,
                    demographicsInfos.patient_id
                  )}
                  , {toCodeTableName(genderCT, demographicsInfos.Gender)},{" "}
                  {getAge(demographicsInfos.DateOfBirth)} y.o.
                </p>
              </div>
              <p className="prescription__date">
                Date emitted: {toLocalDate(new Date())}
              </p>
            </div>
            <div className="prescription__body">
              <p className="prescription__body-title">Prescription</p>
              <div className="prescription__body-content">
                <div name="body" onChange={handleChange} contentEditable>
                  {body}
                </div>
              </div>
            </div>
            <div className="prescription__sign">
              <p>Sign: </p>
              <div className="prescription__sign-image">
                <img
                  src={user.sign?.url}
                  alt="doctor sign"
                  crossOrigin="Anonymous"
                />
              </div>
            </div>
          </div>
        </div>
        <MedsTemplatesList
          medsTemplates={medsTemplates}
          body={body}
          setBody={setBody}
        />
      </div>
      {/* <div className="prescription__add">
        <label>Additional Notes: </label>
        <textarea
          name="addNotes"
          onChange={handleAddNotes}
          value={addNotes}
          placeholder="The text will appear in the prescription, under the medications"
        />
      </div> */}
    </>
  );
};

export default PrescriptionPU;
