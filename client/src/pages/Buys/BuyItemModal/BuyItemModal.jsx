import { Button, Divider, Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
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

const initValues = { quantity: 1 };

const BuyItemModal = ({
  visible,
  handleOk,
  onCancel,
  initData,
  recordName = "buy",
}) => {
  const [form] = Form.useForm();
  const [products, loadingProduct] = useListItem("products");
  const [sumPrice, setSumPrice] = useState(0);

  const checkSumPrice = () => {
    if (form.getFieldValue("price")) {
      const sum = form.getFieldValue("quantity") * form.getFieldValue("price");
      setSumPrice(Math.floor(sum * 100) / 100);
    }
    console.log(form.getFieldValue("price"));
    console.log(form.getFieldValue("quantity"));
  };

  useEffect(() => {
    if (initData) {
      const shipping = parseFloat(initData.shipping);
      form.setFieldsValue({ ...initData, shipping });
    } else form.resetFields();
    setSumPrice(0);
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
          label="Product"
          name="product_id"
          rules={[{ required: true }]}
        >
          <Select
            loading={loadingProduct}
            placeholder="Select product"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {products.map((product) => (
              <Select.Option value={product.id} key={product.name}>
                {product.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Unit Price"
          name="price"
          rules={[{ required: true, type: "number" }]}
          extra={sumPrice > 0 && `Sum: ${`${sumPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$`}
        >
          <InputNumber
            onChange={checkSumPrice}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item
          name="quantity"
          rules={[{ type: "integer", min: 1, required: true }]}
          label="Quantity"
        >
          <InputNumber onChange={checkSumPrice} />
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

export default BuyItemModal;
