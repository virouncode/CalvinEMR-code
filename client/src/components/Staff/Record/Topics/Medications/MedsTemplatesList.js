import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPatientRecord } from "../../../../../api/fetchRecords";
import useAuth from "../../../../../hooks/useAuth";
import { onMessageMedTemplate } from "../../../../../utils/socketHandlers/onMessageMedTemplate";
import FakeWindow from "../../../../All/UI/Windows/FakeWindow";
import MedTemplateForm from "./MedTemplateForm";
import MedTemplateItem from "./MedTemplateItem";

const MedsTemplatesList = ({
  setMedsTemplates,
  medsTemplates,
  addedMeds,
  setAddedMeds,
  patientId,
  progress,
}) => {
  const { auth, socket, user } = useAuth();
  const [newVisible, setNewVisible] = useState(false);
  const [allergies, setAllergies] = useState(null);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [filteredMedsTemplates, setFilteredMedsTemplates] = useState(null);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageMedTemplate(message, medsTemplates, setMedsTemplates, user.id);
    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
    };
  }, [medsTemplates, setMedsTemplates, socket, user.id]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAllergies = async () => {
      try {
        const allergiesResults = await getPatientRecord(
          "/allergies_for_patient",
          patientId,
          auth.authToken,
          abortController
        );
        if (abortController.signal.aborted) return;
        setAllergies(allergiesResults);
      } catch (err) {
        setErr(`Error: unable to fetch patient allergies: ${err.message}`);
      }
    };
    fetchAllergies();
    return () => {
      abortController.abort();
    };
  }, [auth.authToken, patientId]);

  useEffect(() => {
    if (!medsTemplates) return;
    setFilteredMedsTemplates(
      medsTemplates.filter(({ DrugName }) =>
        DrugName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [medsTemplates, search]);

  const handleNew = (e) => {
    setNewVisible(true);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="med-templates__list">
      <div className="medications-form__title">
        <p>Medications Templates</p>
        <button onClick={handleNew} disabled={progress}>
          New
        </button>
      </div>
      <div className="med-templates__search">
        <input
          placeholder="Search by drug name..."
          value={search}
          onChange={handleChange}
        />
      </div>
      {err && <p>{err}</p>}
      <div className="med-templates__allergies">
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ color: "#ff0000" }}
        ></i>{" "}
        Patient Allergies :{" "}
        {allergies ? (
          allergies.length > 0 ? (
            allergies
              .map((allergy) => allergy.OffendingAgentDescription)
              .join(", ")
          ) : (
            "No Allergies"
          )
        ) : (
          <CircularProgress size="1rem" />
        )}
      </div>
      <ul>
        {filteredMedsTemplates ? (
          filteredMedsTemplates.map((med) => (
            <MedTemplateItem
              med={med}
              key={med.id}
              addedMeds={addedMeds}
              setAddedMeds={setAddedMeds}
            />
          ))
        ) : (
          <CircularProgress />
        )}
      </ul>
      {newVisible && (
        <FakeWindow
          title="NEW MEDICATION TEMPLATE"
          width={600}
          height={750}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 750) / 2}
          color="#931621"
          setPopUpVisible={setNewVisible}
        >
          <MedTemplateForm setNewVisible={setNewVisible} />
        </FakeWindow>
      )}
    </div>
  );
};

export default MedsTemplatesList;
