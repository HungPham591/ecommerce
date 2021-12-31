import { AutoComplete } from "antd";
import Search from "antd/lib/input/Search";
import errorNotification from "helpers/errorNotification";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import clientAxios from "services/axios/clientAxios";

const SearchBar = () => {
  const history = useHistory();
  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);

  const searchProducts = async () => {
    try {
      const { data } = await clientAxios.get(`/products/search?search=${text}`);

      setOptions(data.data);
    } catch (err) {
      errorNotification(err);
    }
  };

  useEffect(() => {
    searchProducts();
  }, []);

  const handleSelect = (value) => {
    const productId = options.find(op => op.name === value).id;
    history.push(`/shopping/detail?id=${productId}`);
  };

  const handleSearch = () => {
    history.push(`/shopping?search=${text}`)
  }

  return (
    <AutoComplete
      value={text}
      options={
        text
          ? options
              .filter((o) => o.name.toLowerCase().includes(text.toLowerCase()))
              .map((o) => ({ label: o.name, value: o.name }))
          : []
      }
      style={{ width: "100%", maxWidth: 500 }}
      onSelect={handleSelect}
      onChange={(e) => {
        console.log("text", e);
        setText(e);
      }}
    >
      <Search placeholder="Search for product" enterButton allowClear onSearch={handleSearch}/>
    </AutoComplete>
  );
};

export default SearchBar;
