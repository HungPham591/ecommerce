import { Button, DatePicker, Divider, Select, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import LoadingScreen from "components/LoadingScreen";
import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { statisticTypes } from "./HandleLogic";
import { genData, getRangeTime, options, timeTypes } from "./Options";
import "./style.scss";
import "chartjs-plugin-datalabels";
import ReportModal from "./ReportModal";
const { RangePicker } = DatePicker;

const Statistic = () => {
  const [timeType, setTimeType] = useState(timeTypes[0]);
  const [statisticType, setStatisticType] = useState(statisticTypes[0]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [records, reloadRecords, loaddingRecords, errorRecords] = useListItem(
    `statistics/${statisticTypes[0].value}`,
    { sortBy: "No" }
  );
  const [allData, setAllData] = useState(null);
  const [shape, setShape] = useState("bar");
  const [targetData, setTargetData] = useState(0);
  const [enableStatistic, setEnableStatistic] = useState(true);

  const [reportData, setReportData] = useState(null);
  const [reportColumn, setReportColumn] = useState([]);
  const [reportVisible, setReportVisible] = useState(false);

  useEffect(() => {
    if (!statisticType) return;
    if (!records || records.length <= 0) return;
    const { datas, labels, data } = statisticType.handle(
      records,
      shape,
      targetData
    ) ?? {datas: [], labels: [], data: null};
    setReportData(data);
    setReportColumn(statisticType.column);
    setAllData(
      genData({
        labels: labels,
        datas: datas,
      })
    );
  }, [records, shape]);

  useEffect(() => {
    setTargetData(0);
  }, [statisticType]);

  useEffect(() => {
    setAllData(null);
    setReportData(null);
    setEnableStatistic(true);
    setReportColumn(null);
  }, [statisticType, targetData, dateRange, timeType]);

  const onChangeDate = (dates) => {
    if (!dates) {
      setDateRange([null, null]);
      return;
    }
    const [start, end] = getRangeTime(timeType, dates);
    setDateRange([start, end]);
  };

  const handleStatistic = () => {
    reloadRecords({
      url: `statistics/${statisticType.value}?${
        dateRange[0] ? `&start=${dateRange[0]}` : ""
      }${dateRange[1] ? `&end=${dateRange[1]}` : ""}`,
    });
  };

  const onCancelModel = () => {
    setReportVisible(false);
  };

  const RenderChar = allData?.datasets?.length > 0 ? (
    <Bar
      key={shape}
      style={{ maxHeight: 400 }}
      data={allData}
      options={{ ...options }}
    />
  ) : !enableStatistic ? <div style={{textAlign: 'center'}}>No Data</div> : '';

  return (
    <div>
      <Title code>Statistic</Title>
      <Divider />
      <Space wrap={true}>
        <div>
          <Text>Statistic type: </Text>
          <Select
            value={statisticType.value}
            style={{ width: 200 }}
            onChange={(value) =>
              setStatisticType(statisticTypes.find((s) => s.value === value))
            }
          >
            {statisticTypes.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label.capitalize()}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div>
          <Text>Target data: </Text>
          <Select
            // style={{ width: 120 }}
            value={targetData}
            onChange={(value) => setTargetData(value)}
          >
            {statisticType.targetTypes.map((target) => (
              <Select.Option key={target.value} value={target.value}>
                {target.label}
              </Select.Option>
            ))}
          </Select>
          <Divider type="vertical" />
        </div>

        <div>
          <Text>Time type: </Text>
          <Select
            value={timeType}
            // style={{ width: 100 }}
            onChange={(value) => setTimeType(value)}
          >
            {timeTypes.map((type) => (
              <Select.Option key={type} value={type}>
                {type.capitalize()}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <Text>Time range: </Text>
          <RangePicker
            allowEmpty={[true, true]}
            picker={timeType}
            onChange={onChangeDate}
          />
        </div>
      </Space>
      <Divider>
        <Button
          type="primary"
          shape="round"
          style={{ padding: "0px 20px" }}
          onClick={() => {
            handleStatistic();
            setEnableStatistic(false);
          }}
          disabled={!enableStatistic}
        >
          GO
        </Button>
      </Divider>
      {errorRecords && <ErrorHandler error={errorRecords} />}
      {loaddingRecords ? (
        <LoadingScreen />
      ) : (
        <>
          {RenderChar}
          <Divider>
            {!allData || !reportColumn || !reportData ? (
              "There is no report template for this statistic"
            ) : (
              <Button
                type="primary"
                danger
                onClick={() => setReportVisible(true)}
              >
                Report
              </Button>
            )}
          </Divider>
        </>
      )}
      <ReportModal
        reportName={statisticType?.label}
        reportData={reportData}
        visible={reportVisible}
        onCancel={onCancelModel}
        columns={reportColumn}
        dateRange={dateRange}
        RenderChar={RenderChar}
      />
    </div>
  );
};

export default Statistic;
