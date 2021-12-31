import { useState } from "react";
import {
  Space,
  Typography,
  message,
} from "antd";
import useListItem from "components/hooks/useListItem";
import ListWithSelection from "components/ListWithSelection";
import LoadingScreen from "components/LoadingScreen";
import ErrorHandler from "components/ErrorHandler";
import BrandModal from "./BrandModal/BrandModal";
import clientAxios from "services/axios/clientAxios";
import errorNotification from "helpers/errorNotification";
import CustomAvatar from "components/unit-components/CustomAvatar";
import EditAndDeleteActions from "components/unit-components/EditAndDeleteActions";
import { getFilter } from "helpers/logicFunctions";

const { Text, Paragraph, Title } = Typography;

function Brands() {
  const [brands, reloadBrands, loading, error] = useListItem("brands");
  const [brandId, setBrandId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onAddNew = () => {
    setBrandId(null);
    setIsModalVisible(true);
  };

  const onEdit = (id) => {
    setBrandId(id);
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setBrandId(null);
    setIsModalVisible(false);
  };

  const handleAddOrEdit = (formData) => {
    // return console.log(formData);
    if (brandId == null) handleAddNew(formData);
    else handleEdit(formData);
  };

  const handleEdit = async (formData) => {
    try {
      const { data } = await clientAxios.put(`/brands/${brandId}`, {
        ...formData,
      });

      message.success(data.message);

      reloadBrands();
      setBrandId(null);
      setIsModalVisible(false);
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleAddNew = async (formData) => {
    try {
      await clientAxios.post("/brands", { ...formData });

      message.success("Added successfully");

      reloadBrands();
      setIsModalVisible(false);
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      const { data } = await clientAxios.delete(`/brands/${id}`);

      message.success(data.message);
      reloadBrands();
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleDeleteRows = async (keys) => {
    console.log(keys);
    try {
      const { data } = await clientAxios.patch(`/brands/multi-delete`, {
        ids: [...keys],
      });

      message.success(data.message);
      reloadBrands();
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
      title: "Name",
      dataIndex: "name",
      width: 150,
      render: (name, record) => (
        <Space>
          <CustomAvatar src={record.avatar} />
          <div>
            <Text strong>{name}</Text>
            <Text>{record.founded_year && ` (${record.founded_year})`}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 200,
      render: (desc) => (
        <Paragraph
          ellipsis={{ rows: 2, expandable: true }}
          style={{ maxWidth: 500 }}
        >
          {desc}
        </Paragraph>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      width: 100,
      render: (country) => <Text strong>{country}</Text>,
      ...getFilter(brands, ['country'])
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

  if (error) return <ErrorHandler error={error} />;

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title level={1} code>
        Brands
      </Title>
      <ListWithSelection
        dataList={brands}
        columns={columns}
        keyProp={"id"}
        handleDeleteRows={handleDeleteRows}
        recordName="brand"
        onAddNew={onAddNew}
        filterField="name"
      />
      <BrandModal
        initData={brandId ? brands.find((b) => b.id === brandId) : null}
        visible={isModalVisible}
        onCancel={onCancel}
        handleOk={handleAddOrEdit}
        recordName="brand"
      />
    </>
  );
}

export default Brands;
