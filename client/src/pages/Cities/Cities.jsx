import { message } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import ListWithSelection from "components/ListWithSelection";
import LoadingScreen from "components/LoadingScreen";
import {  useState } from "react";
import errorNotification from "helpers/errorNotification";
import clientAxios from "services/axios/clientAxios";
import CityModal from "./CityModal/CityModal";
import EditAndDeleteActions from "components/unit-components/EditAndDeleteActions";

const rootLink = 'cities';

function Cities() {
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
      title: "Name",
      dataIndex: "name",
      width: 150,
      render: (name) => (
        <Text strong>{name}</Text>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Shipping fee ($)",
      dataIndex: "shipping",
      sorter: (a, b) => a.shipping - b.shipping,
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
      <Title level={1} code>Cities</Title>
      <ListWithSelection
        dataList={records}
        columns={columns}
        keyProp={"id"}
        handleDeleteRows={handleDeleteRows}
        recordName="city"
        onAddNew={onAddNew}
        filterField='name'
      />
      <CityModal
        initData={recordId ? records.find((b) => b.id === recordId) : null}
        visible={isModalVisible}
        onCancel={onCancel}
        handleOk={handleAddOrEdit}
        recordName="city"
      />
    </>
  );
}

export default Cities