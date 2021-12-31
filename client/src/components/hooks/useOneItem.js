import { useState, useEffect } from "react";
import clientAxios from "services/axios/clientAxios";

export default function useOneItem(url, option = {}) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadItem = () => {
    const loadData = async () => {
      try {
        const { data } = await clientAxios.get(url);
        const record = data.data;

        setItem(record);
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
    reloadItem();
  }, [url]);

  return [item, reloadItem, loading, error];
}