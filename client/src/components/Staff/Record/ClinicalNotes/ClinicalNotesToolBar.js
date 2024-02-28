import React from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useUserContext from "../../../../hooks/useUserContext";

const ClinicalNotesToolBar = ({
  addVisible,
  setAddVisible,
  search,
  setSearch,
  contentRef,
  triangleRef,
  setCheckedNotes,
  checkedNotes,
  checkAllNotes,
  setPopUpVisible,
  selectAllDisabled,
  selectAll,
  setSelectAll,
  allBodiesVisible,
  setAllBodiesVisible,
  order,
  setOrder,
  paging,
  setPaging,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  //Events
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
    if (!allBodiesVisible) {
      triangleRef.current.classList.add("triangle--active");
      contentRef.current.classList.add("clinical-notes__content--active");
    }
    setAllBodiesVisible((v) => !v);
  };
  const handleClickPrint = () => {
    setPopUpVisible((v) => !v);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    triangleRef.current.classList.add("triangle--active");
    contentRef.current.classList.add("clinical-notes-content--active");
  };

  const handleChangeOrder = async (e) => {
    const value = e.target.value;
    setOrder(value);
    setPaging({ ...paging, page: 1 });
    try {
      await axiosXanoStaff.put(
        `settings/${user.settings.id}`,
        { ...user.settings, clinical_notes_order: value },
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
            settings: { ...user.settings, clinical_notes_order: value },
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
      <div className="clinical-notes__order">
        <p>Most recent on:</p>
        <div className="clinical-notes__radio-item">
          <input
            type="radio"
            name="order"
            value="desc"
            id="top"
            onChange={handleChangeOrder}
            checked={order === "desc"}
          />
          <label htmlFor="top">Top</label>
        </div>
        <div className="clinical-notes__radio-item">
          <input
            type="radio"
            name="order"
            value="asc"
            id="bottom"
            onChange={handleChangeOrder}
            checked={order === "asc"}
          />
          <label htmlFor="bottom">Bottom</label>
        </div>
      </div>
      <div>
        <button onClick={handleClickFold}>
          {allBodiesVisible ? "Fold All" : "Unfold All"}
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
