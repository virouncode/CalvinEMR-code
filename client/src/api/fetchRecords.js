import { axiosXanoStaff } from "../api/xanoStaff";
import { createChartNbr } from "../utils/createChartNbr";

export const getPatientRecord = async (
  tableName,
  patientId,
  authToken,
  abortController = null
) => {
  try {
    const response = await axiosXanoStaff.get(
      `${tableName}?patient_id=${patientId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        ...(abortController && { signal: abortController.signal }),
      }
    );
    return response?.data;
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const postPatientRecord = async (
  tableName,
  authId,
  authToken,
  datas,
  socket = null,
  topic = null,
  abortController = null
) => {
  if (tableName !== "/clinical_notes_log") {
    //if it's the log we don't want to change the date of creation, for attachments this is assured by the bulk add
    datas.created_by_id = authId;
    datas.date_created = Date.now();
  }
  try {
    const response = await axiosXanoStaff.post(tableName, datas, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
    if (socket && topic) {
      if (topic === "PATIENTS") {
        response.data.chart_nbr = createChartNbr(
          datas.date_of_birth,
          datas.gender_identification,
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
  tableName,
  recordId,
  authId,
  authToken,
  datas,
  socket = null,
  topic = null,
  abortController = null
) => {
  // if (
  //   tableName === "/patients" ||
  //   (tableName === "/progress_notes" && datas.version_nbr !== 1)
  // ) {
  //   datas.updated_by_id = authId;
  //   datas.date_updated = Date.now();
  // } else if (tableName === "/vaccines") {
  // } else {
  //   datas.created_by_id = authId;
  //   datas.date_created = Date.now();
  // }

  datas.updates.push({ updated_by_id: authId, date_updated: Date.now() });

  try {
    const response = await axiosXanoStaff.put(
      `${tableName}/${recordId}`,
      datas,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        ...(abortController && { signal: abortController.signal }),
      }
    );
    if (socket && topic) {
      socket.emit("message", {
        route: topic,
        action: "update",
        content: { id: recordId, data: datas },
      });
      if (topic === "APPOINTMENTS") {
        socket.emit("message", {
          route: "EVENTS",
          action: "update",
          content: { id: recordId, data: datas },
        });
      }
    }
    return response;
  } catch (err) {
    if (err.name !== "CanceledError") throw err;
  }
};

export const deletePatientRecord = async (
  tableName,
  recordId,
  authToken,
  socket,
  topic,
  abortController = null
) => {
  try {
    await axiosXanoStaff.delete(`${tableName}/${recordId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(abortController && { signal: abortController.signal }),
    });
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

// message = { route: , content : { id : id du record }, action: “delete” }
// message = { route:  ,content : { id : id du record, data : datas à updater }, action: “update” }
// message = { route: ,content : { data : datas à crée }, action: “create” }
