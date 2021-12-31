import { Divider, Modal, Table } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useContext, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AppContext } from "utilities/app";

const ReportModal = ({
  reportData,
  visible,
  onCancel,
  columns,
  dateRange,
  reportName,
  RenderChar,
}) => {
  const printRef = useRef();

  const { state } = useContext(AppContext);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  if (!reportData || !columns) return null;

  return (
    <>
      <Modal
        style={{ maxWidth: 800 }}
        width="100%"
        onOk={handlePrint}
        visible={visible}
        onCancel={onCancel}
        okText="Print"
      >
        <div
          ref={printRef}
          className="report-table"
          style={{ overflow: "auto", maxWidth: 1000 }}
        >
          <table>
            <tr>
              <th>Report name:</th>
              <td>{reportName}</td>
            </tr>
            <tr>
              <th>Creation date:</th>
              <td>{new Date().toString()}</td>
            </tr>
            <tr>
              <th>Creator:</th>
              <td>
                {state.user.first_name + state.user.last_name} (
                {state.user.username})
              </td>
            </tr>
            <tr>
              <th>From</th>
              <td>{dateRange[0] ? new Date(dateRange[0]).yyyymmdd() : null}</td>
            </tr>
            <tr>
              <th>To</th>
              <td>
                {dateRange[1]
                  ? new Date(dateRange[1]).yyyymmdd()
                  : new Date().yyyymmdd()}
              </td>
            </tr>
          </table>

          <Divider>
            <Text type="secondary">
              Note: the time period without data has been filtered out
            </Text>
          </Divider>
          <div style={{ maxWidth: 750 }}>{RenderChar}</div>
          <Divider>
            <Text type="secondary">Data table</Text>
          </Divider>
          <table>
            <tr>
              {columns.map((c) => (
                <th>{c.title}</th>
              ))}
            </tr>
            {reportData.map((data, ind) => {
              return (
                <tr>
                  <td>{ind}</td>
                  {columns.map((c) => {
                    if (data[c.dataIndex] !== 0 && !data[c.dataIndex])
                      return null;
                    return <td style={c.style}>{data[c.dataIndex]}</td>;
                  })}
                </tr>
              );
            })}
          </table>
        </div>
      </Modal>
    </>
  );
};

export default ReportModal;
