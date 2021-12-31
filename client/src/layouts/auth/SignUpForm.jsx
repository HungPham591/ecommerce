import { Button, Form, Input, message, Typography } from "antd";
import validateMessages from "helpers/validationMessages";
import LinkToHome from "components/unit-components/LinkToHome";
import { getDeepErrorMessage } from "helpers/errorNotification";
import clientAxios from "services/axios/clientAxios";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: 24,
};

const initValues = {};

const SignUpForm = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const routerHistory = useHistory();

  const onFinish = (formData) => {

    const signUp = async () => {
      setLoading(true)
      setError(null);
      try {
        const { data } = await clientAxios.post("/auth/signup", { ...formData });

        message.success(data.message);
        routerHistory.push("/auth/signin");
        setLoading(false)
      } catch (err) {
        setLoading(false)
        setError(getDeepErrorMessage(err));
      }
    };
    signUp();
  };

  return (
    <div
      className="aligned-flex background-form"
      style={{paddingBottom: '10vh', flexDirection: "column", justifyContent: "center" }}
    >
      <LinkToHome />
      <Form
        className="signup-form"
        style={{
          width: 350,
          maxWidth: "90%",
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 24,
        }}
        form={form}
        initialValues={initValues}
        onFinish={onFinish}
        validateMessages={validateMessages}
        scrollToFirstError
        requiredMark={false}
        {...layout}
      >
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Create account
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
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, max: 50, min: 4 }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First name"
          name="first_name"
          rules={[{ required: true, max: 20 }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last name"
          name="last_name"
          rules={[{ required: true, max: 20 }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          hasFeedback
          rules={[{ required: true, min: 8 }]}
        >
          <Input.Password placeholder="At least 8 characters" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button block type="primary" loading={loading} htmlType="submit">
            Create your account
          </Button>
        </Form.Item>
        <p className="sub-text">
          By creating an account, you agree to Pixel Light's Conditions of Use
          and Privacy Notice.
        </p>
      </Form>
    </div>
  );
};

export default SignUpForm;
