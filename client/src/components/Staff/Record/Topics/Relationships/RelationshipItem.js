import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-widgets/scss/styles.scss";
import {
  deletePatientRecord,
  postPatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../../api/xanoStaff";
import useAuth from "../../../../../hooks/useAuth";
import { patientIdToName } from "../../../../../utils/patientIdToName";
import { relations } from "../../../../../utils/relations";
import { toInverseRelation } from "../../../../../utils/toInverseRelation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import PatientsSelect from "../../../../All/UI/Lists/PatientsSelect";
import RelationshipList from "../../../../All/UI/Lists/RelationshipList";
import SignCell from "../SignCell";

const RelationshipItem = ({ item, editCounter, setErrMsgPost, errMsgPost }) => {
  //HOOKS
  const { auth, user, clinic, socket } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (e) => {
    setErrMsgPost("");
    let value = parseInt(e.target.value);
    setItemInfos({ ...itemInfos, relation_id: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Delete the inverse relation ship of item
      const inverseRelationToDeleteId = (
        await axiosXanoStaff.post(
          "/relationship_between",
          { patient_id: item.relation_id, relation_id: item.patient_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data[0].id;

      await axiosXanoStaff.delete(
        `/relationships/${inverseRelationToDeleteId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );

      //Put the relationship
      await putPatientRecord(
        "/relationships",
        item.id,
        user.id,
        auth.authToken,
        itemInfos,
        socket,
        "RELATIONSHIPS"
      );
      //Post the inverse relation ship
      let inverseRelationToPost = {};
      inverseRelationToPost.patient_id = itemInfos.relation_id;
      const gender = clinic.demographicsInfos.filter(
        ({ patient_id }) => patient_id === item.relation_id
      )[0].gender_identification;
      inverseRelationToPost.relationship = toInverseRelation(
        itemInfos.relationship,
        gender
      );
      inverseRelationToPost.relation_id = itemInfos.patient_id;

      if (inverseRelationToPost.relationship !== "Undefined") {
        await postPatientRecord(
          "/relationships",
          user.id,
          auth.authToken,
          inverseRelationToPost,
          socket,
          "RELATIONSHIPS"
        );
      }
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to update relationship: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleRelationshipChange = (value, itemId) => {
    setErrMsgPost("");
    setItemInfos({ ...itemInfos, relationship: value });
  };

  const handleEditClick = () => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        if (relations.includes(itemInfos.relationship)) {
          const inverseRelationToDeleteId = (
            await axiosXanoStaff.post(
              "/relationship_between",
              { patient_id: item.relation_id, relation_id: item.patient_id },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.authToken}`,
                },
              }
            )
          ).data[0].id;

          await deletePatientRecord(
            "/relationships",
            inverseRelationToDeleteId,
            auth.authToken,
            socket,
            "RELATIONSHIPS"
          );
        }
        await deletePatientRecord(
          "/relationships",
          item.id,
          auth.authToken,
          socket,
          "RELATIONSHIPS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete relationship: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  return (
    itemInfos && (
      <tr
        className="relationships-item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
      >
        <td>
          <div className="relationships-item__relationship">
            {editVisible ? (
              <RelationshipList
                value={itemInfos.relationship}
                handleChange={handleRelationshipChange}
              />
            ) : (
              itemInfos.relationship
            )}
            <span>of</span>
          </div>
        </td>
        <td>
          {editVisible ? (
            <PatientsSelect
              handleChange={handleChange}
              value={itemInfos.relation_id}
              name="relation_id"
              patientId={itemInfos.patient_id}
            />
          ) : (
            patientIdToName(clinic.demographicsInfos, itemInfos.relation_id)
          )}
        </td>
        <SignCell item={item} staffInfos={clinic.staffInfos} />
        <td>
          <div className="relationships-item__btn-container">
            {!editVisible ? (
              <>
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDeleteClick}>Delete</button>
              </>
            ) : (
              <>
                <input type="submit" value="Save" onClick={handleSubmit} />
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    )
  );
};

export default RelationshipItem;
