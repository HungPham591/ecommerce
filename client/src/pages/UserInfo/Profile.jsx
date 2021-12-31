import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Typography,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import useOneItem from "components/hooks/useOneItem";
import validateMessages from "helpers/validationMessages";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import useRandomKey from "components/hooks/useRandomKey";
import { mailValidatorCanNull, mailValidatorNotNull } from "helpers/logicFunctions";
import LoadingScreen from "components/LoadingScreen";
import ErrorHandler from "components/ErrorHandler";
import clientAxios from "services/axios/clientAxios";
import errorNotification from "helpers/errorNotification";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Profile = () => {
  const [info, reloadInfo, loaddingInfo, errorInfo] =
    useOneItem("auth/allinfo");
  const [form] = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const history = useHistory();
  const [uploadKey, reloadUploadKey] = useRandomKey();

  useEffect(() => {
    const asynFunc = async () => {
      if (info) {
        await form.setFieldsValue({ ...info });
        checkEdit();
      } else form.resetFields();
    };

    asynFunc();
  }, [info]);

  const checkEdit = () => {
    const dataForm = form.getFieldsValue();
    for (const prop in info) {
      if (info[prop] !== dataForm[prop]) {
        setIsEditing(true);
        return;
      }
    }
    return setIsEditing(false);
  };

  const handleUpdateInfo = async (formData) => {
    try {
      const { data } = await clientAxios.put("auth/changeinfo", {
        ...formData,
      });

      message.success(data.message);
      reloadInfo();
      reloadUploadKey();
    } catch (err) {
      errorNotification(err);
    }
  };

  // for upload file
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }

    if (isJpgOrPng && isLt2M) return true;
    else return Upload.LIST_IGNORE;
  }

  function onChangeFile(info) {
    if (info.file.status === "done") {
      form.setFieldsValue({ avatar: info.file.response.filePath });
      setIsEditing(true);
      console.log(info.file.response.filePath);
    }

    if (info.file.status === "error")
      message.error(
        "An error occurred while trying to upload the file, try again"
      );
  }

  if (loaddingInfo) return <LoadingScreen />;

  if (errorInfo) return <ErrorHandler error={errorInfo} />;

  return (
    <Form
      className="info-form"
      form={form}
      style={{
        width: 500,
        margin: "0px auto",
        maxWidth: "90%",
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: 24,
      }}
      onChange={checkEdit}
      onFinish={handleUpdateInfo}
      validateMessages={validateMessages}
      scrollToFirstError
      requiredMark={false}
      {...layout}
    >
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        Your Info
      </Typography.Title>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, max: 50, min: 4 }]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role_name"
        rules={[{ required: true, max: 50, min: 4 }]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input disabled />
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
      <Form.Item label="Avatar">
        {info?.["avatar"] && (
          <Avatar
            size={42}
            style={{ marginRight: 8 }}
            src={`${process.env.REACT_APP_BASE_URL}/${info["avatar"]}`}
          />
        )}
        <Form.Item name="avatar" hidden={true}>
          <Input />
        </Form.Item>
        <Upload
        key={uploadKey}
          onChange={onChangeFile}
          beforeUpload={beforeUpload}
          listType="picture"
          name="file"
          maxCount={1}
          action={`${process.env.REACT_APP_BASE_URL}/upload-img/user`}
        >
          <Button icon={<UploadOutlined />}>
            Click to upload {info?.avatar ? "a new avatar" : "avatar"}
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          {
            validator: mailValidatorCanNull,
          },
        ]}
      >
        <Input addonBefore="+84" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Address" name="address" rules={[{ max: 200 }]}>
        <Input.TextArea
          allowClear={true}
          autoSize={{ minRows: 2, maxRows: 3 }}
        />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button htmlType="submit" type={isEditing? 'primary' : 'default'} disabled={!isEditing}>
          Edit
        </Button>
        <Divider type="vertical" />
        <Button onClick={() => history.goBack()}>Go back</Button>
      </Form.Item>
      <Divider />
      <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
        If you want to change your password, click
        <Link to="/changepass">{` here`}</Link>
      </p>
    </Form>
  );
};

export default Profile;
