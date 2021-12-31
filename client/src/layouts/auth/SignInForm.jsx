import {
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  Typography,
  Modal,
  message,
} from "antd";
import { UserOutlined, LockOutlined, WarningTwoTone } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import validateMessages from "helpers/validationMessages";
import { useContext, useState } from "react";
import { AppContext } from "utilities/app";
import "./style.scss";
import LinkToHome from "components/unit-components/LinkToHome";
import clientAxios from "services/axios/clientAxios";

const initialValues = {
  remember: true,
  username: "dieploc9046",
  password: "123456789",
};

const SignInForm = () => {
  const { dispatch } = useContext(AppContext);
  const [error, setError] = useState(null);
  const routerHistory = useHistory();

  const onFinish = ({ remember, username, password }) => {
    setError(null);

    const login = async () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cartItems"));

        const { data } = await clientAxios.post("auth/signin", {
          username,
          password,
          cartItems,
        });

        if (data.status == 'failed') {
          Modal.confirm({
            icon: <WarningTwoTone twoToneColor="red" />,
            title:
              "Sorry, your account has been disabled, we need time to re-verify its use.",
            okButtonProps: {
              type: "default",
              block: true,
              style: { marginLeft: 0 },
            },
            cancelButtonProps: { type: "primary", block: true, style: {marginBottom: 8} },
            okText: "Cancel",
            cancelText: "Go shopping without logging in",
            onCancel: () => routerHistory.push("/shopping"),
          });
          return;
        }

        if (remember) {
          localStorage.setItem("accessToken", data.accessToken);
        } else {
          sessionStorage.setItem("accessToken", data.accessToken);
        }

        localStorage.setItem("cartItems", null);

        message.warn("Your shopping cart has been synced", 5);

        dispatch({
          type: "SIGN_IN",
          payload: { user: data.userInfo, isSignIn: true },
        });
        routerHistory.push("/");
      } catch (err) {
        console.log(err.response);
        setError(err?.response?.data?.message);
      }
    };

    login();
  };

  return (
    <div
      className="aligned-flex background-form"
      style={{
        paddingBottom: "10vh",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <LinkToHome />
      <Form
        name="normal_login"
        style={{
          width: 350,
          maxWidth: "90%",
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 24,
        }}
        initialValues={initialValues}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Sign-In
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

        <Form.Item name="username" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true }]}>
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          <Divider plain> Don't have an account?</Divider>

          <Link to="/auth/signup">
            <Button block style={{ fontWeight: "bold" }}>
              Create account
            </Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignInForm;
