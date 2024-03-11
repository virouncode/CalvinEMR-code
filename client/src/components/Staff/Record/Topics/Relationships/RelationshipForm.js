import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-widgets/scss/styles.scss";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useFetchPatients from "../../../../../hooks/useFetchPatients";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { toInverseRelation } from "../../../../../utils/toInverseRelation";
import { relationshipSchema } from "../../../../../validation/relationshipValidation";
import PatientsSelect from "../../../../All/UI/Lists/PatientsSelect";
import RelationshipList from "../../../../All/UI/Lists/RelationshipList";

const RelationshipForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
  demographicsInfos,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    relationship: "",
    relation_id: "",
  });
  //PATIENTS DATAS
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { patients, loading, errMsg, hasMore } = useFetchPatients(paging);
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = parseInt(e.target.value);
    setFormDatas({ ...formDatas, relation_id: value });
  };

  const handleRelationshipChange = (value, itemId) => {
    setFormDatas({ ...formDatas, relationship: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await relationshipSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      //Post the relationship
      const response = await postPatientRecord(
        "/relationships",
        user.id,

        formDatas
      );
      //Emit socket apart to add relation_infos
      socket.emit("message", {
        route: "RELATIONSHIPS",
        action: "create",
        content: {
          data: {
            ...response.data,
            relation_infos: patients.find(
              ({ patient_id }) => patient_id === formDatas.relation_id
            ),
          },
        },
      });

      //Post the inverse relationship
      let inverseRelationToPost = {};
      inverseRelationToPost.patient_id = formDatas.relation_id;
      const gender = patients.find(
        ({ patient_id }) => patient_id === formDatas.relation_id
      ).Gender;
      inverseRelationToPost.relationship = toInverseRelation(
        formDatas.relationship,
        gender
      );
      inverseRelationToPost.relation_id = formDatas.patient_id;

      if (inverseRelationToPost.relationship !== "Undefined") {
        const response = await postPatientRecord(
          "/relationships",
          user.id,

          inverseRelationToPost
        );
        //Emit socket apart to add relation_infos
        socket.emit("message", {
          route: "RELATIONSHIPS",
          action: "create",
          content: {
            data: {
              ...response.data,
              relation_infos: demographicsInfos,
            },
          },
        });
      }
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to save relationship: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="relationships-form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="relationships-form__btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <button type="button" onClick={handleCancel} disabled={progress}>
            Cancel
          </button>
        </div>
      </td>
      <td>
        <div className="relationships-form__relationship">
          <RelationshipList
            value={formDatas.relationship}
            handleChange={handleRelationshipChange}
          />
          <span>of</span>
        </div>
      </td>
      <td>
        <PatientsSelect
          handleChange={handleChange}
          value={formDatas.relation_id}
          name="relation_id"
          patientId={patientId}
          patients={patients}
          hasMore={hasMore}
          loading={loading}
          setPaging={setPaging}
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.now())}</em>
      </td>
    </tr>
  );
};

export default RelationshipForm;
