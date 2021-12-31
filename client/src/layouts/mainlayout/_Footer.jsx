import { Layout, Space } from "antd";
import { Link } from "react-router-dom";

const { Footer } = Layout;

export default function FooterComp() {
  return (
    <Footer style={{ textAlign: "center", marginTop: 16, background: '#e9ebef' }}>
      <Space direction="vertical">
        <div>© 2021 Pixel Light. All Rights Reserved.</div>
        <Link to={`/contact`}>
          <div style={{fontSize: '1rem'}}>Contact us</div>
        </Link>
      </Space>
    </Footer>
  );
}
