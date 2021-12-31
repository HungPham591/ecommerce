import { Descriptions, Steps, Timeline } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
const { Step } = Steps;

const Contact = () => {
  return (
    <div style={{padding: 20}}>
      <Title level={1}>Contact us</Title>
      <Title level={4}>Please follow the steps below</Title>
      <Steps direction="vertical" current={0}>
        <Step title="Compose email" status='process' description="With title: from_customer_code2750 and your content" />
        <Step title="Send mail" status='process' description="Please send to the address: pixel_light@business.com" />
        <Step title="Waiting" status='process' description="Waiting for check from us (it may take a few hours)" />
        <Step title="Get feedback" status='process' description="Feedback will be sent to your inbox" />
      </Steps>
    </div>
  );
};

export default Contact;
