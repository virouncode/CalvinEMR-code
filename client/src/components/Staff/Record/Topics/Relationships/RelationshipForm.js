import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-widgets/scss/styles.scss";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toInverseRelation } from "../../../../../utils/relationships/toInverseRelation";
import { relationshipSchema } from "../../../../../validation/record/relationshipValidation";
import PatientsSelect from "../../../../UI/Lists/PatientsSelect";
import RelationshipList from "../../../../UI/Lists/RelationshipList";

const RelationshipForm = ({
  editCounter,
  setAddVisible,
  patientId,
  setErrMsgPost,
  errMsgPost,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    patient_id: patientId,
    relationship: "",
    relation_infos: {},
  });

  const [progress, setProgress] = useState(false);

  const handleRelationshipChange = (value, itemId) => {
    setErrMsgPost("");
    setFormDatas({ ...formDatas, relationship: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datasToPost = {
      patient_id: patientId,
      relationship: formDatas.relationship,
      relation_id: formDatas.relation_infos.patient_id,
    };

    //Validation
    try {
      await relationshipSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      //Post the relationship
      await postPatientRecord(
        "/relationships",
        user.id,
        datasToPost,
        socket,
        "RELATIONSHIPS"
      );
      //Post the inverse relationship
      let inverseRelationToPost = {};
      inverseRelationToPost.patient_id = formDatas.relation_infos.patient_id;
      const gender = formDatas.relation_infos.Gender;
      inverseRelationToPost.relationship = toInverseRelation(
        formDatas.relationship,
        toCodeTableName(genderCT, gender)
      );
      inverseRelationToPost.relation_id = formDatas.patient_id;

      if (inverseRelationToPost.relationship !== "Undefined") {
        await postPatientRecord(
          "/relationships",
          user.id,
          inverseRelationToPost,
          socket,
          "RELATIONSHIPS"
        );
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
      <td style={{ position: "relative" }}>
        <PatientsSelect
          formDatas={formDatas}
          setFormDatas={setFormDatas}
          patientId={patientId}
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </tr>
  );
};

export default RelationshipForm;
