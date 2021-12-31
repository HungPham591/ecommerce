import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";

const headerLinks = [
  {
    id: "cart",
    to: "/cart",
    displayName: (
      <Badge count={5} overflowCount={10} size="small" showZero>
        <ShoppingCartOutlined />
      </Badge>
    ),
    className: "cart-icon",
  },
  // {
  //   id: "home",
  //   to: "/",
  //   displayName: "Home",
  // },
  // {
  //   id: "product",
  //   to: "/product",
  //   displayName: "Product",
  // },
  // {
  //   id: "new",
  //   to: "/new",
  //   displayName: "New",
  // },
];

export default headerLinks;
