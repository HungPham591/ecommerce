import categoryColorMap from "helpers/categoryColorMap";

const borderColors = ["#000AFF", "#FF0000", "#FFD400"];

export const statisticTypes = [
  {
    label: "revenue by category",
    value: "category",
    order: 4,
    targetTypes: [
      { label: "Revenue", value: 0 },
      { label: "Quantity", value: 1 },
    ],
    handle: (records, shape, targetType = 0) => {
      const labels = records.map((r) => r.title);
      const data = records.map((cate) => ({
        id: cate.id,
        title: cate.title,
        sumRevenue: 0,
        sumQuantity: 0,
        sumInvestment: 0,
        sumBuyQuantity: 0,
      }));

      records.forEach((cate) => {
        cate.products.forEach((product) => {
          product.orderItems.forEach((orderItem) => {
            const { unit_price, quantity } = orderItem;
            const thisCate = data.find((d) => d.id === cate.id);
            thisCate.sumRevenue += unit_price * quantity;
            thisCate.sumQuantity += quantity;
          });
          product.buy_items.forEach((buyItem) => {
            const { price, quantity } = buyItem;
            const thisCate = data.find((d) => d.id === cate.id);
            thisCate.sumInvestment += price * quantity;
            thisCate.sumBuyQuantity += quantity;
          });
        });
      });

      const datas =
        targetType == 0
          ? [
              {
                data: data.map((d) => d.sumInvestment),
                type: "bar",
                label: "Total Investment",
                backgroundColor: data.map((d) => categoryColorMap(d.title)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.sumRevenue),
                type: "bar",
                label: "Total Revenue",
                backgroundColor: data.map((d) => categoryColorMap(d.title)),
                borderColor: borderColors[1],
              },
              {
                data: data.map((d) => d.sumRevenue - d.sumInvestment),
                type: "bar",
                label: "Total Profit",
                backgroundColor: data.map((d) => categoryColorMap(d.title)),
                borderColor: borderColors[2],
              },
            ]
          : [
              {
                data: data.map((d) => d.sumBuyQuantity),
                type: "bar",
                label: "Total quantity imported",
                backgroundColor: data.map((d) => categoryColorMap(d.title)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.sumQuantity),
                type: "bar",
                label: "Total Amount Sold",
                backgroundColor: data.map((d) => categoryColorMap(d.title)),
                borderColor: borderColors[1],
              },
            ];
      return { datas, labels, data };
    },
  },
  {
    label: "Lowest revenue product",
    value: "low-product",
    order: 3,
    targetTypes: [
      { label: "Revenue", value: 0 },
      { label: "Quantity", value: 1 },
    ],
    handle: (records, shape, targetType = 0) => {
      const labels = records.map((r) => r.name);
      const data = records.map((record) => ({
        id: record.id,
        name: record.name,
        sumRevenue: 0,
        sumInvestment: 0,
        sumQuantity: 0,
        sumBuyQuantity: 0,
      }));

      records.forEach((product) => {
        product.orderItems.forEach((orderItem) => {
          const { unit_price, quantity } = orderItem;
          const thisCate = data.find((d) => d.id === product.id);
          thisCate.sumRevenue += unit_price * quantity;
          thisCate.sumQuantity += quantity;
        });
        product.buy_items.forEach((buyItem) => {
          const { price, quantity } = buyItem;
          const thisCate = data.find((d) => d.id === product.id);
          thisCate.sumInvestment += price * quantity;
          thisCate.sumBuyQuantity += quantity;
        });
      });

      const datas =
        targetType == 0
          ? [
              {
                data: data.map((d) => d.sumInvestment),
                type: "bar",
                label: "Total Investment",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.sumRevenue),
                type: "bar",
                label: "Total Revenue",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[1],
              },
              {
                data: data.map((d) => d.sumRevenue - d.sumInvestment),
                type: "bar",
                label: "Total Profit",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[2],
              },
            ]
          : [
              {
                data: data.map((d) => d.sumBuyQuantity),
                type: "bar",
                label: "Total quantity imported",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.sumQuantity),
                type: "bar",
                label: "Total Amount Sold",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[1],
              },
            ];
      return { datas, labels, data };
    },
  },
  {
    label: "highest revenue product",
    value: "top-product",
    order: 2,
    targetTypes: [
      { label: "Revenue", value: 0 },
      { label: "Quantity", value: 1 },
    ],
    handle: (records, shape, targetType = 0) => {
      const labels = records.map((r) => r.name);
      const data = records.map((record) => ({
        id: record.id,
        name: record.name,
        sumRevenue: 0,
        sumInvestment: 0,
        sumQuantity: 0,
        sumBuyQuantity: 0,
      }));

      records.forEach((product) => {
        product.orderItems.forEach((orderItem) => {
          const { unit_price, quantity } = orderItem;
          const thisCate = data.find((d) => d.id === product.id);
          thisCate.sumRevenue += unit_price * quantity;
          thisCate.sumQuantity += quantity;
        });
        product.buy_items.forEach((buyItem) => {
          const { price, quantity } = buyItem;
          const thisCate = data.find((d) => d.id === product.id);
          thisCate.sumInvestment += price * quantity;
          thisCate.sumBuyQuantity += quantity;
        });
      });

      const datas =
        targetType == 0
          ? [
              {
                data: data.map((d) => d.sumInvestment),
                type: "bar",
                label: "Total Investment",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.sumRevenue),
                type: "bar",
                label: "Total Revenue",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[1],
              },
              {
                data: data.map((d) => d.sumRevenue - d.sumInvestment),
                type: "bar",
                label: "Total Profit",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[2],
              },
            ]
          : [
              {
                data: data.map((d) => d.sumBuyQuantity),
                type: "bar",
                label: "Total quantity imported",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.sumQuantity),
                type: "bar",
                label: "Total Amount Sold",
                backgroundColor: data.map((d) => categoryColorMap(d.name)),
                borderColor: borderColors[1],
              },
            ];
      return { datas, labels, data };
    },
  },
  {
    label: "Sales over time",
    column:[
      {
        title: 'Order',
        dataIndex: 'order',
        key: 'order',
      },
      {
        title: 'Time',
        dataIndex: 'label',
        key: 'label',
      },
      {
        title: 'Moment Investment',
        dataIndex: 'sumInvestment',
        key: 'sumInvestment',
      },
      {
        title: 'Moment Revenue',
        dataIndex: 'sumRevenue',
        key: 'sumRevenue',
      },
      {
        title: 'Moment Profit',
        dataIndex: 'sumProfit',
        key: 'sumProfit',
      },
      {
        title: 'Accumulated Investment',
        dataIndex: 'totalInvestment',
        key: 'totalInvestment',
      },
      {
        title: 'Accumulated Revenue',
        dataIndex: 'totalRevenue',
        key: 'totalRevenue',
      },
      {
        title: 'Accumulated Profit',
        dataIndex: 'totalProfit',
        key: 'totalProfit',
        style: {fontWeight: 'bold'}
      },
    ],
    value: "over-time",
    order: 0,
    targetTypes: [
      { label: "Accumulated revenue", value: 0 },
      { label: "Revenue per time", value: 1 },
      { label: "Quantity per time", value: 2 },
    ],
    handle: (records, shape, targetType = 0) => {
      const { buys, orders } = records[0];
      if (buys == undefined && orders == undefined || buys.length + orders.length === 0) return;

      const mindateBuys = buys.reduce(
        (a, b) => (a > new Date(b.created_at) ? new Date(b.created_at) : a),
        new Date()
      );
      const maxdateBuys = buys.reduce(
        (a, b) => (a < new Date(b.created_at) ? new Date(b.created_at) : a),
        new Date(0)
      );
      const mindateOrders = orders.reduce(
        (a, b) => (a > new Date(b.created_at) ? new Date(b.created_at) : a),
        new Date()
      );
      const maxdateOrders = orders.reduce(
        (a, b) => (a < new Date(b.created_at) ? new Date(b.created_at) : a),
        new Date(0)
      );

      const mindate = mindateBuys < mindateOrders ? mindateBuys : mindateOrders;
      const maxdate = maxdateBuys > maxdateOrders ? maxdateBuys : maxdateOrders;

      const data = []; // dates
      while (mindate <= maxdate || mindate.yyyymmdd() === maxdate.yyyymmdd()) {
        data.push({
          label: mindate.yyyymmdd(),
          sumRevenue: 0,
          sumInvestment: 0,
          sumProfit: 0,
          sumQuantity: 0,
          sumBuyQuantity: 0,
          totalRevenue: 0,
          totalInvestment: 0,
          totalProfit: 0,
        });
        mindate.setDate(mindate.getDate() + 1);
      }

      buys.forEach((buy) => {
        const dateString = new Date(buy.created_at).yyyymmdd();
        const targetDate = data.find((d) => d.label === dateString);

        buy.buy_items.forEach((buyItem) => {
          const { price, quantity } = buyItem;
          targetDate.sumInvestment += price * quantity;
          targetDate.sumBuyQuantity += quantity;
        });
      });
      orders.forEach((order) => {
        const dateString = new Date(order.created_at).yyyymmdd();
        const targetDate = data.find((d) => d.label === dateString);

        order.orderItems.forEach((orderItem) => {
          const { unit_price, quantity } = orderItem;
          targetDate.sumRevenue += unit_price * quantity;
          targetDate.sumQuantity += quantity;
        });
      });

      data[0].totalRevenue += data[0].sumRevenue;
      data[0].totalInvestment += data[0].sumInvestment;
      for (let i = 1; i < data.length; i++) {
        for (let k = 0; k <= i; k++) {
          data[i].totalRevenue += data[k].sumRevenue;
          data[i].totalInvestment += data[k].sumInvestment;
        }       
      }
      data.forEach(date => {
        date.sumProfit = date.sumRevenue - date.sumInvestment;
        date.totalProfit = date.totalRevenue - date.totalInvestment;
      })

      const labels = data.map((r) => r.label);
      const datas =
        targetType == 1
          ? [
              {
                data: data.map((d) => d.sumInvestment),
                type: "line",
                label: "Total Investment",
                backgroundColor: data.map((d) => categoryColorMap(d.label)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.sumRevenue),
                type: "line",
                label: "Total Revenue",
                backgroundColor: data.map((d) => categoryColorMap(d.label)),
                borderColor: borderColors[1],
              },
              {
                data: data.map((d) => d.sumProfit),
                type: "line",
                label: "Total Profit",
                backgroundColor: data.map((d) => categoryColorMap(d.label)),
                borderColor: borderColors[2],
              },
            ]
          : targetType == 2
          ? [
              {
                data: data.map((d) => d.sumBuyQuantity),
                type: "line",
                label: "Total quantity imported",
                backgroundColor: data.map((d) => categoryColorMap(d.label)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.sumQuantity),
                type: "line",
                label: "Total Amount Sold",
                backgroundColor: data.map((d) => categoryColorMap(d.label)),
                borderColor: borderColors[1],
              },
            ]
          : [
              {
                data: data.map((d) => d.totalInvestment),
                type: "line",
                label: "Accumulated Investment",
                backgroundColor: data.map((d) => categoryColorMap(d.label)),
                borderColor: borderColors[0],
              },
              {
                data: data.map((d) => d.totalRevenue),
                type: "line",
                label: "Accumulated Revenue",
                backgroundColor: data.map((d) => categoryColorMap(d.label)),
                borderColor: borderColors[1],
              },
              {
                data: data.map((d) => d.totalProfit),
                type: "line",
                label: "Accumulated Profit",
                backgroundColor: data.map((d) => categoryColorMap(d.label)),
                borderColor: borderColors[2],
              },
            ];
      return { datas, labels, data };
    },
  },
  {
    label: "Inventory",
    value: "inventory",
    order: 1,
    targetTypes: [
      { label: "Product", value: 0 },
      { label: "Brand", value: 1 },
      { label: "Category", value: 2 },
    ],
    handle: (products, shape, targetType = 0) => {
      const records = [...products].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      const brands = [
        ...new Set(
          records.map((product) => ({ quantity: 0, name: product.brand.name }))
        ),
      ].sort((a, b) => a.name.localeCompare(b.name));
      const categories = [
        ...new Set(
          records.map((product) => ({
            name: product.category.title,
            quantity: 0,
          }))
        ),
      ].sort((a, b) => a.name.localeCompare(b.name));

      records.forEach((product) => {
        const brand = brands.find((b) => b.name == product.brand.name);
        brand.quantity += product.quantity;
        const category = categories.find(
          (c) => c.name == product.category.title
        );
        category.quantity += product.quantity;
      });

      const datas = [
        {
          data: records.map((d) => d.quantity),
          type: "bar",
          label: "Product inventory",
          backgroundColor: records.map((d) => categoryColorMap(d.name)),
          borderColor: borderColors[0],
          labels: records.map((r) => r.name),
        },
        {
          data: brands.map((d) => d.quantity),
          type: "pie",
          label: "Brand inventory",
          backgroundColor: brands.map((d) => categoryColorMap(d.name)),
          borderColor: borderColors[1],
          labels: brands.map((b) => b.name),
          hoverOffset: 20,
        },
        {
          data: categories.map((d) => d.quantity),
          type: "pie",
          label: "Category inventory",
          backgroundColor: categories.map((d) => categoryColorMap(d.name)),
          borderColor: borderColors[2],
          labels: categories.map((c) => c.name),
          hoverOffset: 20,
        },
      ];
      return { datas: [datas[targetType]], labels: datas[targetType].labels, data: records };
    },
  },
].sort((a, b) => a.order - b.order);
