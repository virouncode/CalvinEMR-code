import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";

const PatientAIAgreement = ({ demographicsInfos, setPopUpVisible }) => {
  const { user } = useUserContext();
  const { auth } = useAuthContext();
  const { socket } = useSocketContext();
  const [agreed, setAgreed] = useState(true);
  const handleChange = (e) => {
    const id = e.target.id;
    if (id === "yes") setAgreed(true);
    else setAgreed(false);
  };
  const handleConfirm = async () => {
    const datasToPut = { ...demographicsInfos };
    datasToPut.ai_consent_read = true;
    datasToPut.ai_consent = agreed;
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
        route: "PATIENT USER DEMOGRAPHICS",
        action: "update",
        content: { id: user.id, data: datasToPut },
      });
      setPopUpVisible(false);
      toast.success("Saved preference", {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Unable to confirm agreement/disagreement: ${err.message}`, {
        containerId: "A",
      });
    }
  };
  return (
    <div className="patient-ai-agreement">
      <h1>Understanding Artificial Intelligence in Your Care</h1>
      <p>Enhancing Your Healthcare Journey with Artificial Intelligence</p>
      <p>
        <strong>Definition:</strong> AI refers to computer systems able to
        perform tasks that normally require human intelligence. In healthcare,
        AI can help analyze complex medical data to enhance patient care.
      </p>
      <p>
        <strong>Purpose:</strong> The aim is to assist your healthcare provider
        in making better-informed decisions, quicker diagnoses, and personalized
        treatment plans.
      </p>

      <h2>Benefits of AI in Healthcare</h2>
      <p>
        <strong>Enhanced Diagnostic Accuracy:</strong> AI can help identify
        conditions from images (like X-rays, MRIs) and data more quickly and
        accurately.
      </p>
      <p>
        <strong>Personalized Treatment:</strong> Tailoring treatment plans to
        individual patient needs based on a vast amount of data.
      </p>
      <p>
        <strong>Efficiency:</strong> Reducing wait times and speeding up the
        care process.
      </p>

      <h2>What This Means for You</h2>
      <p>
        <strong>Collaborative Care:</strong> Your doctor and the AI work
        together to provide you with the best care possible.
      </p>
      <p>
        <strong>Informed Decisions:</strong> AI provides additional information
        to help your doctor make well-informed decisions regarding your care.
      </p>

      <h2>Your Data Privacy</h2>
      <p>
        <strong>Privacy Assurance:</strong> Ensuring the confidentiality and
        security of your medical data is a top priority. Your data is handled in
        compliance with all applicable privacy laws and regulations.
      </p>
      <p>
        <strong>Anonymized Data Usage:</strong> None of your identification
        information is sent to the artificial intelligence software. The AI
        analyzes anonymized data to assist in your care.
      </p>
      <p>
        <strong>Consent:</strong> Your consent will be obtained before utilizing
        AI in your care, and you have the right to revoke consent at any time.
      </p>

      <h2>Consent</h2>
      <p>
        I, the undersigned, hereby provide my consent to my Healthcare Provider
        (the "Provider") to utilize the Artificial Intelligence System (the
        "System") as part of my medical care.
      </p>

      <h2>Understanding</h2>
      <ul>
        <li>
          I understand that the System assists my Provider in diagnosing and/or
          treating medical conditions.
        </li>
        <li>
          I have been informed about how the System works, and the extent to
          which it will be involved in my care.
        </li>
      </ul>

      <h2>Risks and Benefits</h2>
      <ul>
        <li>
          I understand the potential risks and benefits of using the System,
          including but not limited to, the risk of inaccurate or delayed
          diagnosis, and the potential for improved diagnostic accuracy.
        </li>
      </ul>

      <h2>Alternative Options</h2>
      <ul>
        <li>
          I understand that I have the right to refuse the use of the System in
          my care and that alternative options have been explained to me.
        </li>
      </ul>

      <h2>Data Privacy</h2>
      <ul>
        <li>
          I understand that my personal and medical information will be used by
          the System to assist in my care, and that all necessary steps will be
          taken to protect my privacy and data security in compliance with
          applicable laws and regulations.
        </li>
      </ul>

      <h2>Questions and Concerns</h2>
      <ul>
        <li>
          I have had the opportunity to ask questions and discuss any concerns
          regarding the use of the System in my care with my Provider.
        </li>
      </ul>

      <h2>Revocation of Consent</h2>
      <ul>
        <li>
          I understand that I have the right to revoke this consent at any time,
          with the understanding that revocation will not affect any actions
          taken prior to the revocation.
        </li>
      </ul>

      <h2>No Guarantees</h2>
      <ul>
        <li>
          I understand that the use of the System does not guarantee any
          specific outcomes, and that the ultimate decisions regarding my care
          remain with my Provider.
        </li>
      </ul>

      <h2>Electronic Acknowledgment</h2>
      <ul>
        <li>
          By clicking on the checkmark below, I acknowledge that I have read,
          understood, and agree to the terms set forth above.
        </li>
      </ul>

      <p>I agree to the terms and conditions outlined in this consent form.</p>

      <p>
        Upon clicking the checkmark, the patient affirms their agreement to the
        stipulated terms, which govern the use of the System in their medical
        care. This digital acknowledgment serves as their agreement to abide by
        the stipulations laid out in this consent form.
      </p>
      <div className="patient-ai-agreement-footer">
        <div className="patient-ai-agreement-radio">
          <div className="patient-ai-agreement-radio-item">
            <input
              type="radio"
              name="agreement"
              id="yes"
              value={agreed}
              onChange={handleChange}
            />
            <label htmlFor="yes">
              I agree to the terms and conditions outlined in this consent form.
            </label>
          </div>
          <div className="patient-ai-agreement-radio-item">
            <input
              type="radio"
              name="agreement"
              id="no"
              value={!agreed}
              onChange={handleChange}
            />
            <label htmlFor="disagreement">
              I don't agree to the terms and conditions outlined in this consent
              form.
            </label>
          </div>
        </div>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default PatientAIAgreement;
