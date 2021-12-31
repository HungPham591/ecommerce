import { Button, Divider, Form, Input, Select } from "antd";
import Title from "antd/lib/typography/Title";
import useListItem from "components/hooks/useListItem";
import { mailValidatorNotNull } from "helpers/logicFunctions";
import validateMessages from "helpers/validationMessages";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const initValues = {};

const CheckoutInfo = ({ handleOk, info, step }) => {
  const [form] = Form.useForm();
  const [cities, reloadCities, loadingCiries, error] = useListItem("cities");

  useEffect(() => {
    console.log(info);
    form.setFieldsValue({...info});
  }, [info])

  const onFinish = (formData) => {
    console.log(formData);
    handleOk(formData);
  };

  return (
    <div style={{display: step === 0 ? 'block': 'none'}}>
      <Divider >Shipping info</Divider>
      <Form
        name={`checkout-form`}
        form={form}
        initialValues={initValues}
        onFinish={onFinish}
        validateMessages={validateMessages}
        {...layout}
      >
        <Form.Item
          label="Full name"
          name="full_name"
          rules={[{ required: true, max: 50 }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Shipping address"
          name="address"
          rules={[{ required: true, max: 50 }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            {
              validator: mailValidatorNotNull,
            },
          ]}
        >
          <Input addonBefore="+84" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Shipping city" name="city_id" rules={[{ required: true }]}>
          <Select
            loading={loadingCiries}
            placeholder="Choose a delivery place"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {cities.map((city) => (
              <Select.Option key={city.id} value={city.id} key={city.name}>
                {city.name} ({city.shipping}$)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Divider />
        <Form.Item noStyle>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Link to={"/cart"}>
              <Button>BACK TO CART</Button>
            </Link>
            <Button type="primary" htmlType="submit">
              NEXT
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CheckoutInfo;
