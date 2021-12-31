import {
  SettingOutlined,
  FundOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  ImportOutlined
} from "@ant-design/icons";

const sidebarArr = [
  {
    id: "main",
    displayName: "Main",
    icon: <HomeOutlined />,
    links: [
      {
        id: "home",
        to: "/",
        displayName: "Home",
      },
      {
        id: "shopping",
        to: "/shopping",
        displayName: "Shopping",
      },
    ],
  },
  {
    id: "human",
    displayName: "Human",
    icon: <SettingOutlined />,
    forSA: true,
    links: [
      {
        id: "role",
        to: "/role",
        displayName: "Role",
        forSA: true,
      },
      {
        id: "user",
        to: "/user",
        displayName: "User",
        forSA: true,
      },  
    ],
  },
  {
    id: "shop",
    displayName: "Shop",
    icon: <UnorderedListOutlined />,
    links: [
      {
        id: "product",
        to: "/product",
        displayName: "Product",
      }, 
      {
        id: "brand",
        to: "/brand",
        displayName: "Brand",
      },
      {
        id: "category",
        to: "/category",
        displayName: "Category",
      },     
      {
        id: "city",
        to: "/city",
        displayName: "Delivery City",
      },
      {
        id: "order",
        to: "/order",
        displayName: "Customer Order",
      },
    ],
  },
  {
    id: "import",
    displayName: "Import",
    icon: <ImportOutlined />,
    links: [
      {
        id: "supplier",
        to: "/supplier",
        displayName: "Supplier",
      },
      {
        id: "buy",
        to: "/buy",
        displayName: "Import Order",
      },
    ],
  },
  {
    id: "statistical",
    displayName: "Statistic",
    icon: <FundOutlined />,
    forSA: true,
    links: [
      {
        id: "statistic",
        to: "/statistic",
        displayName: "Statistic",
        forSA: true,
      },
    ],
  },
];

const sidebarGenerator = () => {
  return sidebarArr;
};

export default sidebarGenerator;
