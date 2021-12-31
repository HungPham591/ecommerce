import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
function useQuery() {
  const location = useLocation();
  const [query, setQuery] = useState(new URLSearchParams(location.search));

  useEffect(() => {
    setQuery(new URLSearchParams(location.search));
  }, [location]);

  return query;
}

export default useQuery;
