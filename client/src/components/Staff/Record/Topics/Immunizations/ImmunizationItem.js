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
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
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
}) => {
  const { auth, user, clinic, socket } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "RefusedFlag") {
      setItemInfos({ ...itemInfos, RefusedFlag: { ynIndicatorsimple: value } });
      return;
    }
    if (name === "Date") {
      value = value ? Date.parse(new Date(value)) : null;
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
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleEditClick = () => {
    // editCounter.current += 1;
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
        await deletePatientRecord(
          "/immunizations",
          itemInfos.id,
          auth.authToken,
          socket,
          "IMMUNIZATIONS"
        );
        setEditVisible(false);
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error unable to delete immunization: ${err.message}`, {
          containerId: "B",
        });
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
      await putPatientRecord(
        "/immunizations",
        itemInfos.id,
        auth.id,
        auth.authToken,
        datasToPut,
        socket,
        "IMMUNIZATIONS"
      );
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error unable to save immunization: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    itemInfos && (
      <tr className="immunizations__item">
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
            routeCT.find(({ code }) => code === item.Route)?.name || item.Route
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
            siteCT.find(({ code }) => code === item.Site)?.name || item.Site
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
              value={toLocalDate(itemInfos.Date)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            toLocalDate(item.Date)
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
        <SignCell item={item} staffInfos={clinic.staffInfos} />
        <td>
          <div className="immunizations__item-btn-container">
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

export default ImmunizationItem;
