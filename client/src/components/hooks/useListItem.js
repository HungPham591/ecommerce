import axios from "axios";
import { useState, useEffect } from "react";
import clientAxios from "services/axios/clientAxios";

const fakeBaseUrl = "http://localhost:3000/";

export default function useListItem(url, option = {}) {
  const [listItem, setListItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let { propsAPI, sortBy, filter } = option;

  const reloadListItem = (reloadOption = null) => {
    if (reloadOption) {
      propsAPI = reloadOption.propsAPI ?? propsAPI;
      sortBy = reloadOption.sortBy ?? sortBy;
      filter = reloadOption.filter ?? filter;
    }

    const loadData = async () => {
      try {
        const { data } = await clientAxios.get(reloadOption?.url || url);

        let records = data.data;

        if (sortBy === "No") {
        } else if (typeof sortBy === "string") {
          if (typeof records[0][sortBy] === "string") {
            records = records.sort((a, b) =>
              a[sortBy].localeCompare(b[sortBy])
            );
          } else {
            records = records.sort((a, b) => a[sortBy] - b[sortBy]);
          }
        } else if (typeof sortBy === "function") {
          records = records.sort(sortBy);
        } else {
          records = records.sort((a, b) => a["name"]?.localeCompare(b["name"]));
        }

        if (filter != null) {
          records = records.filter(filter);
        }

        if (propsAPI) records = records.map((item) => propsAPI(item));

        setListItem(records);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
        setError(err.response);
      }
    };
    loadData();
  };

  useEffect(() => {
    reloadListItem();
  }, [url]);

  return [listItem, reloadListItem, loading, error];
}
