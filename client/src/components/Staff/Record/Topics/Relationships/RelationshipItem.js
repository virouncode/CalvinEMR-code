import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-widgets/scss/styles.scss";

import {
  deletePatientRecord,
  postPatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import xanoDelete from "../../../../../api/xanoCRUD/xanoDelete";
import xanoGet from "../../../../../api/xanoCRUD/xanoGet";
import useFetchPatients from "../../../../../hooks/useFetchPatients";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { relations } from "../../../../../utils/relations";
import { toInverseRelation } from "../../../../../utils/toInverseRelation";
import { toPatientName } from "../../../../../utils/toPatientName";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import PatientsSelect from "../../../../All/UI/Lists/PatientsSelect";
import RelationshipList from "../../../../All/UI/Lists/RelationshipList";
import SignCell from "../SignCell";

const RelationshipItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
  demographicsInfos,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //PATIENTS DATAS
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { patients, loading, errMsg, hasMore } = useFetchPatients(
    paging,
    item.patient_id
  );

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = parseInt(e.target.value);
    setItemInfos({ ...itemInfos, relation_id: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProgress(true);
      //Delete the inverse relation ship of item
      const inverseRelationToDeleteId = (
        await xanoGet("/relationship_between", "staff", {
          patient_id: item.relation_id,
          relation_id: item.patient_id,
        })
      ).data[0].id;

      await xanoDelete(`/relationships/${inverseRelationToDeleteId}`, "staff");

      //Put the relationship
      await putPatientRecord(
        "/relationships",
        item.id,
        user.id,

        itemInfos
      );
      //Emit socket apart to add relation_infos
      socket.emit("message", {
        route: "RELATIONSHIPS",
        action: "update",
        content: {
          id: item.id,
          data: {
            ...itemInfos,
            relation_infos: patients.find(
              ({ patient_id }) => patient_id === itemInfos.relation_id
            ),
          },
        },
      });
      //Post the inverse relationship
      let inverseRelationToPost = {};
      inverseRelationToPost.patient_id = itemInfos.relation_id;
      const gender = patients.find(
        ({ patient_id }) => patient_id === itemInfos.relation_id
      ).Gender;
      inverseRelationToPost.relationship = toInverseRelation(
        itemInfos.relationship,
        gender
      );
      inverseRelationToPost.relation_id = item.patient_id;

      if (inverseRelationToPost.relationship !== "Undefined") {
        await postPatientRecord(
          "/relationships",
          user.id,

          inverseRelationToPost
        );
      }
      //Emit socket apart to add relation_infos
      socket.emit("message", {
        route: "RELATIONSHIPS",
        action: "create",
        content: {
          data: {
            ...inverseRelationToPost,
            relation_infos: demographicsInfos,
          },
        },
      });
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to update relationship: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
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
        setProgress(true);
        if (relations.includes(itemInfos.relationship)) {
          const inverseRelationToDeleteId = (
            await xanoGet("/relationship_between", "staff", {
              patient_id: item.relation_id,
              relation_id: item.patient_id,
            })
          ).data[0].id;

          await deletePatientRecord(
            "/relationships",
            inverseRelationToDeleteId,

            socket,
            "RELATIONSHIPS"
          );
        }
        await deletePatientRecord(
          "/relationships",
          item.id,

          socket,
          "RELATIONSHIPS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(`Error unable to delete relationship: ${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
      }
    }
  };

  return (
    itemInfos && (
      <tr
        className="relationships-item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="relationships-item__btn-container">
            {!editVisible ? (
              <>
                <button onClick={handleEditClick} disabled={progress}>
                  Edit
                </button>
                <button onClick={handleDeleteClick} disabled={progress}>
                  Delete
                </button>
              </>
            ) : (
              <>
                <input
                  type="submit"
                  value="Save"
                  onClick={handleSubmit}
                  disabled={progress}
                />
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={progress}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </td>
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
              patients={patients}
              hasMore={hasMore}
              loading={loading}
              setPaging={setPaging}
            />
          ) : (
            toPatientName(item.relation_infos)
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default RelationshipItem;
