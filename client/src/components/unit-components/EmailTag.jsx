import { Tag } from "antd";
import { MailFilled } from "@ant-design/icons";

const EmailTag = ({ email }) => {
  return (
    <Tag icon={<MailFilled />} color="success">
      {email}
    </Tag>
  );
};
export default EmailTag;
