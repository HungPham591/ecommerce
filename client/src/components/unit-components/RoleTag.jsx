import { Tag } from "antd";

const RoleTag = ({ role }) => {
  let background = '#fff';
  let color = '#000';
  if (role.role_code === "sa") {
    background = "#333";
    color = '#fff';
  }
  if (role.role_code === "ad") {
    background = "#bbb";
    color = '#fff';
  }
  return (
    <Tag color="#2db7f5" color={background} style={{ color: color }}>
      {role.name}
    </Tag>
  );
};
export default RoleTag;
