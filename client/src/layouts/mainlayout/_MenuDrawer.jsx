import { Avatar, Divider, Drawer, List, Space, Typography } from "antd";
import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import useListItem from "components/hooks/useListItem";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "utilities/app";
import { useContext, useMemo } from "react";
import clientAxios from "services/axios/clientAxios";

const MenuDrawer = ({ visible, setVisible }) => {
  const [categories, reload, isLoading, error] = useListItem("categories", {
    sortBy: "title",
  });
  const { state, dispatch } = useContext(AppContext);
  const routerHistory = useHistory();

  const hiddenMenu = () => {
    setVisible(false);
  };

  const handleLogOut = async () => {
    try {
      await clientAxios.post("auth/signout");
    } catch (err) {}

    dispatch({ type: "SIGN_OUT" });
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
    routerHistory.push("/auth/signin");
  };

  const userRender = state.isSignIn ? (
    `${state.user.first_name ?? ""} ${state.user.last_name ?? ""}`
  ) : (
    <Link to="/auth/signin" onClick={hiddenMenu}>
      Sign in
    </Link>
  );

  const categoriesRender = [
    { title: "All", to: "" },
    ...categories.map((cate) => ({ title: cate.title, to: cate.title })),
  ];

  const otherRender = [{ title: "Change password", to: "/changepass" }];

  return (
    <Drawer
      title={
        <Space direction="vertical">
          <Space style={{ marginBottom: 8 }}>
            <Avatar
              icon={
                <Link to="/" onClick={hiddenMenu}>
                  <HomeOutlined style={{ color: "white" }} />
                </Link>
              }
              style={{ backgroundColor: "#666", marginRight: 8 }}
            />
            {state.isSignIn && (
              <>
                <Avatar
                  icon={<UserOutlined style={{ color: "#fff" }} />}
                  onClick={() => {routerHistory.push('/profile'); setVisible(false)}}
                  style={{marginRight: 8, backgroundColor: "#666"}}
                />
                <Avatar
                  icon={<LogoutOutlined style={{ color: "white" }} />}
                  style={{ backgroundColor: "#666" }}
                  onClick={handleLogOut}
                />
              </>
            )}
          </Space>
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Hello, {userRender}
            </Typography.Title>
          </Space>
        </Space>
      }
      placement="left"
      closable={true}
      onClose={hiddenMenu}
      visible={visible}
    >
      {error ? (
        "Failed to load categories"
      ) : (
        <List
          header={
            <Typography.Title level={4}>Shop by Category</Typography.Title>
          }
          loading={isLoading}
          dataSource={categoriesRender}
          renderItem={(cate) => (
            <List.Item>
              <Link
                to={`/shopping?type=${cate.to}`}
                onClick={hiddenMenu}
                style={{ color: "inherit" }}
              >
                {cate.title}
              </Link>
            </List.Item>
          )}
        />
      )}
      {state.isSignIn && (
        <>
          <Divider orientation="left">Other</Divider>
          <List
            dataSource={otherRender}
            renderItem={(item) => (
              <List.Item>
                <Link
                  to={item.to}
                  onClick={hiddenMenu}
                  style={{ color: "inherit" }}
                >
                  {item.title}
                </Link>
              </List.Item>
            )}
          />
        </>
      )}
    </Drawer>
  );
};

export default MenuDrawer;
