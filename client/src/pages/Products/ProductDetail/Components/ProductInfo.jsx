import { Button, Divider, Rate, Select, Statistic } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ProductPrice from "components/shopping-components/ProductPrice";
import CustomAvatar from "components/unit-components/CustomAvatar";
import React, { useState } from "react";
import { HashLink } from "react-router-hash-link";

const ProductInfo = ({ product, rating, onAddCart }) => {
  const { name, category, description, price, brand } = product;
  const [quantity, setQuantity] = useState(1);

  const onlyLeft = product && product.quantity != -1 && product.quantity < 10;
  const outOfStock = product.quantity === 0;

  return product ? (
    <div>
      <Title level={3}>{name}</Title>
      {rating.value && (
        <>
          <Rate
            style={{ color: "gold", marginRight: 8 }}
            disabled
            value={rating.value}
            allowHalf
          />
          <HashLink to={`?id=${product.id}#review`}>
            <Text strong>
              ({rating.value?.toFixed?.(1)}) - {rating.num} reviews
            </Text>
          </HashLink>
        </>
      )}
      <Divider />
      <ProductPrice price={price} />

      {/* <Paragraph  strong>{description}</Paragraph> */}
      <Divider />
      <Text strong style={{ marginRight: 8 }}>
        {outOfStock ? (
          <Text type="danger">Out of Stock</Text>
        ) : (
          <>
            Quantity:{" "}
            {onlyLeft && (
              <Text type="danger">(Only {product.quantity} left)</Text>
            )}
          </>
        )}
      </Text>
      {outOfStock || (
        <>
          <Select
            style={{ width: 80, marginRight: 16 }}
            value={quantity}
            onChange={(e) => setQuantity(e)}
          >
            {[...Array(onlyLeft ? product.quantity : 10)].map((_, ind) => (
              <Select.Option key={ind} value={ind + 1}>
                {ind + 1}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            shape="round"
            style={{ margin: "16px 0px" }}
            onClick={() => onAddCart(quantity)}
          >
            Add to cart
          </Button>
        </>
      )}

      <Divider />
      <div
        className="description-product"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <Divider />
      <div>
        <Statistic title="Category" value={category.title} />

        <Statistic
          title="Brand"
          value={brand.name}
          suffix={brand.avatar && <CustomAvatar size={24} src={brand.avatar} />}
        />

        <Statistic title="Origin" value={brand.country || " "} />
      </div>
    </div>
  ) : null;
};

export default ProductInfo;
