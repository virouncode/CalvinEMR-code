import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../../../api/fetchRecords";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { pharmacySchema } from "../../../../../validation/pharmacyValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../All/UI/Lists/GenericList";
import SignCell from "../SignCell";

const PharmacyItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
  demographicsInfos,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [postalOrZip, setPostalOrZip] = useState("postal");

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "Address":
        setItemInfos({
          ...itemInfos,
          Address: {
            ...itemInfos.Address,
            Structured: {
              ...itemInfos.Address?.Structured,
              Line1: value,
            },
          },
        });
        break;
      case "PhoneNumber":
        setItemInfos({
          ...itemInfos,
          PhoneNumber: itemInfos.PhoneNumber.map((item) => {
            return item._phoneNumberType === "W"
              ? {
                  ...item,
                  phoneNumber: value,
                }
              : item;
          }),
        });
        break;
      case "FaxNumber":
        setItemInfos({
          ...itemInfos,
          FaxNumber: {
            ...itemInfos.FaxNumber,
            phoneNumber: value,
          },
        });
        break;
      case "Province":
        setItemInfos({
          ...itemInfos,
          Address: {
            ...itemInfos.Address,
            Structured: {
              ...itemInfos.Address?.Structured,
              CountrySubDivisionCode: value,
            },
          },
        });
        break;
      case "PostalCode":
        setItemInfos({
          ...itemInfos,
          Address: {
            ...itemInfos.Address,
            Structured: {
              ...itemInfos.Address?.Structured,
              PostalZipCode:
                postalOrZip === "postal"
                  ? { PostalCode: value, ZipCode: "" }
                  : { PostalCode: "", ZipCode: value },
            },
          },
        });
        break;
      case "City":
        setItemInfos({
          ...itemInfos,
          Address: {
            ...itemInfos.Address,
            Structured: {
              ...itemInfos.Address?.Structured,
              City: value,
            },
          },
        });
        break;
      default:
        setItemInfos({ ...itemInfos, [name]: value });
        break;
    }
  };

  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setItemInfos({
      ...itemInfos,
      Address: {
        ...itemInfos.Address,
        Structured: {
          ...itemInfos.Address.Structured,
          PostalZipCode: {
            PostalCode: "",
            ZipCode: "",
          },
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...itemInfos,
    };

    datasToPut.Name = firstLetterUpper(datasToPut.Name);
    datasToPut.Address.Structured.Line1 = firstLetterUpper(
      datasToPut.Address.Structured.Line1
    );
    datasToPut.Address.Structured.City = firstLetterUpper(
      datasToPut.Address.Structured.City
    );
    datasToPut.EmailAddress = datasToPut.EmailAddress.toLowerCase();
    //Validation
    try {
      await pharmacySchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    if (
      await confirmAlert({
        content: `You're about to update ${itemInfos.Name} infos, proceed ?`,
      })
    ) {
      try {
        await putPatientRecord(
          "/pharmacies",
          item.id,
          user.id,
          auth.authToken,
          datasToPut,
          socket,
          "PHARMACIES"
        );
        socket.emit("message", {
          route: "PREFERRED PHARMACY",
          action: "update",
          content: {
            id: item.id,
            data: datasToPut,
          },
          patientId: demographicsInfos.patient_id,
        });
        editCounter.current -= 1;
        setEditVisible(false);
        toast.success("Saved successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to update pharmacy:${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  const handleAddItemClick = async (e) => {
    if (
      await confirmAlert({
        content:
          "You are about to change the patient's preferred pharmacy, proceed ?",
      })
    ) {
      //get patient demographics
      try {
        const newPatientDemographics = {
          ...demographicsInfos,
          PreferredPharmacy: item.id,
        };
        await putPatientRecord(
          "/demographics",
          demographicsInfos.id,
          user.id,
          auth.authToken,
          newPatientDemographics,
          socket,
          "DEMOGRAPHICS"
        );
        socket.emit("message", {
          route: "PREFERRED PHARMACY",
          action: "refresh",
          content: {
            id: item.id,
            data: item,
          },
          patientId: demographicsInfos.patient_id,
        });
        toast.success("Updated patient preferred pharmacy", {
          containerId: "B",
        });
      } catch (err) {
        toast.error(
          `Error: unable to update patient preferred pharmacy:${err.message}`,
          {
            containerId: "B",
          }
        );
      }
    }
  };
  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleCancel = () => {
    setEditVisible(false);
    setItemInfos(item);
  };

  return (
    itemInfos && (
      <tr
        className="pharmacies-list__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          {editVisible ? (
            <input
              name="Name"
              type="text"
              value={itemInfos.Name}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Name
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Address"
              type="text"
              value={itemInfos.Address.Structured.Line1}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Address.Structured.Line1
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="City"
              type="text"
              value={itemInfos.Address.Structured.City}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Address.Structured.City
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={provinceStateTerritoryCT}
              value={itemInfos.Address.Structured.CountrySubDivisionCode}
              name="Province"
              handleChange={handleChange}
              noneOption={false}
            />
          ) : (
            toCodeTableName(
              provinceStateTerritoryCT,
              item.Address.Structured.CountrySubDivisionCode
            )
          )}
        </td>
        <td className="td--postal">
          {editVisible ? (
            <>
              <select
                style={{ width: "60px", marginRight: "10px" }}
                name="postalOrZip"
                id="postalOrZip"
                value={postalOrZip}
                onChange={handleChangePostalOrZip}
              >
                <option value="postal">Postal</option>
                <option value="zip">Zip</option>
              </select>
              <input
                name="PostalCode"
                type="text"
                value={
                  postalOrZip === "postal"
                    ? itemInfos.Address.Structured.PostalZipCode.PostalCode
                    : itemInfos.Address.Structured.PostalZipCode.ZipCode
                }
                onChange={handleChange}
                autoComplete="off"
              />
            </>
          ) : (
            item.Address.Structured.PostalZipCode.PostalCode ||
            item.Address.Structured.PostalZipCode.ZipCode
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="PhoneNumber"
              type="text"
              value={itemInfos.PhoneNumber[0].phoneNumber}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.PhoneNumber[0].phoneNumber
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="FaxNumber"
              type="text"
              value={itemInfos.FaxNumber.phoneNumber}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.FaxNumber.phoneNumber
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="EmailAddress"
              type="email"
              value={itemInfos.EmailAddress}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.EmailAddress
          )}
        </td>
        <SignCell item={item} />
        <td>
          <div className="pharmacies__item-btn-container">
            {!editVisible ? (
              <>
                <button
                  onClick={handleAddItemClick}
                  disabled={demographicsInfos.PreferredPharmacy === item.id}
                >
                  Prefer
                </button>
                <button onClick={handleEditClick}>Edit</button>
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

export default PharmacyItem;
