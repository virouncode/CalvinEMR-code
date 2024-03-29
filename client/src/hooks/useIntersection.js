import { useCallback, useRef } from "react";

const useIntersection = (
  loading,
  hasMore,
  setPaging,
  addVisible = null,
  order = null
) => {
  const rootRef = useRef(null);
  const observer = useRef(null);
  const lastItemRef = useCallback(
    (node) => {
      if (loading || (addVisible && order === "asc")) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      const options = {
        root: rootRef.current,
        rootMargin: "0px",
        threshold: 0.5,
      };
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("intersecting");
          setPaging((prevPagination) => {
            return { ...prevPagination, page: prevPagination.page + 1 };
          });
        }
      }, options);
      if (node) {
        observer.current.observe(node);
      }
    },
    [addVisible, hasMore, loading, order, setPaging]
  );
  return { rootRef, lastItemRef };
};

export default useIntersection;
