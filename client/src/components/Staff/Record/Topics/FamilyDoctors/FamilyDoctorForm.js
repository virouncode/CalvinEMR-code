import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { provinceStateTerritoryCT } from "../../../../../omdDatas/codesTables";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { doctorSchema } from "../../../../../validation/record/doctorValidation";
import GenericList from "../../../../UI/Lists/GenericList";

const FamilyDoctorForm = ({
  editCounter,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [progress, setProgress] = useState(false);
  //HANDLERS

  const [formDatas, setFormDatas] = useState({
    firstName: "",
    lastName: "",
    line1: "",
    city: "",
    province: "",
    postalCode: "",
    zipCode: "",
    phone: "",
    fax: "",
    email: "",
    speciality: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    patients: [],
  });
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setFormDatas({ ...formDatas, postalCode: value, zipCode: "" });
        return;
      } else {
        setFormDatas({ ...formDatas, postalCode: "", zipCode: value });
        return;
      }
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postalCode: "",
      zipCode: "",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validation
    try {
      await doctorSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Formatting
    const datasToPost = {
      FirstName: firstLetterUpper(formDatas.firstName),
      LastName: firstLetterUpper(formDatas.lastName),
      Address: {
        _addressType: "M",
        Structured: {
          Line1: firstLetterUpper(formDatas.line1),
          City: firstLetterUpper(formDatas.city),
          CountrySubDivisionCode: formDatas.province,
          PostalZipCode: {
            PostalCode: formDatas.postalCode,
            ZipCode: formDatas.zipCode,
          },
        },
      },
      PhoneNumber: [
        {
          _phoneNumberType: "W",
          phoneNumber: formDatas.phone,
        },
      ],
      FaxNumber: {
        _phoneNumberType: "W",
        phoneNumber: formDatas.fax,
      },
      EmailAddress: formDatas.email.toLowerCase(),
      speciality: firstLetterUpper(formDatas.speciality),
      licence_nbr: formDatas.licence_nbr,
      ohip_billing_nbr: formDatas.ohip_billing_nbr,
      patients: [],
      created_by_user_type: "staff",
    };
    //Submission
    try {
      setProgress(true);
      await postPatientRecord(
        "/doctors",
        user.id,
        datasToPost,
        socket,
        "FAMILY DOCTORS/SPECIALISTS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to add doctor: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
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
      className="doctors__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="doctors__form-btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <button type="button" onClick={handleCancel} disabled={progress}>
            Cancel
          </button>
        </div>
      </td>
      <td>
        <input
          name="lastName"
          type="text"
          value={formDatas.lastName}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="firstName"
          type="text"
          value={formDatas.firstName}
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
          name="line1"
          type="text"
          value={formDatas.line1}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="city"
          type="text"
          value={formDatas.city}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <GenericList
          list={provinceStateTerritoryCT}
          value={formDatas.province}
          name="province"
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
          name="postalZipCode"
          type="text"
          value={
            postalOrZip === "postal" ? formDatas.postalCode : formDatas.zipCode
          }
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="phone"
          type="text"
          value={formDatas.phone}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="fax"
          type="text"
          value={formDatas.fax}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          name="email"
          type="text"
          value={formDatas.email}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </tr>
  );
};

export default FamilyDoctorForm;
