import { Button, Divider, Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";
import validateMessages from "helpers/validationMessages";
import useListItem from "components/hooks/useListItem";

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

const BuyModal = ({
  visible,
  handleOk,
  onCancel,
  initData,
  recordName = "buy",
}) => {
  const [form] = Form.useForm();
  const [suppliers] = useListItem('suppliers');

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
          label="Supplier"
          name="supplier_id"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select supplier"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {suppliers.map((supp) => (
              <Select.Option value={supp.id} key={supp.id}>
                {supp.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ max: 200 }]}
        >
          <Input.TextArea
            allowClear={true}
            autoSize={{ minRows: 2, maxRows: 3 }}
          />
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

export default BuyModal;
