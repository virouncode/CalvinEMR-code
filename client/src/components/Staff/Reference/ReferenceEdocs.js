import React, { useState } from "react";
import useEdocsSocket from "../../../hooks/socket/useEdocsSocket";
import useFetchEdocs from "../../../hooks/useFetchEdocs";
import useIntersection from "../../../hooks/useIntersection";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import FakeWindow from "../../UI/Windows/FakeWindow";
import EdocForm from "./EdocForm";
import ReferenceEdocItem from "./ReferenceEdocItem";

const ReferenceEdocs = () => {
  const [errMsgPost, setErrMsgPost] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const {
    search,
    setSearch,
    edocs,
    setEdocs,
    paging,
    setPaging,
    hasMore,
    loading,
    errMsg,
  } = useFetchEdocs();

  useEdocsSocket(edocs, setEdocs);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };

  const handleAdd = () => {
    setAddVisible(true);
  };

  return (
    <div className="reference-edocs">
      <div className="reference-edocs__title">
        <h3>E-docs</h3>
        <button onClick={handleAdd} disabled={progress || addVisible}>
          Add
        </button>
      </div>
      <div className="reference-edocs__search">
        <label>Search</label>
        <input type="text" value={search} onChange={handleSearch} />
      </div>
      <div className="reference-edocs__results">
        {errMsg && <div className="reference-edocs__err">{errMsg}</div>}
        {!errMsg && (
          <>
            <div className="reference-edocs__table-container" ref={rootRef}>
              <table className="reference-edocs__table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Name</th>
                    <th>File</th>
                    <th>Notes</th>
                    <th>Created by</th>
                    <th>Created on</th>
                  </tr>
                </thead>
                <tbody>
                  {edocs && edocs.length > 0
                    ? edocs.map((item, index) =>
                        index === edocs.length - 1 ? (
                          <ReferenceEdocItem
                            item={item}
                            key={item.id}
                            setErrMsgPost={setErrMsgPost}
                            errMsgPost={errMsgPost}
                            lastItemRef={lastItemRef}
                          />
                        ) : (
                          <ReferenceEdocItem
                            item={item}
                            key={item.id}
                            setErrMsgPost={setErrMsgPost}
                            errMsgPost={errMsgPost}
                          />
                        )
                      )
                    : !loading && <EmptyRow colSpan="6" text="No edocs" />}
                  {loading && <LoadingRow colSpan="6" />}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {addVisible && (
        <FakeWindow
          title="ADD A NEW E-DOC"
          width={1000}
          height={550}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#94bae8"
          setPopUpVisible={setAddVisible}
        >
          <EdocForm
            setAddVisible={setAddVisible}
            setErrMsgPost={setErrMsgPost}
            errMsgPost={errMsgPost}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ReferenceEdocs;
