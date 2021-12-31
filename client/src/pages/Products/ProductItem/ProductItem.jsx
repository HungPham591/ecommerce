import { Card, Button, Space, Tooltip, Rate } from "antd";
import Text from "antd/lib/typography/Text";
import imageFactory from "assets/images/image-factory";
import ProductTitle from "components/shopping-components/ProductTitle";
import CategoryTag from "components/unit-components/CategoryTag";
import getMainSrc from "helpers/getMainSrc";
import { Link, useHistory } from "react-router-dom";

const { Meta } = Card;

function ProductItem({ product }) {
  const routerHistory = useHistory();
  const {
    productImages,
    category,
    brand,
    name,
    price,
    id,
    reviews,
    sumQuantity,
  } = product;

  const subprice = Math.floor((price * 100) % 100);
  const mainprice = Math.floor(price);

  const rating =
    reviews.length > 0
      ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
      : null;

  return (
    <Card
      className="product-item"
      style={{ height: "100%" }}
      cover={
        <img
          className="horver_cursor"
          alt="example"
          src={
            getMainSrc(
              productImages.sort((a, b) => b.priority - a.priority)[0]?.src
            ) || imageFactory()
          }
          onClick={() => routerHistory.push(`/shopping/detail?id=${id}`)}
        />
      }
    >
      <Space>
        <Link to={`shopping/detail?id=${id}`} style={{ display: "block" }}>
          <span className="price">
            <span className="sub-text">$</span>
            {mainprice}
            {subprice !== 0 && (
              <span className="sub-text" style={{ fontWeight: 400 }}>
                .{subprice}
              </span>
            )}
          </span>
        </Link>
        <Link
          to={`shopping?type=${category.title}`}
          style={{ display: "block" }}
        >
          <CategoryTag name={category.title} />
        </Link>
      </Space>
      <Link to={`shopping/detail?id=${id}`}>
        <Tooltip title={name}>
          <Meta title={name} />
        </Tooltip>
        {rating ? (
          <Rate
            disabled
            style={{ fontSize: "0.8rem", marginRight: 8 }}
            value={rating}
            allowHalf
          />
        ) : (
          <br />
        )}
        {rating && (
          <Text>{`${reviews.length} reviews`}</Text>
        )}
        {sumQuantity ? <Text>{` (${sumQuantity} sold)`}</Text> : ""}
      </Link>
      <Link
        style={{ marginTop: 16, display: "block" }}
        to={`shopping?brand=${brand.name}`}
      >
        <Text type="secondary">{brand.name.capitalize()}</Text>
      </Link>
      <Link to={`shopping/detail?id=${id}`}>
        <Button block>View Item</Button>
      </Link>
    </Card>
  );
}

export default ProductItem;
