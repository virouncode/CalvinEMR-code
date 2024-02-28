import { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../api/fetchRecords";
import { sendEmail } from "../../../api/sendEmail";
import xanoGet from "../../../api/xanoGet";
import xanoPost from "../../../api/xanoPost";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import {
  genderCT,
  namePrefixCT,
  nameSuffixCT,
  officialLanguageCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../datas/codesTables";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { createChartNbr } from "../../../utils/createChartNbr";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../utils/formatDates";
import { generatePassword } from "../../../utils/generatePassword";
import { toInverseRelation } from "../../../utils/toInverseRelation";
import { toPatientName } from "../../../utils/toPatientName";
import { patientSchema } from "../../../validation/patientValidation";
import GenericList from "../../All/UI/Lists/GenericList";
import StaffList from "../../All/UI/Lists/StaffList";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import RelationshipsForm from "./RelationshipsForm";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const SignupPatientForm = () => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [formDatas, setFormDatas] = useState({
    email: "",
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    nickName: "",
    gender: "",
    dob: "",
    healthNbr: "",
    healthVersion: "",
    healthProvince: "",
    healthExpiry: "",
    sin: "",
    assignedMd: "",
    cellphone: "",
    cellphoneExt: "",
    homephone: "",
    homephoneExt: "",
    workphone: "",
    workphoneExt: "",
    line1: "",
    province: "",
    postalCode: "",
    zipCode: "",
    city: "",
    preferredOffLang: "",
    avatar: "",
  });

  //EVENT HANDLERS
  const handleChangePostalOrZip = (e) => {
    setErrMsg("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postalCode: "",
      zipCode: "",
    });
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setFormDatas({ ...formDatas, postalCode: value, zipCode: "" });
        return;
      } else {
        setFormDatas({ ...formDatas, zipCode: value, postalCode: "" });
        return;
      }
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 25000000) {
      toast.error("The file is over 25Mb, please choose another file", {
        containerId: "A",
      });
      return;
    }
    setIsLoadingFile(true);
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        let fileToUpload = await axiosXanoStaff.post(
          "/upload/attachment",
          {
            content: content,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setFormDatas({
          ...formDatas,
          avatar: fileToUpload.data,
        });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
        setIsLoadingFile(false);
      }
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    //Validation
    let emptyRelation = false;
    for (let item of relationships) {
      if (item.relationship === "" || item.relation_id === "") {
        emptyRelation = true;
        break;
      }
    }
    if (emptyRelation) {
      setErrMsg("Please define all relationships or remove unnecessary lines");
      return;
    }
    try {
      await patientSchema.validate(formDatas);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Is the mail already taken ?
    try {
      const response = await xanoGet(
        `/patient_with_email`,
        axiosXanoStaff,
        auth.authToken,
        "email",
        formDatas.email.toLowerCase()
      );
      if (response.data) {
        setErrMsg("There is already an account with this email");
        return;
      }
    } catch (err) {
      setErrMsg(`Unable to post new patient: ${err.message}`);
      return;
    }

    //Formatting
    const newPassword = generatePassword();
    const patientToPost = {
      email: formDatas.email.toLowerCase(),
      password: newPassword,
      access_level: "Patient",
      account_status: "Activated",
      created_by_id: user.id,
      date_created: Date.now(),
    };
    let patientId;
    try {
      const response2 = await xanoPost(
        "/patients",
        axiosXanoStaff,
        auth.authToken,
        patientToPost
      );
      socket.emit("message", {
        route: "PATIENTS",
        action: "create",
        content: { data: response2.data },
      });
      patientId = response2.data.id;
    } catch (err) {
      setErrMsg(`Unable to post new patient:${err.message}`);
      return;
    }

    const demographicsToPost = {
      ChartNumber: createChartNbr(
        Date.parse(new Date(formDatas.dob)),
        toCodeTableName(genderCT, formDatas.gender),
        patientId
      ),
      PersonStatusCode: {
        PersonStatusAsEnum: "A",
      },
      patient_id: patientId,
      Email: formDatas.email.toLowerCase(),
      Names: {
        NamePrefix: formDatas.prefix,
        LegalName: {
          _namePurpose: "L",
          FirstName: {
            Part: firstLetterUpper(formDatas.firstName),
            PartType: "GIV",
          },
          LastName: {
            Part: firstLetterUpper(formDatas.lastName),
            PartType: "FAMC",
          },
          OtherName: [
            {
              Part: firstLetterUpper(formDatas.middleName),
              PartType: "GIV",
            },
          ],
        },
        OtherNames: [
          {
            _namePurpose: "AL",
            OtherName: [
              {
                Part: firstLetterUpper(formDatas.nickName),
                PartType: "GIV",
              },
            ],
          },
        ],
        LastNameSuffix: formDatas.suffix,
      },
      Gender: formDatas.gender,
      DateOfBirth: Date.parse(new Date(formDatas.dob)),
      HealthCard: {
        Number: formDatas.healthNbr,
        Version: formDatas.healthVersion,
        ExpiryDate: Date.parse(new Date(formDatas.healthExpiry)),
        ProvinceCode: formDatas.healthProvince,
      },
      SIN: formDatas.sin,
      assigned_staff_id: parseInt(formDatas.assignedMd),
      PhoneNumber: [
        {
          phoneNumber: formDatas.cellphone,
          extension: formDatas.cellphoneExt,
          _phoneNumberType: "C",
        },
        {
          phoneNumber: formDatas.homephone,
          extension: formDatas.homephoneExt,
          _phoneNumberType: "R",
        },
        {
          phoneNumber: formDatas.workphone,
          extension: formDatas.workphoneExt,
          _phoneNumberType: "W",
        },
      ],
      Address: [
        {
          _addressType: "R",
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
      ],
      PreferredOfficialLanguage: formDatas.preferredOffLang,
      avatar: formDatas.avatar,
      ai_consent: false,
      ai_consent_read: false,
    };

    //Submission
    try {
      //Demographics
      const response3 = await postPatientRecord(
        "/demographics",
        user.id,
        auth.authToken,
        demographicsToPost,
        socket,
        "DEMOGRAPHICS"
      );
      //Relationships
      const relationshipsToPost = [...relationships];
      relationshipsToPost.forEach((relationship) => {
        delete relationship.id;
        relationship.patient_id = patientId;
        relationship.created_by_id = user.id;
        relationship.date_created = Date.now();
      });
      relationshipsToPost.forEach(async (relationship) => {
        const response = await axiosXanoStaff.post(
          "/relationships",
          relationship,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        socket.emit("message", {
          route: "RELATIONSHIPS",
          action: "create",
          content: { data: response.data },
        });
      });
      let inverseRelationsToPost = [...relationshipsToPost];
      inverseRelationsToPost.forEach((item) => {
        const gender = toCodeTableName(genderCT, item.gender);
        item.patient_id = item.relation_id;
        item.relationship = toInverseRelation(item.relationship, gender);
        item.relation_id = patientId;
        item.date_created = Date.now();
        item.created_by_id = user.id;
      });
      inverseRelationsToPost = inverseRelationsToPost.filter(
        ({ relationship }) => relationship !== "Undefined"
      );
      inverseRelationsToPost.forEach(async (relationship) => {
        const response = await axiosXanoStaff.post(
          "/relationships",
          relationship,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        socket.emit("message", {
          route: "RELATIONSHIPS",
          action: "create",
          content: { data: response.data },
        });
      });
    } catch (err) {
      setErrMsg(`Unable to post new patient:${err.message}`);
      return;
    }

    //Mailing the patient
    try {
      const fullName = toPatientName(demographicsToPost);
      await sendEmail(
        "virounk@gmail.com", //to change to demographicsDatasToPost.Email
        fullName,
        "Welcome to Calvin EMR : New Life Fertility Center",
        "",
        "",
        `Please find your password for your account: ${newPassword}
          You can change your password anytime in "My account" section
    Best wishes,
    Powered by Calvin EMR`
      );
      setSuccessMsg("Patient added successfully");
      setFormDatas({
        email: "",
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        nickName: "",
        gender: "",
        dob: "",
        healthNbr: "",
        healthVersion: "",
        healthProvince: "",
        healthExpiry: "",
        sin: "",
        assignedMd: "",
        cellphone: "",
        cellphoneExt: "",
        homephone: "",
        homephoneExt: "",
        workphone: "",
        workphoneExt: "",
        line1: "",
        province: "",
        postalCode: "",
        zipCode: "",
        city: "",
        preferredOffLang: "",
        avatar: "",
      });
    } catch (err) {
      setErrMsg(`Unable to post new patient : ${err.message}`);
    }
  };

  return (
    <div
      className="signup-patient__container"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      {errMsg && <p className="signup-patient__err">{errMsg}</p>}
      {successMsg && <p className="signup-patient__success">{successMsg}</p>}
      <form className="signup-patient__form">
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <label>Email*: </label>
            <input
              type="email"
              value={formDatas.email}
              name="email"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-patient__row">
            <label>Name Prefix: </label>
            <GenericList
              name="prefix"
              list={namePrefixCT}
              value={formDatas.prefix}
              handleChange={handleChange}
              placeHolder="Choose a name prefix..."
            />
          </div>
          <div className="signup-patient__row">
            <label>First Name*: </label>
            <input
              type="text"
              value={formDatas.firstName}
              onChange={handleChange}
              name="firstName"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Middle Name: </label>
            <input
              type="text"
              value={formDatas.middleName}
              onChange={handleChange}
              name="middleName"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Last Name*: </label>
            <input
              type="text"
              value={formDatas.lastName}
              onChange={handleChange}
              name="lastName"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Last Name Suffix: </label>
            <GenericList
              name="suffix"
              list={nameSuffixCT}
              value={formDatas.suffix}
              handleChange={handleChange}
              placeHolder="Choose a last name suffix..."
            />
          </div>
          <div className="signup-patient__row">
            <label>Nick name: </label>
            <input
              type="text"
              value={formDatas.nickName}
              onChange={handleChange}
              name="nickName"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Gender*: </label>
            <GenericList
              name="gender"
              list={genderCT}
              value={formDatas.gender}
              handleChange={handleChange}
              placeHolder="Choose a gender..."
            />
          </div>
          <div className="signup-patient__row">
            <label>Date of birth*: </label>
            <input
              type="date"
              value={formDatas.dob}
              onChange={handleChange}
              name="dob"
              max={toLocalDate(Date.now())}
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card#: </label>
            <input
              type="text"
              value={formDatas.healthNbr}
              onChange={handleChange}
              name="healthNbr"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card Version: </label>
            <input
              type="text"
              value={formDatas.healthVersion}
              onChange={handleChange}
              name="healthVersion"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card Province: </label>
            <GenericList
              name="healthProvince"
              list={provinceStateTerritoryCT}
              value={formDatas.healthProvince}
              handleChange={handleChange}
              placeHolder="Choose a province..."
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card Expiry: </label>
            <input
              type="date"
              value={formDatas.healthExpiry}
              onChange={handleChange}
              name="healthExpiry"
              id="hc_expiry"
            />
          </div>
          <div className="signup-patient__row">
            <label>SIN: </label>
            <input
              type="text"
              value={formDatas.sin}
              onChange={handleChange}
              name="sin"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Assigned practitioner*: </label>
            <StaffList
              value={formDatas.assignedMd}
              name="assignedMd"
              handleChange={handleChange}
              staffInfos={staffInfos}
            />
          </div>
        </div>
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <label>Cell Phone*: </label>
            <input
              type="tel"
              value={formDatas.cellphone}
              onChange={handleChange}
              name="cellphone"
              autoComplete="off"
            />
            <label style={{ marginLeft: "30px", width: "10%" }}>Ext</label>
            <input
              style={{ width: "15%" }}
              type="text"
              value={formDatas.cellphoneExt}
              onChange={handleChange}
              name="cellphoneExt"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Home Phone: </label>
            <input
              type="tel"
              value={formDatas.homephone}
              onChange={handleChange}
              name="homephone"
              autoComplete="off"
            />
            <label style={{ marginLeft: "30px", width: "10%" }}>Ext</label>
            <input
              style={{ width: "15%" }}
              type="text"
              value={formDatas.homephoneExt}
              onChange={handleChange}
              name="homephoneExt"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Work Phone: </label>
            <input
              type="tel"
              value={formDatas.workphone}
              onChange={handleChange}
              name="workphone"
              autoComplete="off"
            />
            <label style={{ marginLeft: "30px", width: "10%" }}>Ext</label>
            <input
              style={{ width: "15%" }}
              type="text"
              value={formDatas.workphoneExt}
              onChange={handleChange}
              name="workphoneExt"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Address*: </label>
            <input
              type="text"
              value={formDatas.line1}
              onChange={handleChange}
              name="line1"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Province/State: </label>
            <GenericList
              name="province"
              list={provinceStateTerritoryCT}
              value={formDatas.province}
              handleChange={handleChange}
              placeHolder="Choose a province/state..."
            />
          </div>
          <div className="signup-patient__row">
            <label>Postal/Zip Code*: </label>
            <select
              style={{ width: "20%", marginRight: "10px" }}
              name="PostalOrZip"
              value={postalOrZip}
              onChange={handleChangePostalOrZip}
            >
              <option value="postal">Postal</option>
              <option value="zip">Zip</option>
            </select>
            <input
              type="text"
              value={
                postalOrZip === "postal"
                  ? formDatas.postalCode
                  : formDatas.zipCode
              }
              onChange={handleChange}
              name="postalZipCode"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>City*: </label>
            <input
              type="text"
              value={formDatas.city}
              onChange={handleChange}
              name="city"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Preferred Official Language: </label>
            <GenericList
              name="preferredOffLang"
              list={officialLanguageCT}
              value={formDatas.preferredOffLang}
              handleChange={handleChange}
              placeHolder="Choose a preferred official language"
              noneOption={false}
            />
          </div>
          <RelationshipsForm
            relationships={relationships}
            setRelationships={setRelationships}
          />
          <div className="signup-patient__row signup-patient__row--avatar">
            <label htmlFor="avatar">Avatar: </label>
            <div className="signup-patient__image">
              {isLoadingFile ? (
                <CircularProgressMedium />
              ) : formDatas.avatar ? (
                <img
                  src={`${BASE_URL}${formDatas.avatar?.path}`}
                  alt="avatar"
                  width="150px"
                />
              ) : (
                <img
                  src="https://placehold.co/100x100/png?font=roboto&text=Avatar"
                  alt="user-avatar-placeholder"
                />
              )}
              <input
                name="avatar"
                type="file"
                accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
                onChange={handleAvatarChange}
                id="avatar"
              />
            </div>
          </div>
        </div>
      </form>
      <div className="signup-patient__submit">
        <button disabled={isLoadingFile} onClick={handleSubmit}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default SignupPatientForm;
