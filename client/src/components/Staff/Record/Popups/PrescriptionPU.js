// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import printJS from "print-js";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useFetchDatas from "../../../../hooks/useFetchDatas";
import useSocketContext from "../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../hooks/useUserContext";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/staffIdToName";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import MedicationForm from "../Topics/Medications/MedicationForm";
import MedsTemplatesList from "../Topics/Medications/MedsTemplatesList";
import PrescriptionActions from "../Topics/Prescription/PrescriptionActions";
import PrescriptionPage from "../Topics/Prescription/PrescriptionPage";
import PrescriptionPagePrint from "../Topics/Prescription/PrescriptionPagePrint";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const PrescriptionPU = ({ demographicsInfos, setPresVisible, patientId }) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();

  const [progress, setProgress] = useState(false);
  const printRef = useRef();
  const [siteSelectedId, setSiteSelectedId] = useState(user.site_id);
  const [addedMeds, setAddedMeds] = useState([]);
  const [uniqueId, setUniqueId] = useState(uuidv4());
  const [body, setBody] = useState("");
  const [printVisible, setPrintVisible] = useState(false);
  const [finalInstructions, setFinalInstructions] = useState("");
  const [medsTemplates, setMedsTemplates] = useFetchDatas(
    "/medications_templates_for_staff",
    axiosXanoStaff,
    auth.authToken,
    "staff_id",
    user.id
  );
  const [sites, setSites] = useFetchDatas(
    "/sites",
    axiosXanoStaff,
    auth.authToken
  );

  useEffect(() => {
    const generatePrescription = async () => {
      if (!siteSelectedId) {
        alert("Please choose a site first");
        return;
      }
      if (!body.trim() && addedMeds.length === 0) {
        alert("Your prescription is empty !");
        return;
      }
      if (
        addedMeds.find(
          ({ PrescriptionInstructions }) => !PrescriptionInstructions.trim()
        )
      ) {
        alert(
          "It seems that you have added one or more medications and deleted the corresponding instructions. Please click on the trash icon to remove the medication(s)."
        );
        return;
      }
      if (
        addedMeds.length !== 0 ||
        (addedMeds.length === 0 &&
          (await confirmAlert({
            content:
              "It appears that you haven't utilized the forms on the right to add medications but instead entered free text. Please be aware that the prescription will be generated without recording any medications in the patient's electronic medical record. Continue ?",
          })))
      ) {
        try {
          //Create PDF and display print page
          setProgress(true);
          const element = printRef.current;
          const canvas = await html2canvas(element, {
            useCORS: true,
          });
          const dataURL = canvas.toDataURL("image/jpeg");
          const pdf = new jsPDF({
            unit: "cm",
            compress: true,
          });
          pdf.addImage(dataURL, "JPEG", 0, 0, 21, 29.7);
          const pdfDataURL = pdf.output("dataurl");

          let fileToUpload = await axiosXanoStaff.post(
            "/upload/attachment",
            {
              content: pdfDataURL,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
            }
          );

          printJS(`${BASE_URL}${fileToUpload.data.path}`);

          //Post the meds
          if (addedMeds.length !== 0) {
            for (let med of addedMeds) {
              const datasToPost = {
                ...med,
                patient_id: patientId,
                PrescriptionWrittenDate: Date.now(),
                StartDate: Date.now(),
                PrescribedBy: {
                  Name: {
                    FirstName: staffIdToFirstName(staffInfos, user.id),
                    LastName: staffIdToLastName(staffInfos, user.id),
                  },
                },
                PrescriptionIdentifier: uniqueId,
              };
              if (datasToPost.hasOwnProperty("id")) delete datasToPost.id;
              if (datasToPost.hasOwnProperty("temp_id"))
                delete datasToPost.temp_id;
              if (datasToPost.hasOwnProperty("staff_id"))
                delete datasToPost.staff_id;
              if (datasToPost.hasOwnProperty("date_created"))
                delete datasToPost.date_created;
              if (datasToPost.hasOwnProperty("created_by_id"))
                delete datasToPost.created_by_id;
              if (datasToPost.hasOwnProperty("updates"))
                delete datasToPost.updates;

              try {
                await postPatientRecord(
                  "/medications",
                  user.id,
                  auth.authToken,
                  datasToPost,
                  socket,
                  "MEDICATIONS AND TREATMENTS"
                );
              } catch (err) {
                toast.error(`Unable to add med to database: ${err.message}`);
              }
            }
          }

          //Create clinical note
          const datasAttachment = [
            {
              file: fileToUpload.data,
              alias: `Prescription (id:${uniqueId})`,
              date_created: Date.now(),
              created_by_id: user.id,
              created_by_user_type: "staff",
            },
          ];

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
              subject: `Prescription (id:${uniqueId})`,
              MyClinicalNotesContent: "See attachment",
              ParticipatingProviders: [
                {
                  Name: {
                    FirstName: staffIdToFirstName(staffInfos, user.id),
                    LastName: staffIdToLastName(staffInfos, user.id),
                  },
                  OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
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
          setAddedMeds([]);
          setFinalInstructions("");
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
      }
    };
    if (printVisible) {
      generatePrescription();
      setPrintVisible(false);
    }
  }, [
    addedMeds,
    auth.authToken,
    body,
    staffInfos,
    demographicsInfos.patient_id,
    patientId,
    printVisible,
    siteSelectedId,
    socket,
    uniqueId,
    user.id,
  ]);

  const handleCancel = (e) => {
    setPresVisible(false);
  };

  const handleSiteChange = async (e) => {
    setSiteSelectedId(parseInt(e.target.value));
  };

  const handlePrint = () => setPrintVisible(true);

  const handleFax = async () => {
    // if (!siteSelectedId) {
    //   alert("Please choose an address first");
    //   return;
    // }
    // if (addedMeds.length === 0) {
    //   alert("Your prescription is empty !");
    //   return;
    // }
    // setProgress(true);
    // const element = printRef.current;
    // try {
    //   const canvas = await html2canvas(element, {
    //     logging: true,
    //     letterRendering: 1,
    //     allowTaint: false,
    //     useCORS: true,
    //     scale: 2,
    //   });
    //   const dataURL = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF("portrait", "pt", "a4");
    //   pdf.addImage(
    //     dataURL,
    //     "PNG",
    //     0,
    //     0,
    //     pdf.internal.pageSize.getWidth(),
    //     pdf.internal.pageSize.getHeight()
    //   );
    //   let fileToUpload = await axiosXanoStaff.post(
    //     "/upload/attachment",
    //     {
    //       content: pdf.output("dataurlstring"),
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${auth.authToken}`,
    //       },
    //     }
    //   );
    //   const datasAttachment = [
    //     {
    //       file: fileToUpload.data,
    //       alias: `Prescription ${patientIdToName(
    //         clinic.demographicsInfos,
    //         demographicsInfos.patient_id
    //       )} ${toLocalDateAndTimeWithSeconds(new Date())}`,
    //       date_created: Date.now(),
    //       created_by_id: user.id,
    //       created_by_user_type: "staff",
    //     },
    //   ];
    //   const attach_ids = (
    //     await postPatientRecord("/attachments", user.id, auth.authToken, {
    //       attachments_array: datasAttachment,
    //     })
    //   ).data;
    //   await postPatientRecord(
    //     "/clinical_notes",
    //     user.id,
    //     auth.authToken,
    //     {
    //       patient_id: demographicsInfos.patient_id,
    //       subject: `Prescription ${toLocalDateAndTimeWithSeconds(new Date())}`,
    //       MyClinicalNotesContent: "See attachment",
    //       ParticipatingProviders: [
    //         {
    //           Name: {
    //             FirstName: staffIdToFirstName(staffInfos, user.id),
    //             LastName: staffIdToLastName(staffInfos, user.id),
    //           },
    //           OHIPPhysicianId: staffIdToOHIP(staffInfos, user.id),
    //           DateTimeNoteCreated: Date.now(),
    //         },
    //       ],
    //       version_nbr: 1,
    //       attachments_ids: attach_ids,
    //     },
    //     socket,
    //     "CLINICAL NOTES"
    //   );
    //   setProgress(false);
    //   toast.success("Saved succesfully to clinical notes", {
    //     containerId: "B",
    //   });
    // } catch (err) {
    //   setProgress(false);
    //   toast.error(
    //     `Error: unable to save prescription to clinical notes: ${err.message}`,
    //     { containerId: "B" }
    //   );
    // }
  };

  return (
    <>
      <PrescriptionActions
        handlePrint={handlePrint}
        handleFax={handleFax}
        handleCancel={handleCancel}
        handleSiteChange={handleSiteChange}
        sites={sites}
        siteSelectedId={siteSelectedId}
        progress={progress}
      />
      <div className="prescription__form">
        <PrescriptionPage
          sites={sites}
          siteSelectedId={siteSelectedId}
          patientId={patientId}
          demographicsInfos={demographicsInfos}
          addedMeds={addedMeds}
          setAddedMeds={setAddedMeds}
          uniqueId={uniqueId}
          body={body}
          setBody={setBody}
          setFinalInstructions={setFinalInstructions}
        />
        <div className="prescription__medications">
          <MedsTemplatesList
            setMedsTemplates={setMedsTemplates}
            medsTemplates={medsTemplates}
            addedMeds={addedMeds}
            setAddedMeds={setAddedMeds}
            patientId={patientId}
            progress={progress}
            setFinalInstructions={setFinalInstructions}
            body={body}
          />
          <MedicationForm
            patientId={patientId}
            addedMeds={addedMeds}
            setAddedMeds={setAddedMeds}
            progress={progress}
            setFinalInstructions={setFinalInstructions}
            body={body}
          />
        </div>
      </div>
      {printVisible && (
        <PrescriptionPagePrint
          printRef={printRef}
          sites={sites}
          siteSelectedId={siteSelectedId}
          demographicsInfos={demographicsInfos}
          uniqueId={uniqueId}
          finalInstructions={finalInstructions}
        />
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default PrescriptionPU;
