import {
  Button,
  Checkbox,
  InputNumber,
  message,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import ListWithSelection from "components/ListWithSelection";
import LoadingScreen from "components/LoadingScreen";
import CustomAvatar from "components/unit-components/CustomAvatar";
import { useEffect, useState } from "react";
import ProductModal from "./ProductModal/ProductModal";
import errorNotification from "helpers/errorNotification";
import clientAxios from "services/axios/clientAxios";
import useQuery from "components/hooks/useQuery";
import EditAndDeleteActions from "components/unit-components/EditAndDeleteActions";
import CategoryTag from "components/unit-components/CategoryTag";
import { Link } from "react-router-dom";
import { getFilter } from "helpers/logicFunctions";

const rootLink = "products";

const isHide = (product) => {
  return product.public_for_sale == false;
};

const isOutOfTime = (product) => {
  const nowDate = new Date();
  if (product.starts_at != null && new Date(product.starts_at) > nowDate)
    return true;
  else if (product.ends_at != null && new Date(product.ends_at) < nowDate)
    return true;
  return false;
};

function ProductList() {
  const [records, reloadRecords, loading, error] = useListItem("products", {
    sortBy: "name",
  });
  const [recordId, setRecordId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showHide, setShowHide] = useState(false);
  const [showOutOfTime, setOutOfTime] = useState(false);
  const query = useQuery();

  useEffect(() => {
    const id = query.get("id");
    reloadRecords(!!id ? { filter: (a) => a.id == id } : {});
  }, [query]);

  let recordsShow;
  if (showHide && showOutOfTime) {
    recordsShow = records.filter((r) => isHide(r) || isOutOfTime(r));
  } else if (showHide) {
    recordsShow = records.filter((r) => isHide(r));
  } else if (showOutOfTime) {
    recordsShow = records.filter((r) => isOutOfTime(r));
  } else {
    recordsShow = records.filter((r) => !isHide(r) && !isOutOfTime(r));
  }

  const [numAdd, setNumAdd] = useState(null);
  const [idAddNum, setIdAddNum] = useState(0);

  const addQuantity = async () => {
    if (numAdd === null) return;
    try {
      const plus = Math.floor(numAdd);
      const {data} = await clientAxios.put(`products/${idAddNum}/plus`, {plus});

      setNumAdd(null);
      setIdAddNum(0);
      message.success(data.message);
      reloadRecords();
    }catch (err) {
      errorNotification(err);
    }
  };

  const handleChangeProductAvatar = async (imgId, productId) => {
    try {
      await clientAxios.put(`products/${productId}/avatar`, {avatarId: imgId});

      reloadRecords();
    }
    catch (err) {
      errorNotification(err);
    }
  }

  const columns = [
    {
      title: "Id",
      width: 75,
      dataIndex: "id",
      align: "center",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Product",
      dataIndex: "product",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical">
          {!isHide(record) && !isOutOfTime(record) ? (
            <Link to={`/shopping/detail?id=${record.id}`}>
              <Text style={{ fontSize: "1.2em", color: "#003a70" }}>
                {record.name}
              </Text>
            </Link>
          ) : (
            <Link to={`/shopping/detail?id=${record.id}`}>
              <Text type="danger">
                {record.name}{" "}
                {isHide(record) && <Tag color="#FF2D07">Hiden</Tag>}{" "}
                {isOutOfTime(record) && <Tag color="#07CF00">Out of Time</Tag>}
              </Text>
            </Link>
          )}
          <div>
            {record.productImages.sort((a, b) => b.priority - a.priority).map((img) => {
              return (
                <CustomAvatar
                  key={img.id}
                  src={img.src}
                  type="image"
                  size={42}                 
                />
              );
            })}
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Price($)",
      dataIndex: "price",
      width: 100,
      render: (price) => <Text strong>{price}</Text>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 150,
      align: "right",
      render: (quantity, record) => (
        <Text strong>
          {quantity == -1 ? (
            "non-statistical data"
          ) : (
            <div>
              {quantity}
              <br />
              <Tooltip
                title={`Enter the quantity you want to add (negative value if subtracting) | max: 1000 | min: -100`}
              >
                <InputNumber
                  style={{ width: 100 }}
                  value={idAddNum === record.id ? numAdd : null}
                  onClick={() => setIdAddNum(record.id)}
                  min="-100"
                  max="1000"
                  step="1"
                  onChange={(value) => setNumAdd(value)}
                />
              </Tooltip>
              <br />
              <Button
                style={{ width: 100 }}
                disabled={idAddNum !== record.id}
                icon={<PlusOutlined />}
                onClick={addQuantity}
              >
                Add
              </Button>
            </div>
          )}
        </Text>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 150,
      render: (_, record) => <CategoryTag name={record.category.title} />,
      sorter: (a, b) => a.category.title.localeCompare(b.category.title),
      ...getFilter(records, ['category', 'title']),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      width: 150,
      render: (_, record) => <Text strong>{record.brand.name}</Text>,
      sorter: (a, b) => a.brand?.name.localeCompare(b.brand?.name),
      ...getFilter(records, ['brand', 'name']),
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
          <div dangerouslySetInnerHTML={{__html: desc}}></div>
        </Paragraph>
      ),
    },
    {
      title: "Starts at",
      dataIndex: "starts_at",
      width: 100,
      render: (time) => {
        if (!time) return null;
        const date = new Date(time);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}h${date.getMinutes()}`;
      },
      sorter: (a, b) => a.starts_at?.localeCompare(b.starts_at),
    },
    {
      title: "Ends at",
      dataIndex: "ends_at",
      width: 100,
      render: (time) => {
        if (!time) return null;
        const date = new Date(time);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}h${date.getMinutes()}`;
      },
      sorter: (a, b) => a.ends_at?.localeCompare(b.ends_at),
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

  const removeImage = async (imageId) => {
    try {
      await clientAxios.put(`/${rootLink}/delete-image/${imageId}`);
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
        Products
      </Title>
      <ListWithSelection
        dataList={recordsShow}
        columns={columns}
        keyProp={"id"}
        handleDeleteRows={handleDeleteRows}
        recordName="product"
        onAddNew={onAddNew}
        filterField="name"
        extraHeader={
          <>
            <Checkbox
              checked={showHide}
              onChange={(e) => setShowHide(e.target.checked)}
            >
              Only Hide
            </Checkbox>
            <Checkbox
              checked={showOutOfTime}
              onChange={(e) => setOutOfTime(e.target.checked)}
            >
              Only Out of Time
            </Checkbox>
          </>
        }
      />
      <ProductModal
        initData={recordId ? records.find((b) => b.id === recordId) : null}
        visible={isModalVisible}
        onCancel={onCancel}
        handleOk={handleAddOrEdit}
        recordName="product"
        removeImage={removeImage}
        changeAvatar={handleChangeProductAvatar}
      />
    </>
  );
}

export default ProductList;
