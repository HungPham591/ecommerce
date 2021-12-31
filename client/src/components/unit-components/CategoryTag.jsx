import { Tag } from "antd";
import categoryColorMap from "helpers/categoryColorMap";
import React from "react";

const CategoryTag = ({name}) => {
  return (
    <Tag color={categoryColorMap(name)} style={{ color: "black" }}>
      {name}
    </Tag>
  );
};

export default CategoryTag;
