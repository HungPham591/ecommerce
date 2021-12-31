import { Checkbox, message, Space, Tag } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import ListWithSelection from "components/ListWithSelection";
import LoadingScreen from "components/LoadingScreen";
import CustomAvatar from "components/unit-components/CustomAvatar";
import { useEffect, useState } from "react";
import UserModal from "./UserModal/UserModal";
import PhoneTag from "components/unit-components/PhoneTag";
import RoleTag from "components/unit-components/RoleTag";
import errorNotification from "helpers/errorNotification";
import clientAxios from "services/axios/clientAxios";
import useQuery from "components/hooks/useQuery";
import EditAndDeleteActions from "components/unit-components/EditAndDeleteActions";
import dangerDeleteComfirm from "helpers/dangerDeleteConfirm";
import { getFilter } from "helpers/logicFunctions";

const warningDeleteText = `You are performing account deletion, this is not recommended, use an account lock instead.
Note: you cannot delete an account if it is associated with any card, review or order.`;

function UserList() {
  const [records, reloadRecords, loading, error] = useListItem("users", {
    sortBy: "first_name",
  });
  const [recordId, setRecordId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDisableShow, setIsDisableShow] = useState(false);
  const query = useQuery();

  useEffect(() => {
    const id = query.get("id");
    reloadRecords(!!id ? { filter: (a) => a.id == id } : {});
  }, [query]);

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
      dataIndex: "first_name",
      width: 200,
      render: (_, record) => (
        <Space>
          <CustomAvatar src={record.avatar} />
          <div>
            <Text strong>
              {record.first_name} {record.last_name}
            </Text>
            {!!record.disabled && <Tag color='#FF0000'>Disabled</Tag>}
            <div>{record.phone && <PhoneTag phone={record.phone} />}</div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 100,
      render: (_, record) => <RoleTag role={record.role} />,
      sorter: (a, b) => b.role.id - a.role.id,
      ...getFilter(records, ['role', 'name'])
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
      render: (email) => <Text strong>{email}</Text>,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 200,
      render: (addr) => (
        <Paragraph
          ellipsis={{ rows: 2, expandable: true }}
          style={{ maxWidth: 500 }}
        >
          {addr}
        </Paragraph>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => {
        return (
          <EditAndDeleteActions
            onEdit={() => onEdit(record.id)}
            onDelete={() => handleDeleteRow(record.id)}
          />
        );
      },
    },
  ];

  const onAddNew = () => {
    setRecordId(null);
    setIsModalVisible(true);
  };

  const onEdit = (id) => {
    setRecordId(id);
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setRecordId(null);
    setIsModalVisible(false);
  };

  const handleAddOrEdit = (formData) => {
    if (recordId == null) handleAddNew(formData);
    else handleEdit(formData);
  };

  const handleEdit = async (formData) => {
    console.log('data', formData)
    try {
      const { data } = await clientAxios.put(`/users/${recordId}`, {
        ...formData,
      });

      message.success(data.message);

      reloadRecords();
      setRecordId(null);
      setIsModalVisible(false);
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleAddNew = async (formData) => {
    try {
      await clientAxios.post("/users", { ...formData });

      message.success("Added successfully");

      reloadRecords();
      setIsModalVisible(false);
    } catch (err) {
      errorNotification(err);
    }
  };
  const handleDeleteRow = (id) => {
    dangerDeleteComfirm({
      title: warningDeleteText,
      onOk: () => deleteRow(id),
    });
  };

  const deleteRow = async (id) => {
    try {
      const { data } = await clientAxios.delete(`/users/${id}`);

      message.success(data.message);
      reloadRecords();
    } catch (err) {
      message.error(`Account cannot be deleted because it is linked to cart, review or order.`);
      console.log(err.response);
    }
  };

  const handleDeleteRows = (keys) => {
    dangerDeleteComfirm({
      title: warningDeleteText,
      onOk: () => deleteRows(keys),
    });
  }

  const deleteRows = async (keys) => {
    try {
      const { data } = await clientAxios.patch(`/users/multi-delete`, {
        ids: [...keys],
      });

      message.success(data.message);
      reloadRecords();
    } catch (err) {
      message.error(`Account cannot be deleted because it is linked to cart, review or order.`);
      console.log(err.response);
    }
  };

  if (error) return <ErrorHandler error={error} />;

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title level={1} code>
        Users
      </Title>
      <ListWithSelection
        dataList={!isDisableShow ? records.filter(r => r.disabled == false) : records.filter(r => r.disabled == true)}
        columns={columns}
        keyProp={"id"}
        handleDeleteRows={handleDeleteRows}
        recordName="user"
        onAddNew={onAddNew}
        filterField={["first_name", "last_name"]}
        extraHeader={
          <>
            <Checkbox
              checked={isDisableShow}
              onChange={(e) => setIsDisableShow(e.target.checked)}
            >
              Show disable Users
            </Checkbox>
          </>
        }
      />
      <UserModal
        initData={recordId ? records.find((b) => b.id === recordId) : null}
        visible={isModalVisible}
        onCancel={onCancel}
        handleOk={handleAddOrEdit}
        recordName="user"
      />
    </>
  );
}

export default UserList;
