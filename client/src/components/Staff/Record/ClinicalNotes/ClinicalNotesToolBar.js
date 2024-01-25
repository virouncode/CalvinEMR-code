import React from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuth from "../../../../hooks/useAuth";

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
}) => {
  //HOOKS
  const { auth, user, setUser } = useAuth();
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
    try {
      await axiosXanoStaff.put(
        `settings/${user.settings.id}`,
        { ...user.settings, progress_notes_order: value },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      setUser({
        ...user,
        settings: { ...user.settings, progress_notes_order: value },
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          settings: { ...user.settings, progress_notes_order: value },
        })
      );
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
            value="top"
            id="top"
            onChange={handleChangeOrder}
            checked={order === "top"}
          />
          <label htmlFor="top">Top</label>
        </div>
        <div className="clinical-notes__radio-item">
          <input
            type="radio"
            name="order"
            value="bottom"
            id="bottom"
            onChange={handleChangeOrder}
            checked={order === "bottom"}
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
