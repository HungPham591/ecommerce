import {
  Button,
  Descriptions,
  Divider,
  Form,
  List,
  Modal,
  Statistic,
} from "antd";
import Text from "antd/lib/typography/Text";
import useOneItem from "components/hooks/useOneItem";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const OrderModal = ({ orderId, visible, onCancel, recordName = "order" }) => {
  const [order, reload] = useOneItem(`orders/${orderId}`);

  useEffect(() => {
    reload();
  }, [orderId]);

  const { sub_total, tax, total, full_name, address, phone } = order || {};

  const data = [
    { label: "Sub total", value: sub_total + "$" },
    { label: "Tax", value: tax + "$" },
    { label: "Shipping", value: (total - sub_total - tax).toFixed(2) + "$" },
    { label: "Total", value: total + "$" },
    { label: "Full name", value: full_name },
    { label: "Phone", value: phone },
  ];

  const products = order?.orderItems || [];

  return (
    <Modal
      title={`Order Detail`}
      visible={visible}
      centered
      footer={false}
      onCancel={onCancel}
    >
      <Divider orientation="center">Shipping info</Divider>
      <Descriptions>
        {data.map((item) => (
          <Descriptions.Item key={item.label} label={item.label}>
            <Text strong>{item.value}</Text>
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Divider orientation="center">Shipping address</Divider>
      <Text>{address}</Text>
      <Divider orientation="center">Products detail</Divider>
      {products.map((item) => {
        return (
          <Form.Item key={item.id}>
            <div style={{ display: "flex" }}>
              <div style={{ flexGrow: 1 }}>
                <Link to={`/shopping/detail?id=${item.product.id}`}>
                  <Text style={{ display: "block", color: "#003a70" }} strong>
                    {item.product.name}
                  </Text>
                </Link>

                <Text type="secondary">Quantity: {item.quantity}</Text>
                {item.product.quantity != -1 && (
                  <Text type="secondary" style={{marginLeft: 8}}>
                    (Inventory: {item.product.quantity})
                  </Text>
                )}
              </div>
              <div style={{ fontWeight: 500 }}>
                {`$ ${(item.quantity * item.product.price).toFixed(2)}`.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )}
              </div>
            </div>
          </Form.Item>
        );
      })}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={onCancel}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default OrderModal;
