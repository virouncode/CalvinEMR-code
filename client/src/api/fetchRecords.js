import { createChartNbr } from "../utils/createChartNbr";
import xanoDelete from "./xanoCRUD/xanoDelete";
import xanoPost from "./xanoCRUD/xanoPost";
import xanoPut from "./xanoCRUD/xanoPut";

export const postPatientRecord = async (
  url,
  userId,
  datasToPost,
  socket = null,
  topic = null,
  abortController = null
) => {
  if (url !== "/clinical_notes_log") {
    //if it's the log we don't want to change the date of creation, for attachments this is assured by the bulk add
    datasToPost.created_by_id = userId;
    datasToPost.date_created = Date.now();
  }
  try {
    const response = await xanoPost(url, "staff", datasToPost, abortController);
    if (socket && topic) {
      if (topic === "PATIENTS") {
        response.data.chart_nbr = createChartNbr(
          datasToPost.date_of_birth,
          datasToPost.gender_identification,
          response.data.id
        );
        socket.emit("message", {
          route: topic,
          action: "create",
          content: { data: response.data },
        });
      } else {
        socket.emit("message", {
          route: topic,
          action: "create",
          content: { data: response.data },
        });
        if (topic === "APPOINTMENTS") {
          socket.emit("message", {
            route: "EVENTS",
            action: "create",
            content: { data: response.data },
          });
        }
      }
    }
    return response;
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const putPatientRecord = async (
  url,
  userId,
  datasToPut,
  socket = null,
  topic = null,
  abortController = null
) => {
  if (url !== "/clinical_notes") {
    //because we have a versioning for that
    datasToPut.updates.push({
      updated_by_id: userId,
      date_updated: Date.now(),
    });
  }

  try {
    const response = await xanoPut(url, "staff", datasToPut, abortController);
    if (socket && topic) {
      socket.emit("message", {
        route: topic,
        action: "update",
        content: { id: response.data.id, data: response.data },
      });
      if (topic === "APPOINTMENTS") {
        //if appointments put events as well
        socket.emit("message", {
          route: "EVENTS",
          action: "update",
          content: { id: response.data.id, data: response.data },
        });
      }
    }
    return response;
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const deletePatientRecord = async (
  url,
  recordId,
  socket,
  topic,
  abortController = null
) => {
  try {
    await xanoDelete(`${url}/${parseInt(recordId)}`, "staff", abortController);

    if (socket && topic) {
      socket.emit("message", {
        route: topic,
        action: "delete",
        content: { id: recordId },
      });
      if (topic === "APPOINTMENTS") {
        socket.emit("message", {
          route: "EVENTS",
          action: "delete",
          content: { id: recordId },
        });
      }
    }
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};
