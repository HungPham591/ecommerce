import { Tag } from "antd";
import { PhoneFilled } from "@ant-design/icons";
import categoryColorMap from "helpers/categoryColorMap";

const PhoneTag = ({ phone }) => {
  return (
    <Tag icon={<PhoneFilled />} color="processing">
      {phone}
    </Tag>
  );
};
export default PhoneTag;
