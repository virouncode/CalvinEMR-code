import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import {
  officialLanguageCT,
  personStatusCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../datas/codesTables";
import useAuthContext from "../../../hooks/useAuthContext";
import { emergencyContactCaption } from "../../../utils/emergencyContactCaption";
import { firstLetterUpper } from "../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../utils/formatDates";
import { getAge } from "../../../utils/getAge";
import { onMessageUser } from "../../../utils/socketHandlers/onMessageUser";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { demographicsSchema } from "../../../validation/demographicsValidation";
import GenericList from "../../All/UI/Lists/GenericList";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const AccountPatientForm = () => {
  //HOOKS
  const { auth, user, clinic, setUser, socket } = useAuthContext();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState(null);
  const [tempFormDatas, setTempFormDatas] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [postalOrZip, setPostalOrZip] = useState(
    user.demographics.Address.find(({ _addressType }) => _addressType === "R")
      .Structured.PostalZipCode.PostalCode
      ? "postal"
      : "zip"
  );
  const emergencyContact = user.demographics.Contact.length
    ? user.demographics.Contact.find(
        (contact) => contact.ContactPurpose?.PurposeAsEnum === "EC"
      )
    : {};

  useEffect(() => {
    setFormDatas(user.demographics);
    setTempFormDatas(user.demographics);
  }, [user.demographics]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => onMessageUser(message, user, setUser);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);

  //HANDLERS
  const handleChangePostalOrZip = (e) => {
    setErrMsg("");
    setPostalOrZip(e.target.value);

    setTempFormDatas({
      ...tempFormDatas,
      Address: tempFormDatas.Address.map((item) => {
        return item._addressType === "R"
          ? {
              ...item,
              Structured: {
                ...item.Structured,
                PostalZipCode: { PostalCode: "", ZipCode: "" },
              },
            }
          : item;
      }),
    });
  };

  const handleChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "NickName":
        setTempFormDatas({
          ...tempFormDatas,
          Names: {
            ...tempFormDatas.Names,
            OtherNames: [
              {
                ...tempFormDatas.Names.OtherNames[0],
                OtherName: [
                  {
                    ...tempFormDatas.Names.OtherNames[0].OtherName[0],
                    Part: value,
                  },
                ],
              },
            ],
          },
        });
        break;
      case "Cellphone":
        setTempFormDatas({
          ...tempFormDatas,
          PhoneNumber: tempFormDatas.PhoneNumber.map((item) => {
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
        setTempFormDatas({
          ...tempFormDatas,
          PhoneNumber: tempFormDatas.PhoneNumber.map((item) => {
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
        setTempFormDatas({
          ...tempFormDatas,
          PhoneNumber: tempFormDatas.PhoneNumber.map((item) => {
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
        setTempFormDatas({
          ...tempFormDatas,
          PhoneNumber: tempFormDatas.PhoneNumber.map((item) => {
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
        setTempFormDatas({
          ...tempFormDatas,
          PhoneNumber: tempFormDatas.PhoneNumber.map((item) => {
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
        setTempFormDatas({
          ...tempFormDatas,
          PhoneNumber: tempFormDatas.PhoneNumber.map((item) => {
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
        setTempFormDatas({
          ...tempFormDatas,
          Address: tempFormDatas.Address.map((item) => {
            return item._addressType === "R"
              ? {
                  ...item,
                  Structured: {
                    ...item.Structured,
                    Line1: value,
                  },
                }
              : item;
          }),
        });
        break;
      case "City":
        setTempFormDatas({
          ...tempFormDatas,
          Address: tempFormDatas.Address.map((item) => {
            return item._addressType === "R"
              ? {
                  ...item,
                  Structured: {
                    ...item.Structured,
                    City: value,
                  },
                }
              : item;
          }),
        });
        break;
      case "Province":
        setTempFormDatas({
          ...tempFormDatas,
          Address: tempFormDatas.Address.map((item) => {
            return item._addressType === "R"
              ? {
                  ...item,
                  Structured: {
                    ...item.Structured,
                    CountrySubDivisionCode: value,
                  },
                }
              : item;
          }),
        });
        break;
      case "PostalCode":
        setTempFormDatas({
          ...tempFormDatas,
          Address: tempFormDatas.Address.map((item) => {
            return item._addressType === "R"
              ? {
                  ...item,
                  Structured: {
                    ...item.Structured,
                    PostalZipCode:
                      postalOrZip === "postal"
                        ? { PostalCode: value, ZipCode: "" }
                        : { PostalCode: "", ZipCode: value },
                  },
                }
              : item;
          }),
        });
        break;
      case "PreferredOfficialLanguage":
        setTempFormDatas({
          ...tempFormDatas,
          PreferredOfficialLanguage: value,
        });
        break;
      case "CFirstName":
        setTempFormDatas({
          ...tempFormDatas,
          Contact: tempFormDatas.Contact.length
            ? tempFormDatas.Contact.map((item) => {
                return item.ContactPurpose?.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      Name: {
                        ...item.Name,
                        FirstName: value,
                      },
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  Name: { FirstName: value },
                },
              ],
        });
        break;
      case "CMiddleName":
        setTempFormDatas({
          ...tempFormDatas,
          Contact: tempFormDatas.Contact.length
            ? tempFormDatas.Contact.map((item) => {
                return item.ContactPurpose?.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      Name: {
                        ...item.Name,
                        MiddleName: value,
                      },
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  Name: { MiddleName: value },
                },
              ],
        });
        break;
      case "CLastName":
        setTempFormDatas({
          ...tempFormDatas,
          Contact: tempFormDatas.Contact.length
            ? tempFormDatas.Contact.map((item) => {
                return item.ContactPurpose?.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      Name: {
                        ...item.Name,
                        LastName: value,
                      },
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  Name: { LastName: value },
                },
              ],
        });
        break;
      case "CEmailAddress":
        setTempFormDatas({
          ...tempFormDatas,
          Contact: tempFormDatas.Contact.length
            ? tempFormDatas.Contact.map((item) => {
                return item.ContactPurpose?.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      EmailAddress: value,
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  EmailAddress: value,
                },
              ],
        });
        break;
      case "CPhone":
        setTempFormDatas({
          ...tempFormDatas,
          Contact: tempFormDatas.Contact.length
            ? tempFormDatas.Contact.map((item) => {
                return item.ContactPurpose.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      PhoneNumber: item.PhoneNumber?.length
                        ? item.PhoneNumber.map((phone) => {
                            return phone._phoneNumberType === "C"
                              ? {
                                  ...phone,
                                  phoneNumber: value,
                                }
                              : phone;
                          })
                        : [
                            {
                              _phoneNumberType: "C",
                              phoneNumber: value,
                            },
                          ],
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  PhoneNumber: [
                    {
                      _phoneNumberType: "C",
                      phoneNumber: value,
                    },
                  ],
                },
              ],
        });
        break;
      case "assigned_staff_id":
        setTempFormDatas({
          ...tempFormDatas,
          assigned_staff_id: parseInt(value),
        });
        break;
      default:
        setTempFormDatas({ ...tempFormDatas, [name]: value });
        break;
    }
  };

  const handleChangeCredentials = (e) => {
    navigate("/patient/credentials");
  };
  const handleEdit = (e) => {
    setEditVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...tempFormDatas,
    };

    //Valdation
    try {
      await demographicsSchema.validate(datasToPut);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }

    //Formatting
    datasToPut.Names.LegalName.FirstName.Part = firstLetterUpper(
      datasToPut.Names.LegalName.FirstName.Part
    );
    datasToPut.Names.LegalName.LastName.Part = firstLetterUpper(
      datasToPut.Names.LegalName.LastName.Part
    );
    datasToPut.Names.LegalName.OtherName[0].Part = firstLetterUpper(
      datasToPut.Names.LegalName.OtherName[0].Part
    );
    datasToPut.Names.OtherNames[0].OtherName[0].Part = firstLetterUpper(
      datasToPut.Names.OtherNames[0].OtherName[0].Part
    );
    datasToPut.Email = datasToPut.Email.toLowerCase();
    datasToPut.Address.find(
      ({ _addressType }) => _addressType === "R"
    ).Structured.Line1 = firstLetterUpper(
      datasToPut.Address.find(({ _addressType }) => _addressType === "R")
        .Structured.Line1
    );
    datasToPut.Address.find(
      ({ _addressType }) => _addressType === "R"
    ).Structured.City = firstLetterUpper(
      datasToPut.Address.find(({ _addressType }) => _addressType === "R")
        .Structured.City
    );

    //Submission
    try {
      await axiosXanoPatient.put(
        `/demographics/${user.demographics.id}`,
        datasToPut,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      socket.emit("message", {
        route: "DEMOGRAPHICS",
        action: "update",
        content: { id: user.demographics.id, data: datasToPut },
      });
      socket.emit("message", {
        route: "USER",
        action: "update",
        content: { id: user.id, data: datasToPut },
      });
      setSuccessMsg("Infos changed successfully");
      setTimeout(() => setSuccessMsg(""), 2000);
      setEditVisible(false);
    } catch (err) {
      setErrMsg(`Error: unable to save infos: ${err.message}`);
    }
  };

  const handleCancel = (e) => {
    setTempFormDatas(formDatas);
    setEditVisible(false);
  };

  return (
    <div className="patient-account__container">
      {errMsg && <p className="patient-account__err">{errMsg}</p>}
      {successMsg && (
        <p className="patient-account__confirm">Infos changed successfully</p>
      )}
      {tempFormDatas && (
        <form className="patient-account__form">
          <div className="patient-account__form-content">
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-column-img">
                {tempFormDatas.avatar ? (
                  <img
                    src={`${BASE_URL}${tempFormDatas.avatar.path}`}
                    alt="user-avatar"
                  />
                ) : (
                  <img
                    src="https://placehold.co/300x500/png?font=roboto&text=Profile\nPic"
                    alt="user-avatar-placeholder"
                  />
                )}
              </div>
            </div>
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-row">
                <label>Name Prefix: </label>
                {tempFormDatas.Names.NamePrefix}
              </div>
              <div className="patient-account__form-content-row">
                <label>First Name*: </label>
                {tempFormDatas.Names.LegalName.FirstName.Part}
              </div>
              <div className="patient-account__form-content-row">
                <label>Middle Name: </label>
                {tempFormDatas.Names.LegalName.OtherName[0].Part}
              </div>
              <div className="patient-account__form-content-row">
                <label>Last Name*: </label>
                {tempFormDatas.Names.LegalName.LastName.Part}
              </div>
              <div className="patient-account__form-content-row">
                <label>Name Suffix: </label>
                {tempFormDatas.Names.LastNameSuffix}
              </div>
              <div className="patient-account__form-content-row">
                <label>Nick Name: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={
                      tempFormDatas.Names?.OtherNames?.length
                        ? tempFormDatas.Names?.OtherNames[0].OtherName[0].Part
                        : ""
                    }
                    onChange={handleChange}
                    name="NickName"
                    autoComplete="off"
                  />
                ) : formDatas.Names.OtherNames.length ? (
                  formDatas.Names.OtherNames[0].OtherName[0].Part
                ) : (
                  ""
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Chart#*: </label>
                {tempFormDatas.ChartNumber}
              </div>
              <div className="patient-account__form-content-row">
                <label>Date of birth*: </label>
                {toLocalDate(tempFormDatas.DateOfBirth)}
              </div>
              <div className="patient-account__form-content-row">
                <label>Age: </label>
                {getAge(toLocalDate(tempFormDatas.DateOfBirth))}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card#: </label>
                {tempFormDatas.HealthCard.Number}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Version: </label>
                {tempFormDatas.HealthCard.Version}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Expiry: </label>
                {toLocalDate(tempFormDatas.HealthCard.ExpiryDate)}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Province: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  tempFormDatas.HealthCard.ProvinceCode
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Gender*: </label>
                {tempFormDatas.Gender}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card#: </label>
                {tempFormDatas.HealthCard?.Number}
              </div>
              <div className="patient-account__form-content-row">
                <label>Email*: </label>
                {tempFormDatas.Email}
              </div>
              <div className="patient-account__form-content-row">
                <label>Cell Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={
                      tempFormDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "C"
                      )?.phoneNumber
                    }
                    onChange={handleChange}
                    name="Cellphone"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.PhoneNumber.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  ).phoneNumber
                )}
                {editVisible ? (
                  <>
                    <label
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={
                        tempFormDatas.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "C"
                        ).extension
                      }
                      onChange={handleChange}
                      name="CellphoneExt"
                      autoComplete="off"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.PhoneNumber.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "C"
                    ).extension && (
                      <label
                        style={{
                          marginLeft: "30px",
                          marginRight: "10px",
                          minWidth: "auto",
                        }}
                      >
                        Ext
                      </label>
                    )}
                    {
                      formDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "C"
                      ).extension
                    }
                  </>
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Home Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={
                      tempFormDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "R"
                      )?.phoneNumber
                    }
                    onChange={handleChange}
                    name="Homephone"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.PhoneNumber.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  ).phoneNumber
                )}
                {editVisible ? (
                  <>
                    <label
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={
                        tempFormDatas.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "R"
                        ).extension
                      }
                      onChange={handleChange}
                      name="HomephoneExt"
                      autoComplete="off"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.PhoneNumber.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "R"
                    ).extension && (
                      <label
                        style={{
                          marginLeft: "30px",
                          marginRight: "10px",
                          minWidth: "auto",
                        }}
                      >
                        Ext
                      </label>
                    )}
                    {
                      formDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "R"
                      ).extension
                    }
                  </>
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Work Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={
                      tempFormDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "W"
                      )?.phoneNumber
                    }
                    onChange={handleChange}
                    name="Workphone"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.PhoneNumber.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  ).phoneNumber
                )}
                {editVisible ? (
                  <>
                    <label
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={
                        tempFormDatas.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "W"
                        ).extension
                      }
                      onChange={handleChange}
                      name="WorkphoneExt"
                      autoComplete="off"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.PhoneNumber.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "W"
                    ).extension && (
                      <label
                        style={{
                          marginLeft: "30px",
                          marginRight: "10px",
                          minWidth: "auto",
                        }}
                      >
                        Ext
                      </label>
                    )}
                    {
                      formDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "W"
                      ).extension
                    }
                  </>
                )}
              </div>
            </div>
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-row">
                <label>Address*: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={
                      tempFormDatas.Address.find(
                        ({ _addressType }) => _addressType === "R"
                      ).Structured.Line1
                    }
                    onChange={handleChange}
                    name="Address"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.Address.find(
                    ({ _addressType }) => _addressType === "R"
                  ).Structured.Line1
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Province/State*: </label>
                {editVisible ? (
                  <GenericList
                    list={provinceStateTerritoryCT}
                    value={
                      tempFormDatas.Address.find(
                        ({ _addressType }) => _addressType === "R"
                      ).Structured.CountrySubDivisionCode
                    }
                    name="Province"
                    handleChange={handleChange}
                  />
                ) : (
                  toCodeTableName(
                    provinceStateTerritoryCT,
                    formDatas.Address.find(
                      ({ _addressType }) => _addressType === "R"
                    ).Structured.CountrySubDivisionCode
                  )
                )}
              </div>
              <div className="patient-account__form-content-row patient-account__form-content-row--postal">
                <label>Postal/Zip Code*: </label>
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
                      style={{ width: "90px", marginRight: "10px" }}
                      type="text"
                      value={
                        postalOrZip === "postal"
                          ? tempFormDatas.Address.find(
                              ({ _addressType }) => _addressType === "R"
                            ).Structured.PostalZipCode.PostalCode
                          : tempFormDatas.Address.find(
                              ({ _addressType }) => _addressType === "R"
                            ).Structured.PostalZipCode.ZipCode
                      }
                      onChange={handleChange}
                      name="PostalCode"
                      autoComplete="off"
                    />
                  </>
                ) : postalOrZip === "postal" ? (
                  formDatas.Address.find(
                    ({ _addressType }) => _addressType === "R"
                  ).Structured.PostalZipCode.PostalCode
                ) : (
                  formDatas.Address.find(
                    ({ _addressType }) => _addressType === "R"
                  )?.Structured.PostalZipCode.ZipCode
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>City*: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={
                      tempFormDatas.Address.find(
                        ({ _addressType }) => _addressType === "R"
                      ).Structured.City
                    }
                    onChange={handleChange}
                    name="City"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.Address.find(
                    ({ _addressType }) => _addressType === "R"
                  ).Structured.City
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Preferred Official Language: </label>
                {editVisible ? (
                  <GenericList
                    list={officialLanguageCT}
                    value={tempFormDatas.PreferredOfficialLanguage}
                    name="PreferredOfficialLanguage"
                    handleChange={handleChange}
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(
                    officialLanguageCT,
                    formDatas.PreferredOfficialLanguage
                  )
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Status: </label>
                {toCodeTableName(
                  personStatusCT,
                  formDatas.PersonStatusCode?.PersonStatusAsEnum
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Assigned Clinic Practician*: </label>
                {staffIdToTitleAndName(
                  clinic.staffInfos,
                  formDatas.assigned_staff_id,
                  true
                )}
              </div>
              {editVisible ? (
                <fieldset>
                  <legend>Emergency Contact</legend>
                  <p className="patient-account__form-content-row">
                    <label>First Name: </label>
                    <input
                      type="text"
                      value={
                        tempFormDatas.Contact?.length
                          ? tempFormDatas.Contact.find(
                              (contact) =>
                                contact.ContactPurpose?.PurposeAsEnum === "EC"
                            )?.Name?.FirstName || ""
                          : ""
                      }
                      onChange={handleChange}
                      name="CFirstName"
                      autoComplete="off"
                    />
                  </p>
                  <p className="patient-account__form-content-row">
                    <label>Middle Name: </label>
                    <input
                      type="text"
                      value={
                        tempFormDatas.Contact?.length
                          ? tempFormDatas.Contact.find(
                              (contact) =>
                                contact.ContactPurpose?.PurposeAsEnum === "EC"
                            )?.Name?.MiddleName || ""
                          : ""
                      }
                      onChange={handleChange}
                      name="CMiddleName"
                      autoComplete="off"
                    />
                  </p>
                  <p className="patient-account__form-content-row">
                    <label>Last Name: </label>
                    <input
                      type="text"
                      value={
                        tempFormDatas.Contact?.length
                          ? tempFormDatas.Contact.find(
                              (contact) =>
                                contact.ContactPurpose?.PurposeAsEnum === "EC"
                            )?.Name?.LastName || ""
                          : ""
                      }
                      onChange={handleChange}
                      name="CLastName"
                      autoComplete="off"
                    />
                  </p>
                  <p className="patient-account__form-content-row">
                    <label>Email: </label>
                    <input
                      type="email"
                      value={
                        tempFormDatas.Contact?.length
                          ? tempFormDatas.Contact.find(
                              (contact) =>
                                contact.ContactPurpose?.PurposeAsEnum === "EC"
                            )?.EmailAddress || ""
                          : ""
                      }
                      onChange={handleChange}
                      name="CEmailAddress"
                      autoComplete="off"
                    />
                  </p>
                  <p className="patient-account__form-content-row">
                    <label>Phone: </label>
                    <input
                      type="text"
                      value={
                        tempFormDatas.Contact?.length
                          ? tempFormDatas.Contact.find(
                              (contact) =>
                                contact.ContactPurpose?.PurposeAsEnum === "EC"
                            ).PhoneNumber?.find(
                              ({ _phoneNumberType }) => _phoneNumberType === "C"
                            ).phoneNumber || ""
                          : ""
                      }
                      onChange={handleChange}
                      name="CPhone"
                      autoComplete="off"
                    />
                  </p>
                </fieldset>
              ) : (
                <div className="patient-account__form-content-row">
                  <label>Emergency Contact: </label>
                  {emergencyContactCaption(emergencyContact)}
                </div>
              )}

              {editVisible && (
                <div className="patient-account__form-content-sign">
                  <em>
                    If you want to change further informations please ask a
                    staff member
                  </em>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
      <div className="patient-account__btns">
        {editVisible ? (
          <>
            <button onClick={handleSubmit}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <>
            {/*On retire la possibilité d'éditer}
            {/* <button onClick={handleEdit}>Edit</button> */}
            <button onClick={handleChangeCredentials}>
              Change email/password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountPatientForm;
