import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";

import xanoDelete from "../../../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../../hooks/useSocketContext";
import { nowTZTimestamp } from "../../../../../utils/formatDates";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../../All/UI/Windows/FakeWindow";
import MedTemplateEdit from "./MedTemplateEdit";

var _ = require("lodash");

const MedTemplateItem = ({
  med,
  addedMeds,
  setAddedMeds,
  setFinalInstructions,
  body,
}) => {
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);

  const handleClickMed = (e) => {
    const medToAdd = { ...med, temp_id: _.uniqueId() };
    setAddedMeds([...addedMeds, medToAdd]);
    setFinalInstructions(
      [...addedMeds, medToAdd]
        .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
        .join("\n\n") +
        "\n\n" +
        body
    );
  };

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleDuplicate = async () => {
    const datasToPost = {
      ...med,
      date_created: nowTZTimestamp(),
    };
    try {
      const response = await xanoPost(
        "/medications_templates",
        "staff",

        datasToPost
      );
      socket.emit("message", {
        route: "MEDS TEMPLATES",
        action: "create",
        content: { data: response.data },
      });
      toast.success("Medication template successfully duplicated", {
        containerId: "B",
      });
    } catch (err) {
      toast.error(`Unable to duplicate medication template: ${err.message}`);
    }
  };

  const handleDelete = async (e, medId) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      try {
        await xanoDelete(`/medications_templates/${med.id}`, "staff");
        socket.emit("message", {
          route: "MEDS TEMPLATES",
          action: "delete",
          content: { id: med.id },
        });
        toast.success("Medication template deleted successfully", {
          containerId: "B",
        });
      } catch (err) {
        toast.error(`Unable to delete medication template: ${err.message}`);
      }
    }
  };

  return (
    <>
      <li className="med-templates__item">
        <Tooltip title={"Add to RX"} placement="top-start" arrow>
          <span onClick={handleClickMed} style={{ whiteSpace: "pre" }}>
            - {med.PrescriptionInstructions}{" "}
          </span>
        </Tooltip>
        <i
          className="fa-regular fa-pen-to-square"
          style={{ marginLeft: "5px" }}
          onClick={handleEdit}
        ></i>
        <Tooltip title="Duplicate" placement="top-start" arrow>
          <i
            className="fa-solid fa-clone"
            style={{ marginLeft: "5px" }}
            onClick={handleDuplicate}
          ></i>
        </Tooltip>
        <i
          className="fa-solid fa-trash"
          style={{ marginLeft: "5px" }}
          onClick={(e) => handleDelete(e, med.id)}
        ></i>
      </li>
      {editVisible && (
        <FakeWindow
          title="EDIT MEDICATION TEMPLATE"
          width={600}
          height={750}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 750) / 2}
          color="#931621"
          setPopUpVisible={setEditVisible}
        >
          <MedTemplateEdit setEditVisible={setEditVisible} med={med} />
        </FakeWindow>
      )}
    </>
  );
};

export default MedTemplateItem;
