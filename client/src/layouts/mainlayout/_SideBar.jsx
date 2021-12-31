import React, { useContext, useEffect, useMemo, useState } from "react";
import { SettingFilled } from "@ant-design/icons";
import { Affix, Button, Divider, Drawer, Layout, Menu } from "antd";
import { getLinksFromPathname, getScreenSize } from "helpers/logicFunctions";
import { Link } from "react-router-dom";
import sidebarGenerator from "./configs/sidebar-links";
import { AppContext } from "utilities/app";

const { SubMenu } = Menu;
const { Sider } = Layout;

function SideBar({ pathname }) {
  const [sidebars, setSidebars] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [selecttedItemId, setSelectedItemId] = useState(null);
  const [openKeys, setOpenKeys] = useState([]);
  const [isClose, setIsClose] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const {state} = useContext(AppContext);

  useEffect(() => {
    const checkSize = () => {
      setCollapsed(window.innerWidth < getScreenSize("lg"));
      setIsClose(window.innerWidth < getScreenSize("xs"));
    };
    checkSize();

    /// Set event bat tat menu khi resize
    const rsListener = window.addEventListener("resize", checkSize);
    /// Load sidebar bat dong bo
    const loadSidebar = async () => {
      const loadedSidebar = await sidebarGenerator();

      setSidebars(loadedSidebar);
    };
    loadSidebar();

    return () => window.removeEventListener("resize", rsListener);
  }, []);

  useMemo(() => {
    /// set item duoc chon khi duong dan thay doi
    const linksFromURL = getLinksFromPathname(pathname);

    const linksFromSidebar = [];
    sidebars.map((sidebar) => {
      sidebar.links.map((link) => {
        linksFromSidebar.push(link);
      });
    });
    // loc duong dan sidebar khop voi url
    const matchLinks = linksFromSidebar.filter((link) =>
      linksFromURL.includes(link.to)
    );
    // tim duong dan gan dung nhat
    const matchLink = matchLinks.reduce(
      (a, b) => {
        return a.to.length > b.to.length ? a : b;
      },
      { id: null, to: "" }
    );
    const matchLinkId = matchLink.id;

    setSelectedItemId(matchLinkId);

    /// set menu duoc bat khi item duoc chon thay doi
    if (collapsed) {
      setOpenKeys([]);
      return;
    }

    sidebars.map((sidebar) => {
      const { links, id: sidebarId } = sidebar;
      const linkIds = links.map((link) => link.id);
      if (linkIds.includes(matchLinkId) && !openKeys.includes(sidebarId)) {
        setOpenKeys([sidebarId]);
      }
    });
  }, [pathname, sidebars, collapsed]);

  return isClose ? (
    <>
      <Button
        onClick={() => setVisibleDrawer(true)}
        icon={<SettingFilled />}
        style={{
          borderRadius: 8,
          position: "fixed",
          zIndex: 10,
          right: 16,
          marginTop: 16,
          backgroundColor: "transparent",
        }}
      />
      <Drawer
        width={80}
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        placement="left"
        closeIcon={false}
      >
        <Sider
          className="sidebar"
          collapsed={collapsed}
          onCollapse={(e) => setCollapsed(e)}
          breakpoint="lg"
          style={{ overflowY: "auto"}}
        >
          <Menu
            mode="inline"
            onSelect={() => setVisibleDrawer(false)}
            selectedKeys={selecttedItemId}
            onOpenChange={(keys) => setOpenKeys([keys[keys.length - 1]])}
            openKeys={openKeys}
            triggerSubMenuAction="click"
            style={{
              position: "fixed",
              width: 32,
              border: 0,
              overflowY: "auto",
            }}
          >
            {sidebars.length > 0 && sidebars.map((menu) => {
              return (state.user.role !== 'sa' && menu.forSA === true) ? null : (
                <SubMenu
                  key={menu.id}
                  icon={menu.icon}
                  title={menu.displayName}
                >
                  {menu.links.map((subMenu) => {
                    if (state.user.role !== 'sa' && subMenu.forSA === true) return null;
                    return (
                      <Menu.Item key={subMenu.id}>
                        <Link to={subMenu.to}>{subMenu.displayName}</Link>
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        </Sider>
      </Drawer>
    </>
  ) : (
    <Sider
      className="sidebar"
      width={200}
      collapsed={collapsed}
      onCollapse={(e) => setCollapsed(e)}
      breakpoint="lg"
      style={{ overflowY: "auto" }}
    >
      <Menu
        mode="inline"
        selectedKeys={selecttedItemId}
        onOpenChange={(keys) => setOpenKeys([keys[keys.length - 1]])}
        openKeys={openKeys}
        triggerSubMenuAction="click"
        style={{
          height: "calc(100% - 0px)",
          position: "fixed",
          maxWidth: 200,
          minWidth: 80,
          border: 0,
          overflowY: "auto",
        }}
      >
        {sidebars.map((menu) => {
          return (state.user.role !== 'sa' && menu.forSA === true) ? null : (
            <SubMenu key={menu.id} icon={menu.icon} title={menu.displayName}>
              {menu.links.map((subMenu) => {
                if (state.user.role !== 'sa' && subMenu.forSA === true) return null;
                return (
                  <Menu.Item key={subMenu.id}>
                    <Link to={subMenu.to}>{subMenu.displayName}</Link>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        })}
      </Menu>
    </Sider>
  );
}

export default SideBar;
