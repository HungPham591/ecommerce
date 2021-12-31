import { Button, Divider, Drawer, Radio, Rate, Space } from "antd";
import useListItem from "components/hooks/useListItem";
import React from "react";
import { ClearOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const priceFilters = [
  { label: "$25 to $50", value: "25|50" },
  { label: "$50 to $100", value: "50|100" },
  { label: "$100 to $200", value: "100|200" },
  { label: "$200 to $300", value: "200|300" },
  { label: "$300 to $400", value: "300|400" },
  { label: "$400 to $500", value: "400|500" },
  { label: "$500+", value: "500|9999" },
];

const ratingFilters = [0, 1, 2, 3, 4];

const ProductFilter = ({
  visible,
  onClose,
  brand,
  setBrand,
  price,
  setPrice,
  onClear,
  rating,
  setRating,
  cateName,
  search,
}) => {
  const [brands, reloadBrands] = useListItem("brands");

  return (
    <Drawer
      title="Filter"
      placement={"left"}
      onClose={onClose}
      visible={visible}
      width={250}
    >
      <Button
        type="primary"
        shape="round"
        block
        icon={<ClearOutlined />}
        onClick={onClear}
      >
        Clear filter
      </Button>
      <Divider orientation="right">By Brand</Divider>
      <Radio.Group onChange={(e) => setBrand(e.target.value)} value={brand}>
        <Space direction="vertical">
          <Link to={`/shopping?type=${cateName || ""}&brand=${"All"}&search=${search}`}>
            <Radio key={"all"} style={{ fontWeight: 500 }} value={""}>
              All
            </Radio>
          </Link>
          {brands.map((b) => (
            <Link key={b.name} to={`/shopping?type=${cateName || ""}&brand=${b.name}&search=${search}`}>
              <Radio key={b.name} style={{ fontWeight: 500 }} value={b.name}>
                {b.name}
              </Radio>
            </Link>
          ))}
        </Space>
      </Radio.Group>
      <Divider orientation="right">By Price</Divider>
      <Radio.Group onChange={(e) => setPrice(e.target.value)} value={price}>
        <Space direction="vertical">
          <Radio key={"all"} style={{ fontWeight: 500 }} value={"0|9999"}>
            All
          </Radio>
          {priceFilters.map((b) => (
            <Radio key={b.value} style={{ fontWeight: 500 }} value={b.value}>
              {b.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <Divider orientation="right">By Rating</Divider>
      <Radio.Group onChange={(e) => setRating(e.target.value)} value={rating}>
        <Space direction="vertical">
          {ratingFilters.map((b) => (
            <Radio key={b} style={{ fontWeight: 500 }} value={b}>
              <Rate disabled defaultValue={b} style={{ fontSize: "0.8rem" }} />{" "}
              & UP
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </Drawer>
  );
};

export default ProductFilter;
