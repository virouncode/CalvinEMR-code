import React, { useState } from "react";
import { axiosXanoStaff } from "../../../../../api/xanoStaff";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useFetchDatas from "../../../../../hooks/useFetchDatas";
import useUserContext from "../../../../../hooks/useUserContext";
import fillPdfForm from "../../../../../utils/fillPdfForm";
import EformsList from "../../../../All/UI/Lists/EformsList";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const Eform = ({
  setAddVisible,
  handleAddToRecord,
  isLoadingFile,
  setIsLoadingFile,
  demographicsInfos,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const [eFormsBlank] = useFetchDatas(
    "/eforms_blank",
    axiosXanoStaff,
    auth.authToken
  );
  const [formSelectedId, setFormSelectedId] = useState("");
  const [formURL, setFormURL] = useState("");

  const handleFormChange = async (e) => {
    setFormSelectedId(e.target.value);
    setIsLoadingFile(true);
    const url = eFormsBlank.find(({ id }) => id === parseInt(e.target.value))
      ?.file?.url;

    try {
      setFormURL(await fillPdfForm(url, demographicsInfos, user));
      setIsLoadingFile(false);
    } catch (err) {
      setIsLoadingFile(false);
      alert(`Can't fill in e-form: ${err.message}`);
    }
  };

  const handleClose = () => {
    setAddVisible(false);
  };

  return (
    <>
      <div className="eforms__form">
        <div className="eforms__explainations">
          <ul>
            <li>
              1. Please choose an e-form in the following list:{" "}
              <EformsList
                handleFormChange={handleFormChange}
                formSelectedId={formSelectedId}
                eFormsBlank={eFormsBlank}
              />{" "}
            </li>
            <li>2. Fill-in the form with relevant informations</li>
            <li>
              3. Click on print icon <i className="fa-solid fa-print"></i>{" "}
              (upper-right corner) if you want to print the form
            </li>
            <li>
              4. To Add the completed form to the patient record:
              <ul>
                <li>
                  a. Click on download icon{" "}
                  <i className="fa-solid fa-download"></i> (upper-right corner),
                  name and save the document on your computer{" "}
                </li>
                <li>
                  b. Click{" "}
                  <button onClick={handleAddToRecord} disabled={isLoadingFile}>
                    Add To Record
                  </button>{" "}
                  {isLoadingFile && <CircularProgressMedium />}
                  button and upload the file you just saved
                </li>
              </ul>
            </li>
          </ul>
          <button onClick={handleClose} disabled={isLoadingFile}>
            Close
          </button>
        </div>
        <div className="eforms__content">
          {formURL && (
            <iframe src={formURL} title="form" width="800" height="1000" />
          )}
        </div>
      </div>
    </>
  );
};

export default Eform;
