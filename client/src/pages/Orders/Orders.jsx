import { Alert, Button, message, Popover, Select, Space, Tooltip } from "antd";
import { CheckOutlined, ZoomInOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import ListWithSelection from "components/ListWithSelection";
import LoadingScreen from "components/LoadingScreen";
import { useContext, useState } from "react";
import errorNotification from "helpers/errorNotification";
import clientAxios from "services/axios/clientAxios";
import EditAndDeleteActions from "components/unit-components/EditAndDeleteActions";
import { AppContext } from "utilities/app";
import { Link } from "react-router-dom";
import CustomAvatar from "components/unit-components/CustomAvatar";
import PhoneTag from "components/unit-components/PhoneTag";
import OrderModal from "./OrderDetail/OrderDetail";
import moment from 'moment';
import { getFilter } from "helpers/logicFunctions";

const statusMapping = {
  confirmed: "info",
  rejected: "error",
  shipping: "warning",
  success: "success",
  failed: "error",
  cancelled: "error",
};
const statuses = [
  "confirmed",
  "rejected",
  "shipping",
  "success",
  "failed",
  "cancelled",
];

const rootLink = "orders";

function Orders() {
  const [records, reloadRecords, loading, error] = useListItem(rootLink, {
    sortBy: (a, b) => b.created_at.localeCompare(a.created_at),
  });
  const [recordId, setRecordId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onChangStatus = async (orderId, newStatus) => {
    try {
      const { data } = await clientAxios.put(`/orders/${orderId}`, {
        status: newStatus,
      });

      message.success(data.message);
      reloadRecords();
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
      title: "User",
      dataIndex: "user",
      width: 150,
      render: (_, record) => (
        <Link to={`/user?id=${record.user.id}`}>
          <Space>
            <CustomAvatar src={record.user.avatar} />
            <div>
              <Text strong style={{ color: "#003a70" }}>
                {record.user.first_name} {record.user.last_name}
              </Text>
              <div>
                {record.user.phone && <PhoneTag phone={record.user.phone} />}
              </div>
            </div>
          </Space>
        </Link>
      ),
      sorter: (a, b) =>
        (a.user.first_name + a.user.last_name).localeCompare(
          b.user.first_name + b.user.last_name
        ),
    },
    {
      title: "Total($)",
      width: 100,
      dataIndex: "total",
      align: "right",
      render: (total) => <Text strong>{parseFloat(total).toFixed(2)}</Text>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Paid",
      width: 75,
      dataIndex: "paid",
      align: "right",
      render: (paid, record) =>
        paid ? (
          <Popover
            content={record.payment_id}
            title="Payment id"
            trigger="click"
          >
            <CheckOutlined />
          </Popover>
        ) : null,
      sorter: (a, b) => a.paid - b.paid,
      ...getFilter(records, ['paid']),
    },
    {
      title: "Status",
      width: 200,
      dataIndex: "status",
      align: "center",
      render: (status, record) => (
        <Select
          style={{ fontSize: "0.8rem" }}
          value={status}
          onChange={(value) => onChangStatus(record.id, value)}
        >
          {statuses.map((s) => (
            <Select.Option key={s} value={s}>
              <Alert
                style={{ height: "100%" }}
                message={s}
                type={statusMapping[s]}
                showIcon
              />
            </Select.Option>
          ))}
        </Select>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
      ...getFilter(records, ['status']),
    },
    {
      title: "Create at",
      dataIndex: "created_at",
      width: 100,
      render: (time) => (
        <Tooltip title={moment(time).format("YYYY-MM-DD HH:mm:ss")}>
          <span>{moment(time).fromNow()}</span>
        </Tooltip>
      ),
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },

    {
      title: "Shipping city",
      width: 150,
      dataIndex: "shipping_id",
      align: "right",
      render: (_, record) => record.city.name,
      sorter: (a, b) => a.city.name.localeCompare(b.city.name),
      ...getFilter(records, ['city', 'name']),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Button
              type="link"
              icon={<ZoomInOutlined />}
              onClick={() => onSelectOrder(record.id)}
            />

            <EditAndDeleteActions onDelete={() => handleDeleteRow(record.id)} />
          </>
        );
      },
    },
  ];

  const onSelectOrder = (id) => {
    setRecordId(id);
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setIsModalVisible(false);
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
      <Title level={1} code>
        Customer Orders
      </Title>
      <ListWithSelection
        dataList={records}
        columns={columns}
        keyProp={"id"}
        handleDeleteRows={handleDeleteRows}
        recordName="order"
        filterField={(record, filter) =>
          (record.user.first_name + " " + record.user.last_name)
            .toUpperCase()
            .includes(filter.toUpperCase())
        }
      />
      <OrderModal
        visible={isModalVisible}
        onCancel={onCancel}
        recordName="order"
        orderId={recordId}
      />
    </>
  );
}

export default Orders;
