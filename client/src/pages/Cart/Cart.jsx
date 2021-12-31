import {
  Button,
  Descriptions,
  Divider,
  List,
  message,
  PageHeader,
  Popconfirm,
  Select,
  Space,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import useListItem from "components/hooks/useListItem";
import CustomAvatar from "components/unit-components/CustomAvatar";
import errorNotification from "helpers/errorNotification";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import clientAxios from "services/axios/clientAxios";
import { AppContext } from "utilities/app";
import moment from "moment";
import "./style.scss";

const { TabPane } = Tabs;

const mappingStatus = {
  confirmed: "processing",
  shipping: "warning",
  cancelled: "error",
  failed: "error",
  rejected: "error",
  success: "success",
};

const Cart = () => {
  const [items, setItems] = useState([]);
  const [products, reloadProduct, loadingProduct, errorProduct] =
    useListItem("/products");
  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();

  const [orders, reloadOrders, loaddingOrder, errorOrder] = useListItem(
    "/cartitems/myorder",
    {
      filter: (item) => !item.delete_for_user,
      sortBy: (a, b) => b.created_at.localeCompare(a.created_at),
    }
  );

  const reloadCartItems = async () => {
    if (state.isSignIn) {
      try {
        const { data } = await clientAxios.get("/cartitems");

        setItems(data.data);
      } catch (err) {
        errorNotification(err);
      }
    } else {
      const localItems = JSON.parse(localStorage.getItem("cartItems"));
      setItems(localItems || []);
    }
    dispatch({ type: "RELOAD_CART" });
  };

  useEffect(() => {
    reloadCartItems();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      await clientAxios.put(`orders/${orderId}/hide`);

      message.success("success");
      reloadOrders();
    } catch (err) {
      errorNotification(err);
    }
  };

  const handleCheckout = async () => {
    if (!state.isSignIn) history.push("/auth/signin");
    else history.push("/checkout");
  };

  const handleChangeQuantity = async (itemId, productId, newQuantity) => {
    if (state.isSignIn) {
      try {
        await clientAxios.put(`/cartitems/${itemId}`, {
          quantity: newQuantity,
        });

        reloadCartItems();
      } catch (err) {
        errorNotification(err);
      }
    } else {
      const newItems = items.map((i) =>
        i.product_id == productId ? { ...i, quantity: newQuantity } : i
      );
      localStorage.setItem("cartItems", JSON.stringify(newItems));

      setItems(newItems);
    }
    dispatch({ type: "RELOAD_CART" });
  };

  const handleDeleteItem = async (item) => {
    if (state.isSignIn) {
      try {
        await clientAxios.delete(`/cartitems/${item.id}`);

        reloadCartItems();
      } catch (err) {
        errorNotification(err);
      }
    } else {
      const newItems = items.filter((i) => i.product_id != item.product_id);
      localStorage.setItem("cartItems", JSON.stringify(newItems));

      setItems(newItems);
    }
    dispatch({ type: "RELOAD_CART" });
  };

  const quantitySum = items.reduce((a, b) => a + b.quantity, 0);
  const priceSum = items
    .map((i) => ({
      ...i,
      unitPrice: products.find((p) => p.id == i.product_id)?.price,
    }))
    .reduce((a, b) => a + b.unitPrice * b.quantity, 0);

  const cartRender =
    items.length === 0 ? (
      <TabPane tab="Shopping Cart" key={1}>
        <Title level={2}>Your cart is empty</Title>
      </TabPane>
    ) : (
      <TabPane tab="Shopping Cart" key={1}>
        <Title level={2}>Shopping Cart</Title>
        <Divider orientation="right"></Divider>
        {items.map((item) => {
          const product = products.find((p) => p.id == item.product_id);
          return !product ? (
            <Divider />
          ) : (
            <div key={item.id}>
              <div className="cart-item">
                <div>
                  <CustomAvatar
                    size={80}
                    type="image"
                    src={
                      product.productImages.sort(
                        (a, b) => b.priority - a.priority
                      )[0]?.src
                    }
                  />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <Link to={`/shopping/detail?id=${product.id}`}>
                    <Title style={{ color: "#003a70" }} level={4}>
                      {product.name}
                    </Title>
                  </Link>

                  <Text strong style={{ marginRight: 8, marginBottom: 8 }}>
                    Qty:
                  </Text>
                  <Select
                    style={{ width: 80, borderRadius: 32 }}
                    value={item.quantity}
                    onChange={(e) =>
                      handleChangeQuantity(item.id, item.product_id, e)
                    }
                  >
                    {[...Array(20)].map((_, ind) => {
                      return (
                        <Select.Option key={ind} value={ind + 1}>
                          {ind + 1}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <Title level={5}>{product.price}</Title>
                  <Button
                    key="1"
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => handleDeleteItem(item)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <Divider />
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
            }}
          >
            <div>
              <Text>Subtotal ({quantitySum} items): </Text>
              <Text strong style={{ fontSize: "1.5rem" }}>
                {priceSum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$
              </Text>
            </div>
            <Button
              shape="round"
              type="primary"
              onClick={() => handleCheckout()}
            >
              Check out
            </Button>
          </div>
        </div>
      </TabPane>
    );

  return (
    <div style={{ maxWidth: 1000, margin: "auto" }}>
      <Tabs defaultActiveKey={1}>
        {cartRender}
        <TabPane tab="Order" key={2}>
          <Title level={2}>Your Order</Title>
          <Divider orientation="right"></Divider>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            dataSource={orders}
            renderItem={(order) => {
              const quantityOrder = order.orderItems.reduce(
                (a, b) => a + b.quantity,
                0
              );
              return (
                <List.Item key={order.id}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "white",
                      marginBottom: 32,
                      padding: 32,
                    }}
                  >
                    <Divider>
                      <Tooltip
                        title={moment(order.created_at).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      >
                        <div>{moment(order.created_at).fromNow()}</div>
                      </Tooltip>
                      order ID: {order.id}
                    </Divider>
                    <div>
                      <Descriptions column={1} className="description-order">
                        <Descriptions.Item label="Recipient's name">
                          {order.full_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                          {order.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Shipping city">
                          {order.city.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Shipping address">
                          {order.address}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                          <Tag color={mappingStatus[order.status]}>
                            {order.status}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Paid online">
                          {order.paid ? (
                            <Tag color="#07D000">Yes</Tag>
                          ) : (
                            <Tag color="#FFACAC">no</Tag>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                    <Divider></Divider>
                    <div>
                      {order.orderItems.map((item) => {
                        const product = item.product;
                        return (
                          <div className="cart-item" key={item.id}>
                            <div style={{ flexGrow: 1 }}>
                              <Link to={`/shopping/detail?id=${product.id}`}>
                                <Title style={{ color: "#003a70" }} level={5}>
                                  {product.name}
                                </Title>
                              </Link>
                              <Text style={{ marginRight: 8, marginBottom: 8 }}>
                                {`Qty: ${item.quantity}`}
                              </Text>
                              <br />
                              <Text style={{ marginRight: 8, marginBottom: 8 }}>
                                {`Price: ${item.unit_price}`}
                              </Text>
                            </div>
                            <div>
                              <Title level={5}>
                                ${(item.unit_price * item.quantity).toFixed(2)}
                              </Title>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Divider />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <Text>Subtotal ({quantityOrder} items): </Text>
                        <Text strong>
                          $
                          {parseFloat(order.sub_total)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <Text>Tax: </Text>
                        <Text strong>
                          $
                          {parseFloat(order.tax)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <Text>Shipping fee: </Text>
                        <Text strong>
                          $
                          {parseFloat(order.total - order.tax - order.sub_total)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text strong>Total: </Text>
                        <Text strong style={{ fontSize: "1.2rem" }}>
                          $
                          {parseFloat(order.total)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                      </div>
                    </div>
                    {["success", "failed", "cancelled", "rejected"].includes(
                      order.status
                    ) && (
                      <Popconfirm
                        title="Delete this order from your history?"
                        onConfirm={() => handleDeleteOrder(order.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Divider>
                          <Button type="primary" danger>
                            Delete
                          </Button>
                        </Divider>
                      </Popconfirm>
                    )}
                  </div>
                </List.Item>
              );
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Cart;
