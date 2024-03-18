import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import {
  immunizationTypeCT,
  routeCT,
  siteCT,
  toCodeTableName,
  ynIndicatorsimpleCT,
} from "../../../../../datas/codesTables";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/formatDates";
import { immunizationSchema } from "../../../../../validation/immunizationValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericCombo from "../../../../All/UI/Lists/GenericCombo";
import GenericList from "../../../../All/UI/Lists/GenericList";
import ImmunizationsList from "../../../../All/UI/Lists/ImmunizationsList";
import SignCell from "../SignCell";

const ImmunizationItem = ({
  item,
  demographicsInfos,
  patientId,
  setErrMsgPost,
  editCounter,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  useEffect(() => {
    setItemInfos(item);
  }, [item]);
  const [progress, setProgress] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "RefusedFlag") {
      setItemInfos({ ...itemInfos, RefusedFlag: { ynIndicatorsimple: value } });
      return;
    }
    if (name === "Date") {
      value = value ? dateISOToTimestampTZ(value) : null;
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleRouteChange = (value) => {
    setItemInfos({ ...itemInfos, Route: value });
  };
  const handleSiteChange = (value) => {
    setItemInfos({ ...itemInfos, Site: value });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleEditClick = () => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };
  const handleDeleteClick = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this immunization ?",
      })
    ) {
      try {
        setProgress(true);
        await deletePatientRecord(
          "/immunizations",
          itemInfos.id,

          socket,
          "IMMUNIZATIONS"
        );
        setEditVisible(false);
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(`Error unable to delete immunization: ${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
      }
    }
  };
  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...itemInfos,
      ImmunizationName: firstLetterUpper(itemInfos.ImmunizationName),
      Manufacturer: firstLetterUpper(itemInfos.Manufacturer),
    };
    //Validation
    try {
      await immunizationSchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    try {
      setProgress(true);
      await putPatientRecord(
        `/immunizations/${itemInfos.id}`,
        user.id,
        datasToPut,
        socket,
        "IMMUNIZATIONS"
      );
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error unable to save immunization: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  return (
    itemInfos && (
      <tr className="immunizations__item">
        <td>
          <div className="immunizations__item-btn-container">
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
          {editVisible ? (
            <ImmunizationsList
              name="ImmunizationType"
              list={immunizationTypeCT}
              value={itemInfos.ImmunizationType}
              handleChange={handleChange}
            />
          ) : (
            item.ImmunizationType
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ImmunizationName"
              type="text"
              value={itemInfos.ImmunizationName}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.ImmunizationName
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Manufacturer"
              type="text"
              value={itemInfos.Manufacturer}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Manufacturer
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="LotNumber"
              type="text"
              value={itemInfos.LotNumber}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.LotNumber
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericCombo
              list={routeCT}
              value={itemInfos.Route}
              handleChange={handleRouteChange}
            />
          ) : (
            item.Route
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericCombo
              list={siteCT}
              value={itemInfos.Site}
              handleChange={handleSiteChange}
            />
          ) : (
            item.Site
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Dose"
              type="text"
              value={itemInfos.Dose}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Dose
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Date"
              type="date"
              value={timestampToDateISOTZ(itemInfos.Date)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(item.Date)
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={ynIndicatorsimpleCT}
              name="RefusedFlag"
              handleChange={handleChange}
              value={itemInfos.RefusedFlag.ynIndicatorsimple}
            />
          ) : (
            toCodeTableName(
              ynIndicatorsimpleCT,
              item.RefusedFlag.ynIndicatorsimple
            )
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Instructions"
              type="text"
              value={itemInfos.Instructions}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Instructions
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Notes"
              type="text"
              value={itemInfos.Notes}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Notes
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default ImmunizationItem;
