// datas: [{type, label, data}]

export const genData = ({ labels, datas }) => {
  const objData = {
    labels: labels,
    datasets: [],
  };
  datas.forEach((data) => {
    objData.datasets.push({
      type: "line",
      label: "Total Revenue($)",
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderWidth: 2,
      order: undefined,
      tension: 0.1,
      ...data,
    });
  });
  return objData;
};

export const options = {
  plugins: {
    datalabels: {
      display: true,
      color: "white",
    },
  },
  // scales: {
  //   // yAxes: [
  //   //   {
  //   //     ticks: {
  //   //       beginAtZero: true,
  //   //     },
  //   //   },
  //   // ],
  //   // y: {
  //   //   beginAtZero: true,
  //   // },
  // },
};

export const timeTypes = ["date", "week", "month", "quarter", "year"];

export const statisticShapes = [
  "pie",
  "line",
  "bar",
  "doughnut",
  //  "polarArea"
];

export const getRangeTime = (timeType, dates) => {
  const start = dates[0] && new Date(dates[0]);
  const end = dates[1] && new Date(dates[1]);
  let startDate;
  let endDate;
  switch (timeType) {
    case "week": {
      startDate = start && new Date(start).goToNewWeek();
      endDate = end && new Date(end).goToEndWeek();
      break;
    }
    case "month": {
      startDate = start && new Date(start).goToNewMonth();
      endDate = end && new Date(end).goToEndMonth();
      break;
    }
    case "year": {
      startDate = start && new Date(start).goToNewYear();
      endDate = end && new Date(end).goToEndYear();
      break;
    }
    case "quarter": {
      startDate = start && new Date(start).goToNewQuarter();
      endDate = end && new Date(end).goToEndQuarter();
      break;
    }
    default: {
      startDate = start && new Date(start).goToNewDay();
      endDate = end && new Date(end).goToEndDay();
      break;
    }
  }
  return [new Date(startDate)?.getTime(), new Date(endDate)?.getTime()];
};
