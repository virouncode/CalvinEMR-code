// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import printJS from "print-js";
import { toast } from "react-toastify";

import { v4 as uuidv4 } from "uuid";
import { postPatientRecord } from "../../../../../../api/fetchRecords";
import xanoPost from "../../../../../../api/xanoCRUD/xanoPost";
import useFetchDatas from "../../../../../../hooks/useFetchDatas";
import useSocketContext from "../../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/useUserContext";
import { nowTZTimestamp } from "../../../../../../utils/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../../utils/staffIdToName";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../../../All/Confirm/ConfirmGlobal";
import ToastCalvin from "../../../../../All/UI/Toast/ToastCalvin";
import MedicationForm from "../MedicationForm";
import MedsTemplatesList from "../MedsTemplatesList";
import PrescriptionActions from "./PrescriptionActions";
import PrescriptionPage from "./PrescriptionPage";
import PrescriptionPagePrint from "./PrescriptionPagePrint";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const RxPU = ({ demographicsInfos, setPresVisible, patientId }) => {
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
    "/medications_templates_of_staff",
    "staff",

    "staff_id",
    user.id
  );
  const [sites] = useFetchDatas("/sites", "staff");

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

          let fileToUpload = await xanoPost(
            "/upload/attachment",
            "staff",

            {
              content: pdf.output("datauri"),
            }
          );

          printJS(`${BASE_URL}${fileToUpload.data.path}`);

          //Post the meds
          if (addedMeds.length !== 0) {
            for (let med of addedMeds) {
              const datasToPost = {
                ...med,
                patient_id: patientId,
                PrescriptionWrittenDate: nowTZTimestamp(),
                StartDate: nowTZTimestamp(),
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
            },
          ];

          const attach_ids = (
            await postPatientRecord("/clinical_notes_attachments", user.id, {
              attachments_array: datasAttachment,
            })
          ).data;

          const prescriptionToPost = {
            patient_id: patientId,
            attachment_id: attach_ids[0],
            unique_id: uniqueId,
            date_created: nowTZTimestamp(),
          };
          const response = await xanoPost(
            "/prescriptions",
            "staff",

            prescriptionToPost
          );

          socket.emit("message", {
            route: "PRESCRIPTIONS",
            action: "create",
            content: { data: response.data },
          });

          await postPatientRecord(
            "/clinical_notes",
            user.id,

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
                  DateTimeNoteCreated: nowTZTimestamp(),
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

  const handleFax = async () => {};

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

export default RxPU;
