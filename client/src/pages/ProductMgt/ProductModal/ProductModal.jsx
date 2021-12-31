import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
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
import CustomAvatar from "components/unit-components/CustomAvatar";
import moment from "moment";

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

const initValues = {
  quantity: null,
  public_for_sale: 1,
  images: [],
};

const ProductModal = ({
  removeImage,
  changeAvatar,
  visible,
  handleOk,
  onCancel,
  initData,
  recordName = "product",
}) => {
  const [form] = Form.useForm();
  const [uploadKey, reloadUploadKey] = useRandomKey();

  const [categories, reloadCate, loadingCate] = useListItem("categories");
  const [brands, reloadBrands, loadingBrand] = useListItem("brands");

  useEffect(() => {
    if (initData) {
      console.log(initData);
      const price = parseFloat(initData.price);
      const quantity = initData.quantity == -1 ? null : initData.quantity;
      const starts_at = initData["starts_at"]
        ? moment(initData["starts_at"])
        : null;
      const ends_at = initData["ends_at"] ? moment(initData["ends_at"]) : null;

      form.setFieldsValue({ ...initData, price, quantity, starts_at, ends_at });
    } else form.resetFields();
    if (!visible) reloadUploadKey();
  }, [visible]);

  const onFinish = (formData) => {
    const { starts_at, ends_at } = formData;
    if (starts_at && ends_at && starts_at > ends_at) {
      message.error("start date must be less than end date.");
      return;
    }
    const quantity = formData.quantity ?? -1;
    console.log({ ...formData, quantity });
    handleOk({ ...formData, quantity });
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
    if (info.fileList.every((file) => file.status === "done")) {
      form.setFieldsValue({
        images: info.fileList.map((file) => ({
          src: file.response.filePath,
          product_id: initData?.id || null,
        })),
      });
    }

    if (info.fileList.some((file) => file.status === "error"))
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
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, max: 50 }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category_id"
          rules={[{ required: true }]}
        >
          <Select
            loading={loadingCate}
            placeholder="Select product's category"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {categories.map((cate) => (
              <Select.Option value={cate.id} key={cate.title}>
                {cate.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Brand" name="brand_id" rules={[{ required: true }]}>
          <Select
            loading={loadingBrand}
            placeholder="Select product's brand"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            showSearch
          >
            {brands.map((brand) => (
              <Select.Option key={brand.id} value={brand.id} key={brand.name}>
                {brand.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Images">
          {initData?.["productImages"].length > 0 && (
            <div>
              {initData["productImages"].map((img, ind) => (
                <CustomAvatar
                  key={img.id}
                  src={img.src}
                  type="image"
                  onDelete={() => removeImage(img.id)}
                  onChangeAvatar={
                    ind > 0 ? () => changeAvatar(img.id, initData?.id) : null
                  }
                />
              ))}
            </div>
          )}
          <Form.Item name="images" hidden={true}>
            <Input />
          </Form.Item>
          <Upload
            key={uploadKey}
            onChange={onChangeFile}
            beforeUpload={beforeUpload}
            listType="picture"
            multiple
            action={`${process.env.REACT_APP_BASE_URL}/upload-img/product`}
          >
            <Button icon={<UploadOutlined />}>
              Click to{" "}
              {!initData?.productImages.length
                ? "upload new product images"
                : "add product images"}
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ max: 1000 }]}
        >
          <Input.TextArea
            allowClear={true}
            autoSize={{ minRows: 2, maxRows: 3 }}
          />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, type: "number" }]}
        >
          <InputNumber
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          rules={[{ type: "integer", min: 0 }]}
          label="Quantity"
          extra="empty for no statistical need"
        >
          <InputNumber />
        </Form.Item>

        <Form.Item label="Available for shopping" name="public_for_sale">
          <Radio.Group>
            <Radio value={0}>No</Radio>
            <Radio value={1}>Yes</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Starts at" name="starts_at">
          <DatePicker disabledTime />
        </Form.Item>
        <Form.Item label="Ends at" name="ends_at">
          <DatePicker disabledTime />
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

export default ProductModal;
