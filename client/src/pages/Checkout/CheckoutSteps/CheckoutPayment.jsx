import { Avatar, Button, Divider, Form, Image, message, Radio, Space } from "antd";
import Text from "antd/lib/typography/Text";
import useListItem from "components/hooks/useListItem";
import useOneItem from "components/hooks/useOneItem";
import errorNotification from "helpers/errorNotification";
import getMainSrc from "helpers/getMainSrc";
import React, { useContext, useState } from "react";
import clientAxios from "services/axios/clientAxios";
import { AppContext } from "utilities/app";

const CheckoutPayment = ({ backStep, info, onSuccess }) => {
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [items, reloadItems, loading, error] = useListItem("cartitems", {
    sortBy: (a, b) => a.product.name.localeCompare(b.product.name),
  });
  const {dispatch} = useContext(AppContext);

  const [city] = useOneItem(`cities/${info.city_id}`);

  const onPaymentOnline = async () => {
    try {
      setLoadingPayment(true);
      if (!window.navigator.onLine) {
        message.error('Sorry, your internet is very slow or disconnected, please checkout later');
        setLoadingPayment(false);
        return;
      }

      const { data } = await clientAxios.post("payment/new", { ...info });

      setLoadingPayment(false);
      const width = window.innerWidth / 2 - 520 / 2;
      const height = window.innerHeight / 2 - 570 / 2;

      dispatch({type: 'RELOAD_CART'})
      onSuccess(data.orderId);
      window.open(
        data.data,
        "_blank",
        `location=yes,height=570,width=520,scrollbars=yes,status=yes,top=${height},left=${width}`
      );
    } catch (err) {
      setLoadingPayment(false);
      errorNotification(err);
      reloadItems();
    }
  };

  const onPayment = () => {
    if (isOffline) onPaymentOffline();
    else onPaymentOnline();
  }

  const onPaymentOffline = async () => {
    try {
      setLoadingPayment(true);
      if (!window.navigator.onLine) {
        message.error('Sorry, your internet is very slow or disconnected, please checkout later');
        setLoadingPayment(false);
        return;
      }
      const { data } = await clientAxios.post("payment/newoffline", {
        ...info,
      });
      setLoadingPayment(false);
      dispatch({type: 'RELOAD_CART'})
      onSuccess(data.orderId);
    } catch (err) {
      console.log(err.response)
      setLoadingPayment(false);
      reloadItems();
      errorNotification(err);
    }
  };

  const priceSum = items
    .reduce((a, b) => a + b.quantity * b.product.price, 0)
    .toFixed(2);
  const tax = (priceSum * 0.05).toFixed(2);
  const shipping = city ? city.shipping : 0;

  return (
    <Space direction="vertical">
      <Divider>Order summary</Divider>
      {items.map((item) => {
        return (
          <Form.Item key={item.id}>
            <div style={{ display: "flex" }}>
              <div style={{ flexGrow: 1 }}>
                <Text style={{ display: "block" }} strong>
                  {item.product.name}
                </Text>
                <Text type="secondary">Unit price: ${item.product.price}</Text>
                <br/>
                <Text type="secondary">Quantity: {item.quantity}</Text>
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
      <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
        <Text style={{ display: "block", flexGrow: 1 }} strong>
          Tax (5%):
        </Text>
        <div style={{ fontWeight: 500 }}>$ {tax}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ display: "block", flexGrow: 1 }} strong>
          Shipping fee ({city?.name}):
        </Text>
        <div style={{ fontWeight: 500 }}>$ {shipping}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ display: "block", flexGrow: 1 }} strong>
          Total:
        </Text>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          ${" "}
          {(
            parseFloat(priceSum) +
            parseFloat(shipping) +
            parseFloat(tax)
          ).toFixed(2)}
        </div>
      </div>

      <Divider orientation="center">Payment method</Divider>
      <Radio.Group
        style={{ display: "flex", justifyContent: 'center' }}
        value={isOffline}
        onChange={(e) => setIsOffline(e.target.value)}
      >
        <Radio value={false}>
          With{" "}
          <Avatar
            style={{ borderRadius: 0 }}
            width={32}
            src={getMainSrc(`images/app/paypal_logo.png`)}
          />
        </Radio>
        <Radio value={true}>Offline</Radio>
      </Radio.Group>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={backStep}>BACK</Button>
        <Button loading={loadingPayment} type="primary" onClick={onPayment}>
          CONFIRM
        </Button>
      </div>
    </Space>
  );
};

export default CheckoutPayment;
