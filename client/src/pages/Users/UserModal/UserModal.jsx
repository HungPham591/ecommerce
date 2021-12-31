import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import validateMessages from "helpers/validationMessages";
import useListItem from "components/hooks/useListItem";
import useRandomKey from "components/hooks/useRandomKey";
import { mailValidatorCanNull } from "helpers/logicFunctions";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const UserModal = ({
  visible,
  handleOk,
  onCancel,
  initData,
  recordName = "item",
}) => {
  const [form] = Form.useForm();
  const [uploadKey, reloadUploadKey] = useRandomKey();

  const [roles, reloadRoles, loading, error] = useListItem("roles");

  const initValues = {
    role_id: roles.find((role) => role.role_code == "cus")?.id,
    disabled: 0
  };

  useEffect(() => {
    if (initData) {
      form.setFieldsValue({ ...initData });
    } else form.resetFields();
    if (!visible) reloadUploadKey();
  }, [visible]);

  const onFinish = (formData) => {
    console.log(formData);
    handleOk(formData);
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
      console.log(info.file.response.filePath);
    }

    if (info.file.status === "error")
      message.error(
        "An error occurred while trying to upload the file, try again"
      );
  }

  return (
    <Modal
      title={initData ? `Edit ${recordName}` : `Add new ${recordName}`}
      visible={visible}
      centered
      footer={false}
      onCancel={onCancel}
    >
      <Form
        name={`${recordName}-form`}
        form={form}
        initialValues={initValues}
        onFinish={onFinish}
        validateMessages={validateMessages}
        {...layout}
      >
        {initData == null && (
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, max: 50 }]}
          >
            <Input />
          </Form.Item>
        )}

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

        <Form.Item label="Role" name="role_id">
          <Select
            loading={loading}
            placeholder="Select role for user"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {roles.map((role) => (
              <Select.Option value={role.id} key={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Avatar">
          {initData?.["avatar"] && (
            <Avatar
              size={42}
              style={{ marginRight: 8 }}
              src={`${process.env.REACT_APP_BASE_URL}/${initData["avatar"]}`}
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
            maxCount={1}
            action={`${process.env.REACT_APP_BASE_URL}/upload-img/user`}
          >
            <Button icon={<UploadOutlined />}>
              Click to upload {initData?.avatar ? "a new avatar" : "avatar"}
            </Button>
          </Upload>
        </Form.Item>
        {initData == null && (
          <Form.Item
            name="password"
            label="Password"
            hasFeedback
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password placeholder="At least 8 characters" />
          </Form.Item>
        )}
        {initData == null && (
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
        )}
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
        <Form.Item label="Disable" name="disabled">
          <Radio.Group>
            <Radio value={0}>No</Radio>
            <Radio value={1}>Yes</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Divider type="vertical" />
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
