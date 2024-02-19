import React, { useEffect, useState } from "react";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useFetchTopicDatas from "../../../../../hooks/useFetchTopicDatas";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { onMessageMedTemplate } from "../../../../../utils/socketHandlers/onMessageMedTemplate";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";
import CircularProgressSmall from "../../../../All/UI/Progress/CircularProgressSmall";
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
  setFinalInstructions,
  body,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [newVisible, setNewVisible] = useState(false);
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 20,
    offset: 0,
  });
  const {
    topicDatas: allergies,
    loading: loadingAllergies,
    errMsg: errAllergies,
  } = useFetchTopicDatas("/allergies_for_patient", paging, patientId);

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
      <div className="med-templates__allergies">
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ color: "#ff0000" }}
        ></i>{" "}
        Patient Allergies :{" "}
        {loadingAllergies ? (
          <CircularProgressSmall />
        ) : errAllergies ? (
          errAllergies
        ) : allergies && allergies.length > 0 ? (
          allergies
            .map((allergy) => allergy.OffendingAgentDescription)
            .join(", ")
        ) : (
          "No allergies"
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
              setFinalInstructions={setFinalInstructions}
              body={body}
            />
          ))
        ) : (
          <CircularProgressMedium />
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
