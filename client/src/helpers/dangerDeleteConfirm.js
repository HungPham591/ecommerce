import { Modal } from "antd";
import { WarningTwoTone } from "@ant-design/icons";

const dangerDeleteComfirm = ({title, onOk}) => {
  return setTimeout(() => Modal.confirm({
    icon: <WarningTwoTone twoToneColor='red'/>,
    title,
    onOk,
    okButtonProps: {danger: true, ghost: true},
    okText: 'Still Want To Delete',
    onCancel: () => null,
  }), 1000);
}

export default dangerDeleteComfirm;