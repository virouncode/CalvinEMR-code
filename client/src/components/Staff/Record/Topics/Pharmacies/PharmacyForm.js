import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { provinceStateTerritoryCT } from "../../../../../datas/codesTables";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { pharmacySchema } from "../../../../../validation/pharmacyValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const PharmacyForm = ({
  editCounter,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [formDatas, setFormDatas] = useState({
    Name: "",
    Address: {
      Structured: {
        Line1: "",
        City: "",
        CountrySubDivisionCode: "",
        PostalZipCode: { PostalCode: "", ZipCode: "" },
      },
      _addressType: "M",
    },
    PhoneNumber: [
      {
        phoneNumber: "",
        _phoneNumberType: "W",
      },
    ],
    FaxNumber: {
      _phoneNumberType: "W",
      phoneNumber: "",
    },
    EmailAddress: "",
  });

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "Address":
        setFormDatas({
          ...formDatas,
          Address: {
            ...formDatas.Address,
            Structured: {
              ...formDatas.Address?.Structured,
              Line1: value,
            },
          },
        });
        break;
      case "City":
        setFormDatas({
          ...formDatas,
          Address: {
            ...formDatas.Address,
            Structured: {
              ...formDatas.Address?.Structured,
              City: value,
            },
          },
        });
        break;
      case "Province":
        setFormDatas({
          ...formDatas,
          Address: {
            ...formDatas.Address,
            Structured: {
              ...formDatas.Address?.Structured,
              CountrySubDivisionCode: value,
            },
          },
        });
        break;
      case "PostalCode":
        setFormDatas({
          ...formDatas,
          Address: {
            ...formDatas.Address,
            Structured: {
              ...formDatas.Address?.Structured,
              PostalZipCode:
                postalOrZip === "postal"
                  ? { PostalCode: value, ZipCode: "" }
                  : { PostalCode: "", ZipCode: value },
            },
          },
        });
        break;
      case "PhoneNumber":
        setFormDatas({
          ...formDatas,
          PhoneNumber: formDatas.PhoneNumber.map((item) => {
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
        setFormDatas({
          ...formDatas,
          FaxNumber: {
            ...formDatas.FaxNumber,
            phoneNumber: value,
          },
        });
        break;
      default:
        setFormDatas({ ...formDatas, [name]: value });
        break;
    }
  };
  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      Address: {
        ...formDatas.Address,
        Structured: {
          ...formDatas.Address.Structured,
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
    const datasToPost = {
      ...formDatas,
    };
    datasToPost.Name = firstLetterUpper(datasToPost.Name);
    datasToPost.Address.Structured.Line1 = firstLetterUpper(
      datasToPost.Address.Structured.Line1
    );
    datasToPost.Address.Structured.City = firstLetterUpper(
      datasToPost.Address.Structured.City
    );
    datasToPost.EmailAddress = datasToPost.EmailAddress.toLowerCase();

    //Validation
    try {
      await pharmacySchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await postPatientRecord(
        "/pharmacies",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "PHARMACIES"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to add pharmacy: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr
      className="pharmacies__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <input
          name="Name"
          type="text"
          value={formDatas.Name}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="Address"
          type="text"
          value={formDatas.Address.Structured.Line1}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="City"
          type="text"
          value={formDatas.Address.Structured.City}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={provinceStateTerritoryCT}
          value={formDatas.Address.Structured.CountrySubDivisionCode}
          name="Province"
          handleChange={handleChange}
          noneOption={false}
        />
      </td>
      <td className="td--postal">
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
              ? formDatas.Address.Structured.PostalZipCode.PostalCode
              : formDatas.Address.Structured.PostalZipCode.ZipCode
          }
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="PhoneNumber"
          type="text"
          value={formDatas.PhoneNumber[0].phoneNumber}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="FaxNumber"
          type="text"
          value={formDatas.FaxNumber.phoneNumber}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="EmailAddress"
          type="text"
          value={formDatas.EmailAddress}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id, true)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.now())}</em>
      </td>
      <td>
        <div className="pharmacies__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PharmacyForm;
