import { CircularProgress } from "@mui/material";
import { PDFDocument } from "pdf-lib";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";
import ConfirmGlobal from "../../../All/Confirm/ConfirmGlobal";
import Eform from "../Topics/Eforms/Eform";
import EformItem from "../Topics/Eforms/EformItem";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const EformsPU = ({
  patientId,
  demographicsInfos,
  setPopUpVisible,
  datas,
  errMsg,
  isLoading,
  showDocument,
}) => {
  //HOOKS
  const { auth, user, socket } = useAuth();
  const [addVisible, setAddVisible] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  //HANDLERS
  const handleAdd = (e) => {
    setAddVisible((v) => !v);
  };

  const handleClose = async (e) => {
    setPopUpVisible(false);
  };

  const handleAddToRecord = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 25000000) {
        toast.error("The file is over 25Mb, please choose another one", {
          containerId: "B",
        });
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result;
        try {
          const response = await axiosXanoStaff.post(
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
          //flatten the pdf
          const formUrl = `${BASE_URL}${response.data.path}`;
          const formPdfBytes = await fetch(formUrl).then((res) =>
            res.arrayBuffer()
          );
          const pdfDoc = await PDFDocument.load(formPdfBytes);
          const form = pdfDoc.getForm();
          form.flatten();
          const pdfBytes = await pdfDoc.save();
          //read the new flattened pdf
          let reader2 = new FileReader();
          reader2.readAsDataURL(
            new Blob([pdfBytes], { type: "application/pdf" })
          );
          // here we tell the reader what to do when it's done reading...
          reader2.onload = async (e) => {
            let content = e.target.result;
            try {
              const response2 = await axiosXanoStaff.post(
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
              const datasToPost = {
                patient_id: patientId,
                name: file.name,
                file: response2.data,
              };
              const response = await postPatientRecord(
                "/eforms",
                user.id,
                auth.authToken,
                datasToPost
              );
              socket.emit("message", {
                route: "E-FORMS",
                action: "create",
                content: { data: response.data },
              });

              toast.success(`Form successfully added to patient record`, {
                containerId: "B",
              });
              setIsLoadingFile(false);
            } catch (err) {}
          };
        } catch (err) {
          toast.error(`Error: unable to save file: ${err.message}`, {
            containerId: "B",
          });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };

  return (
    <>
      <h1 className="eforms__title">
        Patient e-forms <i className="fa-regular fa-newspaper"></i>
      </h1>
      {isLoading ? (
        <CircularProgress />
      ) : errMsg ? (
        <p className="eforms__err">{errMsg}</p>
      ) : (
        datas && (
          <>
            <table className="eforms__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created By</th>
                  <th>Created On</th>
                  <th style={{ textDecoration: "none", cursor: "default" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {datas.map((eform) => (
                  <EformItem
                    item={eform}
                    key={eform.id}
                    showDocument={showDocument}
                  />
                ))}
              </tbody>
            </table>
            <div className="eforms__btn-container">
              <button onClick={handleAdd} disabled={addVisible}>
                Add e-form
              </button>
              <button onClick={handleClose} disabled={isLoadingFile}>
                Close
              </button>
            </div>
            {addVisible && (
              <Eform
                setAddVisible={setAddVisible}
                patientId={patientId}
                demographicsInfos={demographicsInfos}
                handleAddToRecord={handleAddToRecord}
                isLoadingFile={isLoadingFile}
                setIsLoadingFile={setIsLoadingFile}
              />
            )}
          </>
        )
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </>
  );
};

export default EformsPU;
