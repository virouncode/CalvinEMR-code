import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";

const ClinicalNotesToolBar = ({
  contentsVisible,
  setContentsVisible,
  addVisible,
  setAddVisible,
  search,
  handleSearch,
  contentRef,
  triangleRef,
  setCheckedNotes,
  checkedNotes,
  checkAllNotes,
  setPopUpVisible,
  selectAllDisabled,
  selectAll,
  setSelectAll,
  order,
  setOrder,
  paging,
  setPaging,
  overviewVisible,
  setOverviewVisible,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { id } = useParams();

  //Events
  const handleClickOverview = () => {
    setOverviewVisible(true);
  };
  const handleClickSelectAll = async (e) => {
    if (selectAll) {
      setSelectAll(false);
      setCheckedNotes([]);
    } else {
      checkAllNotes();
      setSelectAll(true);
    }
  };
  const handleClickNew = () => {
    setAddVisible(true);
    setPaging({ ...paging, page: 1 });
    triangleRef.current.classList.add("triangle--active");
    contentRef.current.classList.add("clinical-notes__content--active");
  };
  const handleClickFold = (e) => {
    if (!contentsVisible) {
      triangleRef.current.classList.add("triangle--active");
      contentRef.current.classList.add("clinical-notes__content--active");
    }
    setContentsVisible((v) => !v);
  };
  const handleClickPrint = () => {
    setPopUpVisible((v) => !v);
  };
  const handleChange = (e) => {
    handleSearch(e);
    if (!triangleRef.current.classList.contains("triangle--active")) {
      triangleRef.current.classList.add("triangle--active");
    }
    if (
      !contentRef.current.classList.contains("clinical-notes__content--active")
    ) {
      contentRef.current.classList.add("clinical-notes__content--active");
    }
  };

  const handleChangeOrder = async (e) => {
    let newOrder;
    if (order === "asc") {
      setOrder("desc");
      newOrder = "desc";
    } else {
      setOrder("asc");
      newOrder = "asc";
    }
    setPaging({ ...paging, page: 1 });
    try {
      const response = await xanoPut(`/settings/${user.settings.id}`, "staff", {
        ...user.settings,
        clinical_notes_order: newOrder,
      });
      socket.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            settings: response.data,
          },
        },
      });
    } catch (err) {
      toast.error(`Error: unable to change order: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  return (
    <div className="clinical-notes__toolbar">
      <div>
        <label>
          <strong>Search</strong>
        </label>
        <input type="text" value={search} onChange={handleChange}></input>
      </div>
      <div>
        Most recent on:
        <span onClick={handleChangeOrder}>
          {order === "asc" ? (
            <i
              className="fa-solid fa-arrow-down"
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            ></i>
          ) : (
            <i
              className="fa-solid fa-arrow-up"
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            ></i>
          )}
          {order === "asc" ? "Bottom" : "Top"}
        </span>
      </div>
      <div className="clinical-notes__toolbar-btn-container">
        <button onClick={handleClickFold}>
          {contentsVisible ? "Fold" : "Unfold"}
        </button>
        <button onClick={handleClickOverview} disabled={overviewVisible}>
          Overview
        </button>
        <button onClick={handleClickNew} disabled={addVisible}>
          New
        </button>
        <button onClick={handleClickPrint} disabled={checkedNotes.length === 0}>
          Print Selection
        </button>
        <button onClick={handleClickSelectAll} disabled={selectAllDisabled}>
          {selectAll ? "Unselect All" : "Select All"}
        </button>
      </div>
    </div>
  );
};

export default ClinicalNotesToolBar;
