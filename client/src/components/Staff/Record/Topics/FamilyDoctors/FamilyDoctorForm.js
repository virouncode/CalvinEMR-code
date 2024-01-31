import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { provinceStateTerritoryCT } from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { doctorSchema } from "../../../../../validation/doctorValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const FamilyDoctorForm = ({ setAddNew, setErrMsgPost, errMsgPost }) => {
  //HOOKS
  const { auth, socket, user, clinic } = useAuth();
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [formDatas, setFormDatas] = useState({
    FirstName: "",
    LastName: "",
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
        _phoneNumberType: "W",
        phoneNumber: "",
      },
    ],
    FaxNumber: {
      _phoneNumberType: "W",
      phoneNumber: "",
    },
    EmailAddress: "",
    speciality: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    patients: [],
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
            Structured: { ...formDatas.Address.Structured, Line1: value },
          },
        });
        break;
      case "City":
        setFormDatas({
          ...formDatas,
          Address: {
            ...formDatas.Address,
            Structured: {
              ...formDatas.Address.Structured,
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
              ...formDatas.Address.Structured,
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

    datasToPost.FirstName = firstLetterUpper(datasToPost.FirstName);
    datasToPost.LastName = firstLetterUpper(datasToPost.LastName);
    datasToPost.Address.Structured.Line1 = firstLetterUpper(
      datasToPost.Address.Structured.Line1
    );
    datasToPost.Address.Structured.City = firstLetterUpper(
      datasToPost.Address.Structured.City
    );
    datasToPost.EmailAddress = datasToPost.EmailAddress.toLowerCase();
    datasToPost.speciality = firstLetterUpper(datasToPost.speciality);

    //Validation
    try {
      await doctorSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Submission
    try {
      await postPatientRecord(
        "/doctors",
        user.id,
        auth.authToken,
        datasToPost,
        socket,
        "FAMILY DOCTORS/SPECIALISTS"
      );
      setAddNew(false);
      // const response = await axiosXanoStaff.get("/doctors", {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${auth.authToken}`,
      //   },
      // });
      // setDoctorsList(response.data);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to add doctor: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleCancel = () => {
    setAddNew(false);
  };

  return (
    <tr
      className="doctors__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <input
          name="LastName"
          type="text"
          value={formDatas.LastName}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="FirstName"
          type="text"
          value={formDatas.FirstName}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="speciality"
          type="text"
          value={formDatas.speciality}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="licence_nbr"
          type="text"
          value={formDatas.licence_nbr}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="ohip_billing_nbr"
          type="text"
          value={formDatas.ohip_billing_nbr}
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
        <em>{staffIdToTitleAndName(clinic.staffInfos, user.id, true)}</em>
      </td>
      <td>
        <em>{toLocalDate(Date.now())}</em>
      </td>
      <td>
        <div className="doctors__form-btn-container">
          <input type="submit" value="Save" onClick={handleSubmit} />
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FamilyDoctorForm;
