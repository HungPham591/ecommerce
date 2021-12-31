import {
  Button,
  Card,
  Divider,
  message,
  Popconfirm,
  Space,
  Tooltip,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import ListWithSelection from "components/ListWithSelection";
import errorNotification from "helpers/errorNotification";
import { useState } from "react";
import { Link } from "react-router-dom";
import clientAxios from "services/axios/clientAxios";
import AddRoleModal from "./AddRoleModal/AddRoleModal";
import CustomAvatar from "components/unit-components/CustomAvatar";
import PhoneTag from "components/unit-components/PhoneTag";
import sortByString from "helpers/sortByString";

const RoleItem = ({ role, showUsers, setShowUsers, reloadRoles }) => {
  const [desc, setDesc] = useState(role.description);
  const [visibleModal, setVisibleModal] = useState(false);

  const onChangeDesc = async () => {
    try {
      const { data } = await clientAxios.put(`roles/${role.id}`, {
        id: role.id,
        description: desc,
      });

      message.success(data.message);
      reloadRoles();
    } catch (err) {
      errorNotification(err);
    }
  };

  const onCancelChangeDesc = () => {
    setDesc(role.description);
  };

  // ham xu ly xoa cac row, nhan ve keys -- mang id cac row
  const handleDeleteUserRoles = async (keys) => {
    try {
      const { data } = await clientAxios.put(`roles/${role.id}/users`, {
        user_ids: keys,
      });

      console.log(keys);
      message.success("Deleted");
      reloadRoles();
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleDeleteUserRole = async (key) => {
    try {
      const { data } = await clientAxios.put(`roles/${role.id}/users`, {
        user_ids: [key],
      });

      message.success("Deleted");
      reloadRoles();
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleAddUserRoles = async (ids) => {
    try {
      const { data } = await clientAxios.post(`roles/${role.id}/users`, {
        user_ids: [...ids],
      });

      message.success("Added");
      setVisibleModal(false);
      reloadRoles();
    } catch (err) {
      errorNotification(err);
    }
  };

  const columns = [
    {
      title: "Id",
      width: 75,
      dataIndex: "id",
      align: "center",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Info",
      width: 200,
      dataIndex: "first_name",
      render: (name, record) => (
        <Space>
          <CustomAvatar src={record.avatar} />
          <div>
            <Link to={`/user?id=${record.id}`}>
              <Text strong style={{ display: "block", marginBottom: 8}}>{record.first_name} {record.last_name}</Text>
            </Link>
            <Text>{record.phone && <PhoneTag phone={record.phone} />}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Email",
      width: 150,
      dataIndex: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
    },
    {
      title: "Joined",
      width: 100,
      dataIndex: "created_at",
      render: (time) => {
        const date = new Date(time);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}h${date.getMinutes()}`;
      },
      sorter: (a, b) => {
        return a.created_at.localeCompare(b.created_at);
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => {
        return (
          <Space>
            <Link to={`/user?id=${record.id}`}>Detail</Link>
            <Popconfirm
              title={`Are you sure to remove the ${role.name} role from this user?`}
              placement="bottomRight"
              onConfirm={() => handleDeleteUserRole(record.id)}
              okText="Delete"
              cancelText="No"
            >
              <Tooltip title="Remove this user role">
                <Button danger size="small" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  console.log(new Date(role.users[0]?.created_at));

  sortByString(role.users, "first_name");

  const renderUsers = showUsers && (
    <ListWithSelection
      dataList={role.users}
      columns={columns}
      onAddNew={() => setVisibleModal(true)}
      keyProp={"id"}
      handleDeleteRows={handleDeleteUserRoles}
      recordName="user role"
      additionalDeleteMess={`this will remove the ${role.name} role from these users`}
      addNewText="Add user for this role"
      rollbackWarning={false}
      filterField={['first_name', 'last_name']}
    />
  );

  return (
    <Card bordered={false} style={{ margin: "0 1px", paddingTop: 16 }}>
      {/* Info of role */}
      <Paragraph
        ellipsis={{
          rows: 1,
          expandable: true,
        }}
        editable={{
          onChange: (value) => setDesc(value),
          maxLength: 500,
          autoSize: { maxRows: 10, minRows: 2 },
        }}
      >
        {desc}
      </Paragraph>

      {/* Show button when edit */}
      {role.description !== desc && (
        <Space>
          <Button type="primary" size="small" onClick={onChangeDesc}>
            Save edit
          </Button>
          <Button type="secondrady" size="small" onClick={onCancelChangeDesc}>
            Cancel
          </Button>
        </Space>
      )}

      {/*Button toggle users*/}
      <Divider orientation="right">
        <Button onClick={() => setShowUsers(!showUsers)} type="primary" ghost>
          {showUsers ? "Hide" : "Show"} user list
        </Button>
      </Divider>
      {renderUsers}

      <AddRoleModal
        role={role}
        visible={visibleModal}
        onCancel={() => setVisibleModal(false)}
        onAdd={handleAddUserRoles}
      />
    </Card>
  );
};

export default RoleItem;
