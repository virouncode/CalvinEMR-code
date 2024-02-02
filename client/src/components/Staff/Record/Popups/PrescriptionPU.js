import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import printJS from "print-js";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDateAndTimeWithSeconds } from "../../../../utils/formatDates";
import { patientIdToName } from "../../../../utils/patientIdToName";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../utils/staffIdToName";
import ConfirmGlobal from "../../../All/Confirm/ConfirmGlobal";
import MedicationForm from "../Topics/Medications/MedicationForm";
import MedsTemplatesList from "../Topics/Medications/MedsTemplatesList";
import PrescriptionActions from "../Topics/Prescription/PrescriptionActions";
import PrescriptionPage from "../Topics/Prescription/PrescriptionPage";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const PrescriptionPU = ({ demographicsInfos, setPresVisible, patientId }) => {
  const { auth, user, clinic, socket } = useAuth();
  const [progress, setProgress] = useState(false);
  const printRef = useRef();
  const [sites, setSites] = useState(null);
  const [siteSelectedId, setSiteSelectedId] = useState(user.settings.site_id);
  const [settings, setSettings] = useState();
  const [medsTemplates, setMedsTemplates] = useState(null);
  const [addedMeds, setAddedMeds] = useState([]);
  const [uniqueId, setUniqueId] = useState(uuidv4());

  useEffect(() => {
    const abortController = new AbortController();
    const fetchTemplates = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/medications_templates_for_staff?staff_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setMedsTemplates(
          response.data.sort((a, b) => a.DrugName.localeCompare(b.DrugName))
        );
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
            "Content-Type": "application/json",
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
              "Content-Type": "application/json",
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

  const handleCancel = (e) => {
    setPresVisible(false);
  };

  const handlePostMeds = async (e) => {
    for (let med of addedMeds) {
      const datasToPost = {
        ...med,
        patient_id: patientId,
        PrescriptionWrittenDate: Date.now(),
        StartDate: Date.now(),
        PrescribedBy: {
          Name: {
            FirstName: staffIdToFirstName(clinic.staffInfos, user.id),
            LastName: staffIdToLastName(clinic.staffInfos, user.id),
          },
        },
        PrescriptionIdentifier: uniqueId,
      };
      if (datasToPost.hasOwnProperty("id")) delete datasToPost.id;
      if (datasToPost.hasOwnProperty("temp_id")) delete datasToPost.temp_id;
      if (datasToPost.hasOwnProperty("staff_id")) delete datasToPost.staff_id;
      if (datasToPost.hasOwnProperty("date_created"))
        delete datasToPost.date_created;
      if (datasToPost.hasOwnProperty("created_by_id"))
        delete datasToPost.created_by_id;
      if (datasToPost.hasOwnProperty("updates")) delete datasToPost.updates;

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
  };

  const handlePrint = async (e) => {
    if (!siteSelectedId) {
      alert("Please choose an address first");
      return;
    }
    if (addedMeds.length === 0) {
      alert("Your prescription is empty !");
      return;
    }
    //Post the meds
    handlePostMeds();
    //Generate pdf
    setProgress(true);
    const element = printRef.current;

    try {
      const canvas = await html2canvas(element, {
        removeContainer: false,
        useCORS: true,
        ignoreElements: (element) => element.classList.contains("fa-trash"),
      });
      const dataURL = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "cm",
      });
      pdf.addImage(dataURL, "PNG", 0, 0, 21, 29.7);

      let fileToUpload = await axiosXanoStaff.post(
        "/upload/attachment",
        {
          content: pdf.output("dataurlstring"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      printJS(`${BASE_URL}${fileToUpload.data.path}`);
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
      setAddedMeds([]);
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

  const handleFax = async () => {
    if (!siteSelectedId) {
      alert("Please choose an address first");
      return;
    }
    if (addedMeds.length === 0) {
      alert("Your prescription is empty !");
      return;
    }
    setProgress(true);
    const element = printRef.current;

    try {
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
            "Content-Type": "application/json",
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
          printRef={printRef}
          sites={sites}
          siteSelectedId={siteSelectedId}
          patientId={patientId}
          demographicsInfos={demographicsInfos}
          addedMeds={addedMeds}
          setAddedMeds={setAddedMeds}
          uniqueId={uniqueId}
        />
        <div className="prescription__medications">
          <MedsTemplatesList
            setMedsTemplates={setMedsTemplates}
            medsTemplates={medsTemplates}
            addedMeds={addedMeds}
            setAddedMeds={setAddedMeds}
            patientId={patientId}
            progress={progress}
          />
          <MedicationForm
            patientId={patientId}
            addedMeds={addedMeds}
            setAddedMeds={setAddedMeds}
            progress={progress}
          />
        </div>
      </div>

      <ConfirmGlobal isPopUp={true} />
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
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
