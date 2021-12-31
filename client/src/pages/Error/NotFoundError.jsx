import { Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { Link } from "react-router-dom";

export default function NotFoundError() {
  return (
    <Space direction="vertical">
      <div>
        <Title level={2}>Sorry! The page you are looking for could not be found.</Title>
      </div>
      <Space>
        <Button
          onClick={() => window.history.back()}
          icon={<ArrowLeftOutlined />}
          type="primary"
        >
          Back
        </Button>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </Space>
    </Space>
  );
}
