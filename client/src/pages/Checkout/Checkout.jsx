import { Button, Divider, Result, Steps } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "utilities/app";
import CheckoutInfo from "./CheckoutSteps/CheckoutInfo";
import CheckoutPayment from "./CheckoutSteps/CheckoutPayment";
import "./style.scss";

const { Step } = Steps;

const Checkout = () => {
  const { state } = useContext(AppContext);
  const history = useHistory();
  if (!state.isSignIn) history.push("/auth/signin");

  const [currentStep, setCurrentStep] = useState(0);
  const [info, setInfo] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const handleSuccess = (id) => {
    setCurrentStep(2);
    setOrderId(id);
  };

  const handleGetInfo = (data) => {
    setInfo(data);
    setCurrentStep(1);
  };

  const backStep = () => setCurrentStep(0);

  const handlePayment = () => {};

  const successRender = (
    <>
      <Result
        status="success"
        title={`Success, order id: ${orderId}`} 
        extra={
          <Link to={"/shopping"}>
            <Text>
              You have successfully added your order, please complete the online
              payment on the pop-up if you choose to pay via paypal.
            </Text>
            <Divider />
            <Button type="primary" shape="round">
              Back to shopping
            </Button>
          </Link>
        }
      />
    </>
  );

  return (
    <div className="checkout-form">
      <Title style={{ marginLeft: "auto", marginRight: "auto" }} level={2}>
        Checkout
      </Title>
      <Steps current={currentStep}>
        <Step title="Shipping info" />
        <Step title="Payment details" />
      </Steps>
      <CheckoutInfo handleOk={handleGetInfo} step={currentStep} />
      {currentStep === 1 && (
        <CheckoutPayment
          handleOk={handlePayment}
          backStep={backStep}
          info={info}
          onSuccess={handleSuccess}
        />
      )}
      {currentStep === 2 && successRender}
    </div>
  );
};

export default Checkout;
