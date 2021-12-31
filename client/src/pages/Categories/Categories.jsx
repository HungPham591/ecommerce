import { message, Space, Tag } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import ListWithSelection from "components/ListWithSelection";
import LoadingScreen from "components/LoadingScreen";
import { useState } from "react";
import errorNotification from "helpers/errorNotification";
import clientAxios from "services/axios/clientAxios";
import CategoryModal from "./CategoryModal/CategoryModal";
import CustomAvatar from "components/unit-components/CustomAvatar";
import Paragraph from "antd/lib/typography/Paragraph";
import dangerDeleteComfirm from "helpers/dangerDeleteConfirm";
import EditAndDeleteActions from "components/unit-components/EditAndDeleteActions";

const rootLink = "categories";

function Categories() {
  const [records, reloadRecords, loading, error] = useListItem(rootLink, {
    sortBy: "title",
  });
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
      title: "Title",
      dataIndex: "title",
      width: 200,
      render: (_, record) => (
        <Space>
          <CustomAvatar src={record.avatar} type="image" />
          <Text strong>{record.title}</Text>
        </Space>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Products",
      dataIndex: "products",
      width: 100,
      render: (_, record) => {
        const num = record.products.length;
        const bg = Math.max(0, 230 * (1 - num / 10));
        return (
          <Tag color={`rgb(${bg}, ${bg}, ${bg})`} style={{ color: "white" }}>
            {num}
          </Tag>
        );
      },
      sorter: (a, b) => a.products.length - b.products.length,
    },
    {
      title: "Content",
      dataIndex: "content",
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
          <EditAndDeleteActions onEdit={() => onEdit(record.id)} onDelete={() => handleDeleteRow(record.id)}/>
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

  const deleteRow = async (id) => {
    try {
      const { data } = await clientAxios.delete(`/${rootLink}/${id}`);

      message.success(data.message);
      reloadRecords();
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleDeleteRow = async (id) => {
    const numProducts = records.find((r) => r.id === id).products.length;
    if (numProducts > 0) {
      dangerDeleteComfirm({
        title: `The category you are deleting contains ${numProducts} product(s), are you sure you want to delete it and all its products`,
        onOk: () => deleteRow(id),
      });
    } else deleteRow(id);
  };

  const handleDeleteRows = (keys) => {
    const numProducts = records
      .filter((r) => keys.includes(r.id))
      .reduce((a, b) => a + b.products.length, 0);
    if (numProducts > 0) {
      dangerDeleteComfirm({
        title: `The categories you are deleting contain ${numProducts} product(s), are you sure you want to delete them and all their products`,
        onOk: () => deleteRows(keys),
      });
    } else deleteRows(keys);
  };

  const deleteRows = async (keys) => {
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
      <Title level={1} code>
        Categories
      </Title>
      <ListWithSelection
        dataList={records}
        columns={columns}
        keyProp={"id"}
        handleDeleteRows={handleDeleteRows}
        recordName="category"
        onAddNew={onAddNew}
        filterField="title"
      />
      <CategoryModal
        initData={recordId ? records.find((b) => b.id === recordId) : null}
        visible={isModalVisible}
        onCancel={onCancel}
        handleOk={handleAddOrEdit}
        recordName="category"
      />
    </>
  );
}

export default Categories;
