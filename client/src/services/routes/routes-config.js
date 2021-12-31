import { lazy } from "react";
// import { Brands, Home, Products, Roles, Users, NotFoundError } from "pages";

const Home = lazy(() => import("pages/Home/Home"));
const Order = lazy(() => import("pages/Orders/Orders"));
const Cart = lazy(() => import("pages/Cart/Cart"));
const Checkout = lazy(() => import("pages/Checkout/Checkout"));
const Brands = lazy(() => import("pages/Brands/Brands"));
const Products = lazy(() => import("pages/Products/Products"));
const Cities = lazy(() => import("pages/Cities/Cities"));
const Roles = lazy(() => import("pages/Roles/Roles"));
const Users = lazy(() => import("pages/Users/Users"));
const Suppliers = lazy(() => import("pages/Suppliers/Suppliers"));
const NotFoundError = lazy(() => import("pages/Error/NotFoundError"));
const Categories = lazy(() => import("pages/Categories/Categories"));
const ProductMgt = lazy(() => import("pages/ProductMgt/ProductList"));
const Buys = lazy(() => import("pages/Buys/Buys"));
const ProductDetail = lazy(() => import("pages/Products/ProductDetail/ProductDetail"));
const ChangePass = lazy(() => import("pages/UserInfo/ChangePass"));
const Profile = lazy(() => import("pages/UserInfo/Profile"));
const Statistic = lazy(() => import("pages/Statistics/Statistic"));
const Contact = lazy(() => import("pages/Contact/Contact"));


const routes = [
  {
    path: "/",
    name: "Home",
    exact: true,
    home: () => <Home />,
  },
  {
    path: "/shopping",
    name: "Shopping",
    exact: true,
    home: () => <Products />,
  },
  {
    path: "/statistic",
    name: "Statistic",
    exact: true,
    home: () => <Statistic />,
  },
  {
    path: "/profile",
    name: "Profile",
    exact: true,
    home: () => <Profile />,
  },
  {
    path: "/shopping/detail",
    name: "Detail",
    exact: true,
    home: () => <ProductDetail />,
  },
  {
    path: "/checkout",
    name: "Checkout",
    exact: true,
    home: () => <Checkout />,
  },
  {
    path: "/changepass",
    name: "Changepass",
    exact: true,
    home: () => <ChangePass />,
  },
  {
    path: "/order",
    name: "Order",
    exact: true,
    home: () => <Order />,
  },
  {
    path: "/new",
    name: "New",
    exact: true,
    home: () => <Products />,
  },
  {
    path: "/cart",
    name: "Cart",
    exact: true,
    home: () => <Cart />,
  },
  {
    path: "/role",
    name: "Role",
    exact: true,
    home: () => <Roles />,
  },
  {
    path: "/product",
    name: "Product",
    exact: true,
    home: () => <ProductMgt />,
  },
  {
    path: "/user",
    name: "User",
    exact: false,
    home: () => <Users />,
  },
  {
    path: "/supplier",
    name: "Supplier",
    exact: false,
    home: () => <Suppliers />,
  },
  {
    path: "/category",
    name: "Category",
    exact: false,
    home: () => <Categories />,
  },
  {
    path: "/buy",
    name: "Buy",
    exact: false,
    home: () => <Buys />,
  },
  {
    path: "/brand",
    name: "Brand",
    exact: true,
    home: () => <Brands />,
  },
  {
    path: "/city",
    name: "City",
    exact: true,
    home: () => <Cities />,
  },
  {
    name: "contact",
    path: "/contact",
    exact: true,
    home: () => <Contact />,
  },
  {
    name: "Error",
    path: "*",
    exact: false,
    home: () => <NotFoundError />,
  },
];
export default routes;
