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
import { doctorSchema } from "../../../../../validation/doctorValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../All/UI/Lists/GenericList";
import SignCell from "../SignCell";

const FamilyDoctorListItem = ({
  item,
  editCounter,
  patientId,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
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
            Structured: { ...itemInfos.Address.Structured, Line1: value },
          },
        });
        break;
      case "City":
        setItemInfos({
          ...itemInfos,
          Address: {
            ...itemInfos.Address,
            Structured: {
              ...itemInfos.Address.Structured,
              City: value,
            },
          },
        });
        break;
      case "Province":
        setItemInfos({
          ...itemInfos,
          Address: {
            ...itemInfos.Address,
            Structured: {
              ...itemInfos.Address.Structured,
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

    datasToPut.FirstName = firstLetterUpper(datasToPut.FirstName);
    datasToPut.LastName = firstLetterUpper(datasToPut.LastName);
    datasToPut.Address.Structured.Line1 = firstLetterUpper(
      datasToPut.Address.Structured.Line1
    );
    datasToPut.Address.Structured.City = firstLetterUpper(
      datasToPut.Address.Structured.City
    );
    datasToPut.EmailAddress = datasToPut.EmailAddress.toLowerCase();
    datasToPut.speciality = firstLetterUpper(datasToPut.speciality);

    //Validation
    try {
      await doctorSchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    if (
      await confirmAlert({
        content: `You're about to update Dr. ${itemInfos.FirstName} ${itemInfos.LastName} infos, proceed ?`,
      })
    ) {
      try {
        await putPatientRecord(
          "/doctors",
          item.id,
          user.id,
          auth.authToken,
          datasToPut,
          socket,
          "FAMILY DOCTORS/SPECIALISTS"
        );
        socket.emit("message", {
          route: "PATIENT DOCTORS",
          action: "update",
          content: {
            id: item.id,
            data: datasToPut,
          },
          patientId,
        });
        editCounter.current -= 1;
        setEditVisible(false);
        toast.success("Saved successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to update doctor:${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleAddToPatient = async (e) => {
    try {
      //Upadte doctors list
      await putPatientRecord(
        "/doctors",
        item.id,
        user.id,
        auth.authToken,
        {
          ...item,
          patients: [...item.patients, patientId],
        },
        socket,
        "FAMILY DOCTORS/SPECIALISTS"
      );
      //Add doctor to patient doctors
      socket.emit("message", {
        route: "PATIENT DOCTORS",
        action: "create",
        content: {
          data: {
            ...item,
            patients: [...item.patients, patientId],
          },
        },
        patientId,
      });

      toast.success("Doctor added successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to add doctor:${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleCancel = () => {
    setEditVisible(false);
    setItemInfos(item);
  };

  return (
    itemInfos && (
      <tr
        className="doctors__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          {editVisible ? (
            <input
              name="LastName"
              type="text"
              value={itemInfos.LastName}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.LastName
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="FirstName"
              type="text"
              value={itemInfos.FirstName}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.FirstName
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="speciality"
              value={itemInfos.speciality}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.speciality
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="licence_nbr"
              value={itemInfos.licence_nbr}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.licence_nbr
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ohip_billing_nbr"
              type="text"
              value={itemInfos.ohip_billing_nbr}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.ohip_billing_nbr
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
          <div className="doctors__item-btn-container">
            {!editVisible ? (
              <>
                <button
                  onClick={handleAddToPatient}
                  disabled={item.patients.includes(patientId)}
                >
                  Add to patient
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

export default FamilyDoctorListItem;
