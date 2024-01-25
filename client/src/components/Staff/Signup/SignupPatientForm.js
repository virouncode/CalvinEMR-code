import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../api/fetchRecords";
import { sendEmail } from "../../../api/sendEmail";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import {
  genderCT,
  namePrefixCT,
  nameSuffixCT,
  officialLanguageCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../datas/codesTables";
import useAuth from "../../../hooks/useAuth";
import { createChartNbr } from "../../../utils/createChartNbr";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../utils/formatDates";
import { generatePassword } from "../../../utils/generatePassword";
import { toInverseRelation } from "../../../utils/toInverseRelation";
import { demographicsSchema } from "../../../validation/demographicsValidation";
import GenericList from "../../All/UI/Lists/GenericList";
import StaffList from "../../All/UI/Lists/StaffList";
import RelationshipsForm from "./RelationshipsForm";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const SignupPatientForm = () => {
  //HOOKS
  const { auth, user, clinic, socket } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [demographicsDatas, setDemographicsDatas] = useState({
    Names: {
      NamePrefix: "",
      LegalName: {
        FirstName: {
          Part: "",
          PartType: "GIV",
        },
        LastName: {
          Part: "",
          PartType: "FAMC",
        },
        OtherName: [
          {
            Part: "",
            PartType: "GIV",
          },
        ],
        _namePurpose: "L",
      },
      OtherNames: [
        {
          OtherName: [
            {
              Part: "",
              PartType: "GIV",
            },
          ],
          _namePurpose: "AL",
        },
      ],
      LastNameSuffix: "",
    },
    DateOfBirth: null,
    HealthCard: {
      Number: "",
      Version: "",
      ExpiryDate: null,
      ProvinceCode: "",
    },
    Gender: "",
    Address: [
      {
        Structured: {
          Line1: "",
          City: "",
          CountrySubDivisionCode: "",
          PostalZipCode: {
            PostalCode: "",
            ZipCode: "",
          },
        },
        _addressType: "R",
      },
    ],
    PhoneNumber: [
      {
        phoneNumber: "",
        _phoneNumberType: "C",
      },
      {
        phoneNumber: "",
        _phoneNumberType: "R",
      },
      {
        phoneNumber: "",
        _phoneNumberType: "W",
      },
    ],
    PreferredOfficialLanguage: "ENG",
    Email: "",
    PersonStatusCode: {
      PersonStatusAsEnum: "A",
    },
    SIN: "",
  });

  //EVENT HANDLERS
  const handleChangePostalOrZip = (e) => {
    setErrMsg("");
    setPostalOrZip(e.target.value);
    setDemographicsDatas({
      ...demographicsDatas,
      Address: [
        {
          ...demographicsDatas.Address[0],
          Structured: {
            ...demographicsDatas.Address[0].Structured,
            PostalZipCode: {
              PostalCode: "",
              ZipCode: "",
            },
          },
        },
      ],
    });
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "NamePrefix":
        setDemographicsDatas({
          ...demographicsDatas,
          Names: { ...demographicsDatas.Names, NamePrefix: value },
        });
        break;
      case "LastNameSuffix":
        setDemographicsDatas({
          ...demographicsDatas,
          Names: { ...demographicsDatas.Names, LastNameSuffix: value },
        });
        break;
      case "FirstName":
        setDemographicsDatas({
          ...demographicsDatas,
          Names: {
            ...demographicsDatas.Names,
            LegalName: {
              ...demographicsDatas.Names.LegalName,
              FirstName: {
                ...demographicsDatas.Names.LegalName.FirstName,
                Part: value,
              },
            },
          },
        });
        break;
      case "LastName":
        setDemographicsDatas({
          ...demographicsDatas,
          Names: {
            ...demographicsDatas.Names,
            LegalName: {
              ...demographicsDatas.Names.LegalName,
              LastName: {
                ...demographicsDatas.Names.LegalName.LastName,
                Part: value,
              },
            },
          },
        });
        break;
      case "OtherName":
        setDemographicsDatas({
          ...demographicsDatas,
          Names: {
            ...demographicsDatas.Names,
            LegalName: {
              ...demographicsDatas.Names.LegalName,
              OtherName: [
                {
                  ...demographicsDatas.Names.LegalName.OtherName[0],
                  Part: value,
                },
              ],
            },
          },
        });
        break;
      case "NickName":
        setDemographicsDatas({
          ...demographicsDatas,
          Names: {
            ...demographicsDatas.Names,
            OtherNames: [
              {
                ...demographicsDatas.Names.OtherNames[0],
                OtherName: [
                  {
                    ...demographicsDatas.Names.OtherNames[0].OtherName[0],
                    Part: value,
                  },
                ],
              },
            ],
          },
        });
        break;
      case "Gender":
        setDemographicsDatas({ ...demographicsDatas, Gender: value });
        break;
      case "DateOfBirth":
        setDemographicsDatas({
          ...demographicsDatas,
          DateOfBirth: Date.parse(new Date(value)),
        });
        break;
      case "HealthCardNumber":
        setDemographicsDatas({
          ...demographicsDatas,
          HealthCard: { ...demographicsDatas.HealthCard, Number: value },
        });
        break;
      case "HealthCardVersion":
        setDemographicsDatas({
          ...demographicsDatas,
          HealthCard: { ...demographicsDatas.HealthCard, Version: value },
        });
        break;
      case "HealthCardExpiry":
        setDemographicsDatas({
          ...demographicsDatas,
          HealthCard: {
            ...demographicsDatas.HealthCard,
            ExpiryDate: Date.parse(new Date(value)),
          },
        });
        break;
      case "HealthCardProvince":
        setDemographicsDatas({
          ...demographicsDatas,
          HealthCard: { ...demographicsDatas.HealthCard, ProvinceCode: value },
        });
        break;
      case "SIN":
        setDemographicsDatas({
          ...demographicsDatas,
          SIN: value,
        });
        break;
      case "Cellphone":
        setDemographicsDatas({
          ...demographicsDatas,
          PhoneNumber: demographicsDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "C"
              ? {
                  ...item,
                  phoneNumber: value,
                }
              : item;
          }),
        });
        break;
      case "CellphoneExt":
        setDemographicsDatas({
          ...demographicsDatas,
          PhoneNumber: demographicsDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "C"
              ? {
                  ...item,
                  extension: value,
                }
              : item;
          }),
        });
        break;
      case "Homephone":
        setDemographicsDatas({
          ...demographicsDatas,
          PhoneNumber: demographicsDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "R"
              ? {
                  ...item,
                  phoneNumber: value,
                }
              : item;
          }),
        });
        break;
      case "HomephoneExt":
        setDemographicsDatas({
          ...demographicsDatas,
          PhoneNumber: demographicsDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "R"
              ? {
                  ...item,
                  extension: value,
                }
              : item;
          }),
        });
        break;
      case "Workphone":
        setDemographicsDatas({
          ...demographicsDatas,
          PhoneNumber: demographicsDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "W"
              ? {
                  ...item,
                  phoneNumber: value,
                }
              : item;
          }),
        });
        break;
      case "WorkphoneExt":
        setDemographicsDatas({
          ...demographicsDatas,
          PhoneNumber: demographicsDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "W"
              ? {
                  ...item,
                  extension: value,
                }
              : item;
          }),
        });
        break;
      case "Address":
        setDemographicsDatas({
          ...demographicsDatas,
          Address: [
            {
              ...demographicsDatas.Address[0],
              Structured: {
                ...demographicsDatas.Address[0].Structured,
                Line1: value,
              },
            },
          ],
        });
        break;
      case "City":
        setDemographicsDatas({
          ...demographicsDatas,
          Address: [
            {
              ...demographicsDatas.Address[0],
              Structured: {
                ...demographicsDatas.Address[0].Structured,
                City: value,
              },
            },
          ],
        });
        break;
      case "Province":
        setDemographicsDatas({
          ...demographicsDatas,
          Address: [
            {
              ...demographicsDatas.Address[0],
              Structured: {
                ...demographicsDatas.Address[0].Structured,
                CountrySubDivisionCode: value,
              },
            },
          ],
        });
        break;
      case "PostalCode":
        setDemographicsDatas({
          ...demographicsDatas,
          Address: [
            {
              ...demographicsDatas.Address[0],
              Structured: {
                ...demographicsDatas.Address[0].Structured,
                PostalZipCode:
                  postalOrZip === "postal"
                    ? { PostalCode: value, ZipCode: "" }
                    : { PostalCode: "", ZipCode: value },
              },
            },
          ],
        });
        break;
      case "PreferredOfficialLanguage":
        setDemographicsDatas({
          ...demographicsDatas,
          PreferredOfficialLanguage: value,
        });
        break;
      case "assigned_staff_id":
        console.log(parseInt(value));
        setDemographicsDatas({
          ...demographicsDatas,
          assigned_staff_id: parseInt(value),
        });
        break;
      default:
        setDemographicsDatas({ ...demographicsDatas, [name]: value });
        break;
    }
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
        setDemographicsDatas({
          ...demographicsDatas,
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

    //Validate Relationships
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
      //Formatting
      const newPassword = generatePassword();
      const patientDatas = {
        email: demographicsDatas.Email.toLowerCase(),
        password: newPassword,
        access_level: "Patient",
        account_status: "Activated",
        ai_consent: false,
        ai_consent_read: false,
      };
      const demographicsDatasToPost = {
        ...demographicsDatas,
      };
      demographicsDatasToPost.Names.LegalName.FirstName.Part = firstLetterUpper(
        demographicsDatasToPost.Names.LegalName.FirstName.Part
      );
      demographicsDatasToPost.Names.LegalName.LastName.Part = firstLetterUpper(
        demographicsDatasToPost.Names.LegalName.LastName.Part
      );
      demographicsDatasToPost.Names.LegalName.OtherName[0].Part =
        firstLetterUpper(
          demographicsDatasToPost.Names.LegalName.OtherName[0].Part
        );
      demographicsDatasToPost.Names.OtherNames[0].OtherName[0].Part =
        firstLetterUpper(
          demographicsDatasToPost.Names.OtherNames[0].OtherName[0].Part
        );
      demographicsDatasToPost.Address[0].Structured.Line1 = firstLetterUpper(
        demographicsDatasToPost.Address[0].Structured.Line1
      );
      demographicsDatasToPost.Address[0].Structured.City = firstLetterUpper(
        demographicsDatasToPost.Address[0].Structured.City
      );
      demographicsDatasToPost.Email =
        demographicsDatasToPost.Email.toLowerCase();
      //Validation
      if (
        clinic.demographicsInfos.find(
          ({ Email }) => Email.toLowerCase() === patientDatas.email
        )
      ) {
        setErrMsg(
          "There is already an account with this email, please choose another one"
        );
        return;
      }

      if (demographicsDatasToPost.assigned_staff_id === 0) {
        setErrMsg("Please choose an assigned practician");
        return;
      }
      try {
        await demographicsSchema.validate(demographicsDatasToPost);
      } catch (err) {
        setErrMsg(err.message);
        return;
      }
      //Submission
      //POST Patients
      const response2 = await postPatientRecord(
        "/patients",
        user.id,
        auth.authToken,
        patientDatas,
        socket,
        "PATIENTS"
      );
      const patientId = response2.data.id;

      //POST Demographics
      demographicsDatasToPost.patient_id = patientId;
      demographicsDatasToPost.ChartNumber = createChartNbr(
        demographicsDatas.DateOfBirth,
        toCodeTableName(genderCT, demographicsDatas.Gender),
        patientId
      );
      //Submission
      const response = await postPatientRecord(
        "/demographics",
        user.id,
        auth.authToken,
        demographicsDatasToPost,
        socket,
        "DEMOGRAPHICS"
      );

      //Relationships
      //Formatting
      const relationshipsToPost = [...relationships];
      relationshipsToPost.forEach((relationship) => {
        delete relationship.id;
        relationship.patient_id = response.data.id;
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
        const gender = clinic.demographicsInfos.filter(
          ({ patient_id }) => patient_id === item.relation_id
        )[0].gender_identification;

        item.patient_id = item.relation_id;
        item.relationship = toInverseRelation(item.relationship, gender);
        item.relation_id = response.data.id;
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

      const fullName =
        demographicsDatasToPost.Names.NamePrefix +
        " " +
        demographicsDatasToPost.Names.LegalName.FirstName.Part +
        " " +
        demographicsDatasToPost.Names.LegalName.OtherName[0].Part +
        " " +
        demographicsDatasToPost.Names.LegalName.LastName.Part +
        " " +
        demographicsDatasToPost.Names.LastNameSuffix;

      sendEmail(
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
      setDemographicsDatas({
        Names: {
          NamePrefix: "",
          LegalName: {
            FirstName: {
              Part: "",
              PartType: "GIV",
            },
            LastName: {
              Part: "",
              PartType: "FAMC",
            },
            OtherName: [
              {
                Part: "",
                PartType: "GIV",
              },
            ],
            _namePurpose: "L",
          },
          OtherNames: [
            {
              OtherName: [
                {
                  Part: "",
                  PartType: "GIV",
                },
              ],
              _namePurpose: "AL",
            },
          ],
          LastNameSuffix: "",
        },
        DateOfBirth: null,
        HealthCard: {
          Number: "",
          Version: "",
          ExpiryDate: null,
          ProvinceCode: "",
        },
        Gender: "",
        Address: [
          {
            Structured: {
              Line1: "",
              City: "",
              CountrySubDivisionCode: "",
              PostalZipCode: {
                PostalCode: "",
                ZipCode: "",
              },
            },
            _addressType: "R",
          },
        ],
        PhoneNumber: [
          {
            phoneNumber: "",
            _phoneNumberType: "C",
          },
          {
            phoneNumber: "",
            _phoneNumberType: "R",
          },
          {
            phoneNumber: "",
            _phoneNumberType: "W",
          },
        ],
        PreferredOfficialLanguage: "ENG",
        Email: "",
        PersonStatusCode: {
          PersonStatusAsEnum: "A",
        },
        SIN: "",
        assigned_staff_id: "",
      });
    } catch (err) {
      setErrMsg(err.message);
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
              value={demographicsDatas.Email}
              name="Email"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
          <div className="signup-patient__row">
            <label>Name Prefix: </label>
            <GenericList
              name="NamePrefix"
              list={namePrefixCT}
              value={demographicsDatas.Names.NamePrefix}
              handleChange={handleChange}
              placeHolder="Choose a name prefix..."
            />
          </div>
          <div className="signup-patient__row">
            <label>First Name*: </label>
            <input
              type="text"
              value={demographicsDatas.Names.LegalName.FirstName.Part}
              onChange={handleChange}
              name="FirstName"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Middle Name: </label>
            <input
              type="text"
              value={demographicsDatas.Names.LegalName.OtherName[0].Part}
              onChange={handleChange}
              name="OtherName"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Last Name*: </label>
            <input
              type="text"
              value={demographicsDatas.Names.LegalName.LastName.Part}
              onChange={handleChange}
              name="LastName"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Last Name Suffix: </label>
            <GenericList
              name="LastNameSuffix"
              list={nameSuffixCT}
              value={demographicsDatas.Names.LastNameSuffix}
              handleChange={handleChange}
              placeHolder="Choose a last name suffix..."
            />
          </div>
          <div className="signup-patient__row">
            <label>Nick name: </label>
            <input
              type="text"
              value={demographicsDatas.Names?.OtherNames[0].OtherName[0].Part}
              onChange={handleChange}
              name="NickName"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Gender*: </label>
            <GenericList
              name="Gender"
              list={genderCT}
              value={demographicsDatas.Gender}
              handleChange={handleChange}
              placeHolder="Choose a gender..."
            />
          </div>
          <div className="signup-patient__row">
            <label>Date of birth*: </label>
            <input
              type="date"
              value={toLocalDate(demographicsDatas.DateOfBirth)}
              onChange={handleChange}
              name="DateOfBirth"
              max={toLocalDate(Date.now())}
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card#: </label>
            <input
              type="text"
              value={demographicsDatas.HealthCard.Number}
              onChange={handleChange}
              name="HealthCardNumber"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card Version: </label>
            <input
              type="text"
              value={demographicsDatas.HealthCard.Version}
              onChange={handleChange}
              name="HealthCardVersion"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card Province: </label>
            <GenericList
              name="HealthCardProvince"
              list={provinceStateTerritoryCT}
              value={demographicsDatas.HealthCard.ProvinceCode}
              handleChange={handleChange}
              placeHolder="Choose a province..."
            />
          </div>
          <div className="signup-patient__row">
            <label>Health Card Expiry: </label>
            <input
              type="date"
              value={toLocalDate(demographicsDatas.HealthCard.ExpiryDate)}
              onChange={handleChange}
              name="HealthCardExpiry"
              id="hc_expiry"
            />
          </div>
          <div className="signup-patient__row">
            <label>SIN: </label>
            <input
              type="text"
              value={demographicsDatas.SIN}
              onChange={handleChange}
              name="SIN"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Assigned practician*: </label>
            <StaffList
              value={demographicsDatas.assigned_staff_id}
              name="assigned_staff_id"
              handleChange={handleChange}
              staffInfos={clinic.staffInfos}
            />
          </div>
        </div>
        <div className="signup-patient__column">
          <div className="signup-patient__row">
            <label>Cell Phone*: </label>
            <input
              type="tel"
              value={
                demographicsDatas.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "C"
                ).phoneNumber
              }
              onChange={handleChange}
              name="Cellphone"
              autoComplete="off"
            />
            <label style={{ marginLeft: "30px", width: "10%" }}>Ext</label>
            <input
              style={{ width: "15%" }}
              type="text"
              value={
                demographicsDatas.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "C"
                ).extension
              }
              onChange={handleChange}
              name="CellphoneExt"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Home Phone: </label>
            <input
              type="tel"
              value={
                demographicsDatas.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "R"
                ).phoneNumber
              }
              onChange={handleChange}
              name="Homephone"
              autoComplete="off"
            />
            <label style={{ marginLeft: "30px", width: "10%" }}>Ext</label>
            <input
              style={{ width: "15%" }}
              type="text"
              value={
                demographicsDatas.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "R"
                )?.extension
              }
              onChange={handleChange}
              name="HomephoneExt"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Work Phone: </label>
            <input
              type="tel"
              value={
                demographicsDatas.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "W"
                ).phoneNumber
              }
              onChange={handleChange}
              name="Workphone"
              autoComplete="off"
            />
            <label style={{ marginLeft: "30px", width: "10%" }}>Ext</label>
            <input
              style={{ width: "15%" }}
              type="text"
              value={
                demographicsDatas.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "W"
                )?.extension
              }
              onChange={handleChange}
              name="WorkphoneExt"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Address*: </label>
            <input
              type="text"
              value={
                demographicsDatas.Address.find(
                  ({ _addressType }) => _addressType === "R"
                ).Structured.Line1
              }
              onChange={handleChange}
              name="Address"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Province/State: </label>
            <GenericList
              name="Province"
              list={provinceStateTerritoryCT}
              value={
                demographicsDatas.Address.find(
                  ({ _addressType }) => _addressType === "R"
                ).Structured.CountrySubDivisionCode
              }
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
                  ? demographicsDatas.Address.find(
                      ({ _addressType }) => _addressType === "R"
                    ).Structured.PostalZipCode.PostalCode
                  : demographicsDatas.Address.find(
                      ({ _addressType }) => _addressType === "R"
                    ).Structured.PostalZipCode.ZipCode
              }
              onChange={handleChange}
              name="PostalCode"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>City*: </label>
            <input
              type="text"
              value={
                demographicsDatas.Address.find(
                  ({ _addressType }) => _addressType === "R"
                ).Structured.City
              }
              onChange={handleChange}
              name="City"
              autoComplete="off"
            />
          </div>
          <div className="signup-patient__row">
            <label>Preferred Official Language: </label>
            <GenericList
              name="PreferredOfficialLanguage"
              list={officialLanguageCT}
              value={demographicsDatas.PreferredOfficialLanguage}
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
                <CircularProgress size="1rem" style={{ margin: "5px" }} />
              ) : demographicsDatas.avatar ? (
                <img
                  src={`${BASE_URL}${demographicsDatas.avatar?.path}`}
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
