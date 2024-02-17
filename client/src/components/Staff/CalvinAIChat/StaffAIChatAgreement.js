import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";

const StaffAIChatAgreement = ({ setStart }) => {
  const { user, auth } = useAuthContext();
  const [agreed, setAgreed] = useState(false);
  const handleCheck = (e) => {
    if (e.target.checked) setAgreed(true);
    else setAgreed(false);
  };
  const handleStart = async () => {
    try {
      const response = await axiosXanoStaff.get(`/staff/${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const datasToPut = response.data;
      datasToPut.ai_consent = true;
      await axiosXanoStaff.put(`/staff/${user.id}`, datasToPut, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, ai_consent: true })
      );
      setStart(true);
    } catch (err) {
      toast.error(`Unable to save agreement: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  return (
    <div
      className="staff-ai-agreement"
      style={{ width: "80%", margin: "0 auto", fontSize: "0.8rem" }}
    >
      <h2 className="staff-ai-agreement-title staff-ai-agreement-title--chat">
        **DISCLAIMER AND ACKNOWLEDGMENT**
      </h2>
      <p>
        Before utilizing the Artificial Intelligence System ("System") for
        patient care, you, the Healthcare Provider ("Provider" or "You"), must
        read, understand, and agree to the following terms:
      </p>

      <ol>
        <li>
          <label>**Scope of Use**</label>
          <ul>
            <li>
              You acknowledge that the System is designed to assist in clinical
              decision-making and does not replace professional medical
              judgment.
            </li>
            <li>
              You agree to use the System as a support tool and not as a
              replacement for your professional knowledge, expertise, and
              judgment.
            </li>
          </ul>
        </li>
        <li>
          <label>**No Guarantee**</label>
          <ul>
            <li>
              You understand that the System's suggestions are based on
              statistical analysis and machine learning, and there is no
              guarantee of accuracy, correctness, or completeness.
            </li>
            <li>
              You acknowledge that it's your responsibility to verify the
              System's suggestions against your professional knowledge and other
              reliable sources.
            </li>
          </ul>
        </li>
        <li>
          <label>**Liability**</label>
          <ul>
            <li>
              You agree that the liability for any decisions made in patient
              care rests with you, not the developers, vendors, or providers of
              the System.
            </li>
            <li>
              You indemnify and hold harmless the System's developers, vendors,
              and providers from any claims arising from its use.
            </li>
          </ul>
        </li>
        <li>
          <label>**Training and Competence**</label>
          <ul>
            <li>
              You affirm that you have received adequate training on the use of
              the System and are competent in its use.
            </li>
            <li>
              You agree to participate in ongoing training as required to
              maintain competence in using the System.
            </li>
          </ul>
        </li>
        <li>
          <label>**Patient Consent**</label>
          <ul>
            <li>
              You agree to obtain informed consent from patients when using the
              System, explaining the benefits, risks, and alternatives.
            </li>
          </ul>
        </li>
        <li>
          <label>**Data Privacy and Security**</label>
          <ul>
            <li>
              You agree to uphold data privacy and security standards in
              compliance with applicable laws and institutional policies.
            </li>
          </ul>
        </li>
        <li>
          <label>**Continuous Improvement**</label>
          <ul>
            <li>
              You agree to provide feedback on the System’s performance to
              support continuous improvement and to report any issues or adverse
              events promptly.
            </li>
          </ul>
        </li>
        <li>
          <label>**Regulatory Compliance**</label>
          <ul>
            <li>
              You agree to comply with all applicable laws, regulations, and
              institutional policies governing the use of AI in healthcare.
            </li>
          </ul>
        </li>
        <li>
          <label>**Updates to Disclaimer**</label>
          <ul>
            <li>
              You acknowledge that this disclaimer may be updated from time to
              time, and agree to review and comply with the updated terms.
            </li>
          </ul>
        </li>
        <li>
          <label>**Acknowledgment**</label>
          <ul>
            <li>
              By clicking on the checkmark below, you acknowledge that you have
              read, understood, and agree to the terms set forth above.
            </li>
          </ul>
        </li>
      </ol>
      <div className="staff-ai-agreement-check staff-ai-agreement-check--chat">
        <input
          type="checkbox"
          id="agreement"
          checked={agreed}
          onChange={handleCheck}
        />
        <label htmlFor="agreement">
          I agree to the terms and conditions outlined in this disclaimer.
        </label>
        <button disabled={!agreed} onClick={handleStart}>
          Start
        </button>
      </div>
    </div>
  );
};

export default StaffAIChatAgreement;
