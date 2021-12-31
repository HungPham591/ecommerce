import { BackTop, Layout } from "antd";
import Header from "./_Header";
import SideBar from "./_SideBar";
import Footer from "./_Footer";
import HomeRoute from "./_Content";
import BreadcrumbRoute from "./_BreadCrumb";
import useLocationListener from "components/hooks/useLocationListener";
import { AppContext } from "utilities/app";
import { useContext } from "react";

const { Content } = Layout;

function MainLayout() {
  let { pathname } = useLocationListener();

  const { state } = useContext(AppContext);
  const isSA = state.user.role === 'sa' || state.user.role === 'ad';

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header pathname={pathname} />
      <Layout className="site-layout-background">
        {isSA && <SideBar pathname={pathname} />}
        <Layout style={{ padding: "0 24px 24px" }}>
          <BreadcrumbRoute pathname={pathname} />
          <Content style={{ minHeight: 280 }}>
            <HomeRoute />
            <BackTop />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
