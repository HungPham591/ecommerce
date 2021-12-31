import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  Popover,
  Table,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getScreenSize } from "helpers/logicFunctions";

const { confirm } = Modal;

function ListWithSelection({
  filterField,
  dataList,
  columns,
  keyProp = "",
  handleDeleteRows = null,
  recordName = "item",
  addNewText = "Add New",
  onAddNew,
  additionalDeleteMess = null,
  rollbackWarning = true,
  extraHeader,
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filter, setFilter] = useState("");
  const filterRef = useRef(null);
  const filterTimeout = useRef(null);

  const [size, setSize] = useState("large");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < getScreenSize("md")) {
        setSize("small");
      } else if (window.innerWidth < getScreenSize("lg")) {
        setSize("middle");
      } else setSize("large");
    };

    const resizeListener = window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  const rowSelection = {
    columnWidth: 48,
    selectedRowKeys,
    onChange: (rowKeys) => setSelectedRowKeys(rowKeys),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  const onDeleteRows = () => {
    confirm({
      title: "Warning",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          Are you sure to delete {selectedRowKeys.length} selected {recordName}
          (s)?{rollbackWarning && " This cannot be rollback!"}
          {additionalDeleteMess && <div>({additionalDeleteMess})</div>}
        </>
      ),
      okText: "Delete",
      okType: "danger primary",
      okButtonProps: { danger: true, ghost: true },
      onOk() {
        handleDeleteRows && handleDeleteRows(selectedRowKeys);
        setSelectedRowKeys([]);
      },
      onCancel() {},
    });
  };

  let data = dataList.map((data, index) => ({
    key: keyProp ? data[keyProp] : index,
    ...data,
  }));

  useMemo(() => {
    if (filterField && filter.length > 0) {
      if (typeof filterField === "object" && filterField.length === 2) {
        data = data.filter((record) =>
          (record[filterField[0]].trim() + " " + record[filterField[1]].trim())
            .toUpperCase()
            .includes(filter.toUpperCase())
        );
      } else if (typeof filterField === "function") {
        data = data.filter((record) => filterField(record, filter));
      } else {
        data = data.filter((record) =>
          record[filterField]
            .trim()
            .toUpperCase()
            .includes(filter.toUpperCase())
        );
      }
    }
  }, [filter]);

  const hasSelectedItem = selectedRowKeys.length > 0;

  return (
    <>
      <div
        style={{
          padding: 8,
          backgroundColor: "white",
          borderRadius: "5px 5px 0 0",
        }}
      >
        <Tooltip
          title={
            hasSelectedItem
              ? `Delete selected ${recordName}s`
              : `No ${recordName} are selected`
          }
        >
          <Button
            onClick={onDeleteRows}
            danger
            icon={<DeleteOutlined />}
            disabled={!hasSelectedItem}
          />
        </Tooltip>
        <Divider type="vertical" />
        {onAddNew && (
          <>
            <Tooltip title={`Add new ${recordName}`}>
              <Button
                onClick={onAddNew}
                type="primary"
                ghost
                icon={<PlusOutlined />}
              >
                {window.innerWidth > getScreenSize("sm") && addNewText}
              </Button>
            </Tooltip>
            <Divider type="vertical" />
          </>
        )}

        {filterField && (
          <>
            <Tooltip title={`Search for ${recordName}`}>
              <Popover
                content={
                  <Input
                    ref={filterRef}
                    allowClear
                    onChange={(e) => {
                      if (filterTimeout.current)
                        clearTimeout(filterTimeout.current);
                      filterTimeout.current = setTimeout(
                        () => setFilter(e.target.value),
                        500
                      );
                    }}
                  />
                }
                trigger="click"
                onVisibleChange={(a) => {
                  if (a) setTimeout(() => filterRef.current?.focus(), 200);
                }}
              >
                <Button type="primary" icon={<SearchOutlined />} />
              </Popover>
            </Tooltip>
            <Divider type="vertical" />
          </>
        )}
        {extraHeader && extraHeader}
      </div>

      <Table
        size={size}
        pagination={{onChange: () => {window.scrollTo(0, 0)}}}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        scroll={{ x: 500 }}
        bordered
      />
    </>
  );
}
export default ListWithSelection;
