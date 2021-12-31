import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
} from "antd";
import { useEffect } from "react";
import validateMessages from "helpers/validationMessages";

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

const initValues = { shipping: 5 };

const CityModal = ({
  visible,
  handleOk,
  onCancel,
  initData,
  recordName = "city",
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initData) {
      const shipping = parseFloat(initData.shipping);
      form.setFieldsValue({ ...initData, shipping });
    } else form.resetFields();
  }, [visible]);

  const onFinish = (formData) => {
    console.log(formData);
    handleOk(formData);
  };

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
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, max: 50 }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Shipping fee"
          name="shipping"
          rules={[{ required: true, type: 'number' }]}
        >
          <InputNumber />
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

export default CityModal;
