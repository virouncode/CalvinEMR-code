import React, { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useBillingTemplatesSocket from "../../../hooks/socket/useBillingTemplatesSocket";
import useFetchDatas from "../../../hooks/useFetchDatas";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import EmptyLi from "../../UI/Lists/EmptyLi";
import BillingCodesTemplateForm from "./BillingCodesTemplateForm";
import BillingCodesTemplateItem from "./BillingCodesTemplateItem";

const BillingCodesTemplates = ({ handleSelectTemplate }) => {
  const { staffInfos } = useStaffInfosContext();
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [search, setSearch] = useState("");
  const [templates, setTemplates] = useFetchDatas(
    "/billing_codes_templates",
    "staff"
  );
  useBillingTemplatesSocket(templates, setTemplates);

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      staffIdToTitleAndName(staffInfos, template.author_id)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleAddNew = (e) => {
    e.preventDefault();
    setNewTemplateVisible((v) => !v);
  };

  return (
    <div className="billing-codes__templates">
      <div className="billing-codes__templates-btn-container">
        <button onClick={handleAddNew}>Add a new template</button>
      </div>
      <div className="billing-codes__templates-search">
        <label htmlFor="template-search">Search</label>
        <input
          style={{ width: "300px" }}
          id="template-search"
          type="text"
          value={search}
          onChange={handleSearch}
          autoComplete="off"
          placeholder="Template, author name, codes..."
        />
      </div>
      {errMsgPost && (
        <p className="billing-codes__templates-err">{errMsgPost}</p>
      )}
      <div className="billing-codes__templates-list">
        <ul>
          {newTemplateVisible && (
            <BillingCodesTemplateForm
              erMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
              setNewTemplateVisible={setNewTemplateVisible}
            />
          )}
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <BillingCodesTemplateItem
                template={template}
                handleSelectTemplate={handleSelectTemplate}
                errMsgPost={errMsgPost}
                setErrMsgPost={setErrMsgPost}
              />
            ))
          ) : (
            <EmptyLi text="No results found" />
          )}
        </ul>
      </div>
    </div>
  );
};

export default BillingCodesTemplates;
