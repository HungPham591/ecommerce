import { Button, Popconfirm, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";

const EditAndDeleteActions = ({ onEdit, onDelete }) => {
  return (
    <Space>
      {onEdit && (
        <Tooltip title="Edit">
          <Button
            size="small"
            icon={<EditOutlined />}
            type="primary"
            ghost
            onClick={onEdit}
          />
        </Tooltip>
      )}
      <Popconfirm
        title="Are you sure to delete this record? Cannot be rollback!"
        placement="bottomRight"
        onConfirm={onDelete}
        okText="Delete"
        cancelText="No"
        okButtonProps={{ ghost: true, danger: true }}
      >
        <Tooltip title="Remove">
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
};

export default EditAndDeleteActions;
