import React from "react";
import SplittedHeader from "../../../../All/UI/Tables/SplittedHeader";
import RecImmunizationRow from "./RecImmunizationRow";

const RecImmunizationsTable = ({
  datas,
  patientId,
  patientDob,
  loadingPatient,
  errPatient,
}) => {
  const H_STYLE = {
    minWidth: "100px",
    padding: "2px 5px",
    border: "solid 1px black",
    fontWeight: "bold",
  };
  const H_STYLE_GRADE_7 = {
    minWidth: "120px",
    padding: "2px 5px",
    border: "solid 1px black",
    fontWeight: "bold",
  };
  const H_STYLE_34_YEARS = {
    minWidth: "160px",
    padding: "2px 5px",
    border: "solid 1px black",
    fontWeight: "bold",
  };
  const H_STYLE_65_YEARS = {
    minWidth: "110px",
    padding: "2px 5px",
    border: "solid 1px black",
    fontWeight: "bold",
  };

  return (
    <table className="recimmunizations__table">
      <thead>
        <tr>
          <SplittedHeader left="Immunization Type" right="Age" />
          <th style={H_STYLE}>2 Months</th>
          <th style={H_STYLE}>4 Months</th>
          <th style={H_STYLE}>6 Months</th>
          <th style={H_STYLE}>1 Year</th>
          <th style={H_STYLE}>15 Months</th>
          <th style={H_STYLE}>18 Months</th>
          <th style={H_STYLE}>4 Years</th>
          <th style={H_STYLE_GRADE_7}>Grade 7</th>
          <th style={H_STYLE}>14 Years</th>
          <th style={H_STYLE}>24 Years</th>
          <th style={H_STYLE_34_YEARS}>&gt;=34 Years</th>
          <th style={H_STYLE_65_YEARS}>65 Years</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            x<strong>DTaP-IPV-Hib</strong>
            <br />
            <span className="description">
              Diphteria, Tetanus, Acellular Pertussis, Inactivated Polio,
              Haemophilius influenzae type b - pediatric
            </span>
          </th>
          <RecImmunizationRow
            type="DTaP-IPV-Hib"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "DTaP-IPV-Hib"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Pneu-C-7</strong>
            <br />
            <span className="description">Pneumococcal-Conjugate - valent</span>
          </th>
          <RecImmunizationRow
            type="Pneu-C-7"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Pneu-C-7"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>ROT</strong>
            <br />
            <span className="description">Rotavirus - Oral</span>
          </th>
          <RecImmunizationRow
            type="ROT"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "ROT"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Men-C</strong>
            <br />
            <span className="description">Meningococcal-Conjugate</span>
          </th>
          <RecImmunizationRow
            type="Men-C"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Men-C"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>MMR</strong>
            <br />
            <span className="description">Measles, Mumps, Rubella</span>
          </th>
          <RecImmunizationRow
            type="MMR"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "MMR"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Var</strong>
            <br />
            <span className="description">Varicella</span>
          </th>
          <RecImmunizationRow
            type="Var"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Var"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>MMR-Var</strong>
            <br />
            <span className="description">
              Measles, Mumps, Rubella, Varicella/span
            </span>
          </th>
          <RecImmunizationRow
            type="MMR-Var"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "MMR-Var"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>TdapIPV</strong>
            <br />
            <span className="description">
              Tetanus, Diptheria, Acellular Pertusis, Inactivated Poliomyelitis
            </span>
          </th>
          <RecImmunizationRow
            type="TdapIPV"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "TdapIPV"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>HB</strong>
            <br />
            <span className="description">Hepatitis B</span>
          </th>
          <RecImmunizationRow
            type="HB"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "HB"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Men-C</strong>
            <br />
            <span className="description">Meningococcal - Conjugate</span>
          </th>
          <RecImmunizationRow
            type="Men-C"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Men-C"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>HPV</strong>
            <br />
            <span className="description">Human Papillomavirus</span>
          </th>
          <RecImmunizationRow
            type="HPV"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "HPV"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Tdap</strong>
            <br />
            <span className="description">
              Tetanus, Diphtheria, Acellular Pertussis - adult
            </span>
          </th>
          <RecImmunizationRow
            type="Tdap"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Tdap"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Td</strong>
            <br />
            <span className="description">Tetanus, Diphtheria - adult</span>
          </th>
          <RecImmunizationRow
            type="Td"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Td"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Zos</strong>
            <br />
            <span className="description">Herpes, Zoster</span>
          </th>
          <RecImmunizationRow
            type="Zos"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Zos"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Pneu-P-23</strong>
            <br />
            <span className="description">
              Pneumococcal-Polysaccharide - valent
            </span>
          </th>
          <RecImmunizationRow
            type="Pneu-P-23"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Pneu-P-23"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Tdap_pregnancy</strong>
            <br />
            <span className="description">Tetanus, diphtheria, pertussis</span>
          </th>
          <RecImmunizationRow
            type="Tdap_pregnancy"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Tdap_pregnancy"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
        <tr>
          <th>
            <strong>Inf</strong>
            <br />
            <span className="description">Influenza</span>
          </th>
          <RecImmunizationRow
            type="Inf"
            patientDob={patientDob}
            immunizationInfos={datas.filter(
              ({ ImmunizationType }) => ImmunizationType === "Inf"
            )}
            patientId={patientId}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        </tr>
      </tbody>
    </table>
  );
};

export default RecImmunizationsTable;
