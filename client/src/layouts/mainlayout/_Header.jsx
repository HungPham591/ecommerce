import { useContext, useEffect, useState } from "react";
import {
  Affix,
  Avatar,
  Layout,
  Menu,
  Space,
  Typography,
  Badge,
} from "antd";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getScreenSize } from "helpers/logicFunctions";
import headerLinks from "layouts/mainlayout/configs/header-links";
import MenuDrawer from "./_MenuDrawer";
import { AppContext } from "utilities/app";
import clientAxios from "services/axios/clientAxios";
import SearchBar from "./_Search";

const { Header } = Layout;
const { Paragraph } = Typography;

export default function HeaderComp({ pathname }) {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [showName, setShowName] = useState(true);

  const [cartNum, setCartNum] = useState(0);
  const { state } = useContext(AppContext);

  useEffect(() => {
    if (!state.isSignIn) {
      setCartNum(state.cartNum || 0);
    } else {
      const getCart = async () => {
        try {
          const { data } = await clientAxios.get("/cartitems");
          setCartNum(data.data.reduce((a, b) => a + b.quantity, 0));
        } catch (err) {}
      };
      getCart();
    }
  }, [state]);

  useEffect(() => {
    const setNameShowByWidth = () => {
      setShowName(window.innerWidth >= getScreenSize("sm"));
    };
    setNameShowByWidth();
    const resizeListener = window.addEventListener(
      "resize",
      setNameShowByWidth
    );

    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  const enableLinks = headerLinks.filter((link) => pathname.includes(link.to));
  const currnentMenu = enableLinks.reduce(
    (a, b) => {
      return a.to.length > b.to.length ? a : b;
    },
    { to: "", id: null }
  );

  return (
    <Affix offsetTop={0.1}>
      <Header
        className="main-header"
        style={{
          width: "100%",
          zIndex: 3,
          height: 64,
          padding: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* menu button */}
          <MenuOutlined
            style={{
              color: "white",
              fontSize: 24,
              padding: "8px 24px",
            }}
            onClick={() => setIsShowMenu(!isShowMenu)}
          />
          <MenuDrawer visible={isShowMenu} setVisible={setIsShowMenu} />

          {/* logo */}
          <Link id="logo" to="/">
            <Space style={{ height: 64, marginRight: 24 }}>
              {showName && (
                <Paragraph
                  style={{
                    fontSize: "1.5rem",
                    color: "white",
                    display: "inline",
                    whiteSpace: "nowrap",
                  }}
                >
                  Pixel Light
                </Paragraph>
              )}

              <Avatar src={process.env.REACT_APP_AVATAR_URL} />
            </Space>
          </Link>

          {/* search bar */}
          <div
            style={{
              display: "flex",
              marginRight: 16,
              flexGrow: 1,
            }}
          >
            <SearchBar />
          </div>

          {/* orther option  */}
          <Menu theme="dark" mode="horizontal" selectedKeys={[currnentMenu.id]}>
            <Menu.Item key="cart" className="cart-icon">
              <Link to="/cart">
                <Badge count={cartNum} overflowCount={10} size="small" showZero>
                  <ShoppingCartOutlined />
                </Badge>
              </Link>
            </Menu.Item>

            {/* {headerLinks.map((link) => {
              return (
                <Menu.Item key={link.id} className={link.className}>
                  <Link to={link.to}>{link.displayName}</Link>
                </Menu.Item>
              );
            })} */}
          </Menu>
        </div>
      </Header>
    </Affix>
  );
}
