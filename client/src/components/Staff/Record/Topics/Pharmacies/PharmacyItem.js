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
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos({
      name: item.Name || "",
      line1: item.Address?.Structured?.Line1 || "",
      city: item.Address?.Structured?.City || "",
      province: item.Address?.Structured?.CountrySubDivisionCode || "",
      postalCode: item.Address?.Structured?.PostalZipCode.PostalCode || "",
      zipCode: item.Address?.Structured?.PostalZipCode.ZipCode || "",
      phone: item.PhoneNumber?.[0]?.phoneNumber,
      fax: item.FaxNumber?.phoneNumber,
      email: item.EmailAddress,
    });
  }, [item]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setItemInfos({ ...itemInfos, postalCode: value, zipCode: "" });
        return;
      } else {
        setItemInfos({ ...itemInfos, postalCode: "", zipCode: value });
        return;
      }
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setItemInfos({
      ...itemInfos,
      postalCode: "",
      zipCode: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await pharmacySchema.validate(itemInfos);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Formatting
    const datasToPut = {
      ...item,
      Name: firstLetterUpper(itemInfos.name),
      Address: {
        Structured: {
          Line1: firstLetterUpper(itemInfos.line1),
          City: firstLetterUpper(itemInfos.city),
          CountrySubDivisionCode: itemInfos.province,
          PostalZipCode: {
            PostalCode: itemInfos.postalCode,
            ZipCode: itemInfos.zipCode,
          },
        },
        _addressType: "M",
      },
      PhoneNumber: [
        {
          phoneNumber: itemInfos.phone,
          _phoneNumberType: "W",
        },
      ],
      FaxNumber: {
        _phoneNumberType: "W",
        phoneNumber: itemInfos.fax,
      },
      EmailAddress: itemInfos.email.toLowerCase(),
    };

    if (
      await confirmAlert({
        content: `You're about to update ${itemInfos.name} infos, proceed ?`,
      })
    ) {
      try {
        setProgress(true);
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
        setProgress(false);
      } catch (err) {
        toast.error(`Error: unable to update pharmacy:${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
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

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setEditVisible(false);
    setItemInfos({
      name: item.Name || "",
      line1: item.Address?.Structured?.Line1 || "",
      city: item.Address?.Structured?.City || "",
      province: item.Address?.Structured?.CountrySubDivisionCode || "",
      postalCode: item.Address?.Structured?.PostalZipCode.PostalCode || "",
      zipCode: item.Address?.Structured?.PostalZipCode.ZipCode || "",
      phone: item.PhoneNumber?.[0]?.phoneNumber,
      fax: item.FaxNumber?.phoneNumber,
      email: item.EmailAddress,
    });
  };

  return (
    itemInfos && (
      <tr
        className="pharmacies-list__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
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
        <td>
          {editVisible ? (
            <input
              name="name"
              type="text"
              value={itemInfos.name}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.name
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="line1"
              type="text"
              value={itemInfos.line1}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.line1
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="city"
              type="text"
              value={itemInfos.city}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.city
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={provinceStateTerritoryCT}
              value={itemInfos.province}
              name="province"
              handleChange={handleChange}
              noneOption={false}
            />
          ) : (
            toCodeTableName(provinceStateTerritoryCT, itemInfos.province)
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
                name="postalZipCode"
                type="text"
                value={
                  postalOrZip === "postal"
                    ? itemInfos.postalCode
                    : itemInfos.zipCode
                }
                onChange={handleChange}
                autoComplete="off"
              />
            </>
          ) : postalOrZip === "postal" ? (
            itemInfos.postalCode
          ) : (
            itemInfos.zipCode
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="phone"
              type="text"
              value={itemInfos.phone}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.phone
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="fax"
              type="text"
              value={itemInfos.fax}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.fax
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="email"
              type="email"
              value={itemInfos.email}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.email
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default PharmacyItem;
