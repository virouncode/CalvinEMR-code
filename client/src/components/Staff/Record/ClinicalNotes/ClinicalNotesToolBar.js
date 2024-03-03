import React from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useUserContext from "../../../../hooks/useUserContext";

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
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  //Events
  const handleClickOverview = () => {
    setOverviewVisible(true);
  };
  const handleClickSelectAll = (e) => {
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
      await axiosXanoStaff.put(
        `settings/${user.settings.id}`,
        { ...user.settings, clinical_notes_order: newOrder },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      socket.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            settings: { ...user.settings, clinical_notes_order: newOrder },
          },
        },
      });
      toast.success("Saved preference", {
        containerId: "A",
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
        Date:
        <span onClick={handleChangeOrder}>
          {order === "asc" ? (
            <i
              className="fa-solid fa-arrow-up"
              style={{ marginLeft: "10px", cursor: "pointer" }}
            ></i>
          ) : (
            <i
              className="fa-solid fa-arrow-down"
              style={{ marginLeft: "10px", cursor: "pointer" }}
            ></i>
          )}
        </span>
      </div>
      {/* <ClinicalNotesOrderRadio
        order={order}
        handleChangeOrder={handleChangeOrder}
      /> */}
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
