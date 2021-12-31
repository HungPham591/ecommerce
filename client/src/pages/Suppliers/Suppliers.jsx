import { message, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import ListWithSelection from "components/ListWithSelection";
import LoadingScreen from "components/LoadingScreen";
import { useState } from "react";
import errorNotification from "helpers/errorNotification";
import clientAxios from "services/axios/clientAxios";
import SupplierModal from "./SupplierModal/SupplierModal";
import CustomAvatar from "components/unit-components/CustomAvatar";
import PhoneTag from "components/unit-components/PhoneTag";
import Paragraph from "antd/lib/typography/Paragraph";
import EditAndDeleteActions from "components/unit-components/EditAndDeleteActions";

const rootLink = 'suppliers';

function Suppliers() {
  const [records, reloadRecords, loading, error] = useListItem(rootLink);
  const [recordId, setRecordId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      dataIndex: "info",
      width: 200,
      render: (_, record) => (
        <Space>
          <CustomAvatar src={record.avatar} />
          <div>
            <Text strong>{record.name}</Text>
            <div>{record.phone && <PhoneTag phone={record.phone}/>}</div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
      // render: (email) => <EmailTag email={email}/>,
      render: (email) => <Text strong>{email}</Text>,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 300,
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
      title: "Description",
      dataIndex: "description",
      width: 300,
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
    try {
      const { data } = await clientAxios.put(`/${rootLink}/${recordId}`, {
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
      await clientAxios.post(`/${rootLink}`, { ...formData });

      message.success("Added successfully");

      reloadRecords();
      setIsModalVisible(false);
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      const { data } = await clientAxios.delete(`/${rootLink}/${id}`);

      message.success(data.message);
      reloadRecords();
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleDeleteRows = async (keys) => {
    console.log(keys);
    try {
      const { data } = await clientAxios.patch(`/${rootLink}/multi-delete`, {
        ids: [...keys],
      });

      message.success(data.message);
      reloadRecords();
    } catch (err) {
      errorNotification(err);
    }
  };

  if (error) return <ErrorHandler error={error} />;

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title level={1} code>Suppliers</Title>
      <ListWithSelection
        dataList={records}
        columns={columns}
        keyProp={"id"}
        handleDeleteRows={handleDeleteRows}
        recordName="supplier"
        onAddNew={onAddNew}
        filterField='name'
      />
      <SupplierModal
        initData={recordId ? records.find((b) => b.id === recordId) : null}
        visible={isModalVisible}
        onCancel={onCancel}
        handleOk={handleAddOrEdit}
        recordName="supplier"
      />
    </>
  );
}

export default Suppliers