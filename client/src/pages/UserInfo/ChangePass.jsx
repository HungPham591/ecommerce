import { Button, Divider, Form, Input, message, Typography } from "antd";
import validateMessages from "helpers/validationMessages";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import clientAxios from "services/axios/clientAxios";

const ChangePass = () => {
  const [error, setError] = useState(null);
  const history = useHistory();

  const onFinish = async (formData) => {
    setError(null);
    const { oldPassword, newPassword } = formData;
    console.log(formData);
    try {
      const { data } = await clientAxios.put("auth/changepass", {
        oldPassword,
        newPassword,
      });
      message.success(data.message);

      history.push("/shopping");
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };

  return (
    <Form
      name="change_pass_form"
      style={{
        width: 350,
        maxWidth: "90%",
        margin: "0px auto",
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: 24,
      }}
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        Change Password
      </Typography.Title>

      {error ? (
        <Typography.Text
          style={{ display: "block", textAlign: "center" }}
          type="danger"
        >
          {error}
        </Typography.Text>
      ) : (
        <br />
      )}

      <Form.Item name="oldPassword" rules={[{ required: true }]}>
        <Input.Password placeholder="Old Password" allowClear />
      </Form.Item>

      <Form.Item
        name="newPassword"
        rules={[{ required: true, min: 8, max: 50 }]}
      >
        <Input.Password placeholder="New Password" allowClear />
      </Form.Item>
      <Divider />
      <Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          style={{ marginBottom: 16 }}
        >
          Change
        </Button>

        <Button block onClick={() => history.goBack()}>
          Go back
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePass;
