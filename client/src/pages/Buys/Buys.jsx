import { message, Tag, Button, Checkbox } from "antd";
import { AppstoreAddOutlined, DeleteOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import ListWithSelection from "components/ListWithSelection";
import LoadingScreen from "components/LoadingScreen";
import { useContext, useRef, useState } from "react";
import errorNotification from "helpers/errorNotification";
import clientAxios from "services/axios/clientAxios";
import BuyModal from "./BuyModal/BuyModal";
import EditAndDeleteActions from "components/unit-components/EditAndDeleteActions";
import CategoryTag from "components/unit-components/CategoryTag";
import Paragraph from "antd/lib/typography/Paragraph";
import { AppContext } from "utilities/app";
import BuyItemModal from "./BuyItemModal/BuyItemModal";
import { getFilter } from "helpers/logicFunctions";
import { Link } from "react-router-dom";

const rootLink = "buys";

function Buys() {
  const [records, reloadRecords, loading, error] = useListItem(rootLink, {
    sortBy: (a, b) => b.created_at.localeCompare(a.created_at),
  });
  const [recordId, setRecordId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categories, reloadCategories] = useListItem("categories");
  const [onlyMine, setOnlyMine] = useState(false);

  const { state } = useContext(AppContext);

  const columns = [
    {
      title: "Id",
      width: 75,
      dataIndex: "id",
      align: "center",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      width: 150,
      render: (_, record) => <Text strong>{record.supplier.name}</Text>,
      sorter: (a, b) => a.supplier.name.localeCompare(b.supplier.name),
      ...getFilter(records, ["supplier", "name"]),
    },
    {
      title: "Manager",
      dataIndex: "user",
      width: 150,
      render: (_, record) => {
        const isYour = state.user.username === record.user.username;
        return (
          <Link to={`/user?id=${record.user.id}`}>
            <Text strong type={isYour ? "success" : "secondary"}>
              {record.user.first_name} {record.user.last_name}
              {isYour && " (yourself)"}
            </Text>
          </Link>
        );
      },
      sorter: (a, b) =>
        (a.user.first_name + a.user.last_name).localeCompare(
          b.user.first_name + b.user.last_name
        ),
      ...getFilter(records, ["user", "username"]),
    },
    {
      title: "Product items",
      dataIndex: "products",
      width: 300,
      render: (_, record) => {
        const isYour = state.user.username === record.user.username;
        let sumPrice = 0;
        return (
          <>
            {record.buy_items.map((item) => {
              sumPrice += item.price * item.quantity;
              return (
                <div
                  key={item.id}
                  style={{
                    position: "relative",
                    display: "flex",
                    boxShadow: "3px -3px 5px #aaa",
                    borderRadius: 8,
                    alignItems: "flex-start",
                    padding: 8,
                  }}
                >
                  {categories.length > 0 && (
                    <CategoryTag
                      name={
                        categories.find(
                          (cate) => cate.id === item.product.category_id
                        ).title
                      }
                    />
                  )}
                  <Tag color="geekblue">{`${item.quantity}`}</Tag>
                  <Tag color="gold">{`${item.price}$`}</Tag>
                  <Link to={`/shopping/detail?id=${item.product.id}`}>
                    <Text strong>{item.product.name}</Text>
                  </Link>
                  {isYour && (
                    <Button
                      danger
                      size="small"
                      shape="circle"
                      type="primary"
                      icon={<DeleteOutlined />}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        marginRight: -8,
                        marginTop: -8,
                      }}
                      onClick={() => handleDeleteBuyItem(item.id)}
                    />
                  )}
                </div>
              );
            })}
            <Text>
              Sum: <Text strong>{sumPrice.toFixed(2)}$</Text>
            </Text>
            {isYour && (
              <Button
                type="primary"
                style={{ marginTop: 8, float: "right" }}
                size="small"
                icon={<AppstoreAddOutlined />}
                onClick={() => onAddNewBuyItem(record.id)}
                shape="round"
              >
                More Orders
              </Button>
            )}
          </>
        );
      },
      sorter: (a, b) => a.record.buy_items.length - b.record.buy_items.length,
    },
    {
      title: "Create at",
      dataIndex: "created_at",
      width: 100,
      render: (time) => {
        const date = new Date(time);
        return `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}h${date.getMinutes()}`;
      },
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 200,
      responsive: ["lg"],
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

  const handleDeleteBuyItem = async (buyItemId) => {
    try {
      await clientAxios.put(`${rootLink}/remove-buy-item/${buyItemId}`);
      reloadRecords();
    } catch (err) {
      errorNotification(err);
    }
  };

  const [showBuyItemModal, setShowBuyItemModal] = useState(false);
  const currentBuyId = useRef(null);

  const onAddNewBuyItem = (buyId) => {
    currentBuyId.current = buyId;
    setShowBuyItemModal(true);
  };

  const handleAddNewBuyItem = async (formData) => {
    try {
      await clientAxios.post(`/${rootLink}/${currentBuyId.current}`, {
        ...formData,
      });

      message.success("Added successfully");

      reloadRecords();
      setShowBuyItemModal(false);
    } catch (err) {
      errorNotification(err);
    }
  };

  const onCancelBuyItem = () => {
    setShowBuyItemModal(false);
  };

  if (error) return <ErrorHandler error={error} />;

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <Title level={1} code>
        Import Orders
      </Title>
      <ListWithSelection
        dataList={
          onlyMine
            ? records.filter((r) => r.user.username === state.user.username)
            : records
        }
        columns={columns}
        keyProp={"id"}
        handleDeleteRows={handleDeleteRows}
        recordName="import order"
        onAddNew={onAddNew}
        // filterField="name"
        extraHeader={
          <Checkbox
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
          >
            Only Mine
          </Checkbox>
        }
      />
      <BuyModal
        initData={recordId ? records.find((b) => b.id === recordId) : null}
        visible={isModalVisible}
        onCancel={onCancel}
        handleOk={handleAddOrEdit}
        recordName="import order"
      />
      <BuyItemModal
        initData={null}
        visible={showBuyItemModal}
        onCancel={onCancelBuyItem}
        handleOk={handleAddNewBuyItem}
        recordName="buy item"
      />
    </>
  );
}

export default Buys;
