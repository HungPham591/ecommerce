import { Carousel, Divider, List } from "antd";
import Title from "antd/lib/typography/Title";
import { getStringScreenSize } from "helpers/logicFunctions";
import ProductItem from "pages/Products/ProductItem/ProductItem";
import React, { useEffect, useState } from "react";

const HomeCarousel = ({ products, title, numPerWidth }) => {
  const [screenSize, setScreenSize] = useState("lg");

  const resizehandle = () => {
    const size = getStringScreenSize(window.innerWidth);
    if (size != screenSize) {
      setScreenSize(size);
    }
  };
  useEffect(() => {
    resizehandle();
    const resize = window.addEventListener("resize", resizehandle);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const grid = {
    gutter: 16,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    xxl: 6,
  };

  const numProductForWidth = grid[screenSize];


  return (
    <>
      {title && (
        <Divider style={{ marginTop: 32 }}>
          <Title level={2}>{title}</Title>
        </Divider>
      )}

      <Carousel autoplay dotPosition="top" style={{ background: "white" }}>
        {[...Array(Math.ceil(products.length / (numPerWidth ?? numProductForWidth)))].map((_, ind) => {
          return (
            <List
              key={ind}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 5,
                xxl: 6,
              }}
              className="product-list"
              dataSource={products.slice(
                ind * (numPerWidth ?? numProductForWidth),
                (ind + 1) * (numPerWidth ?? numProductForWidth) 
              )}
              style={{ background: "white" }}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <ProductItem product={item} />
                </List.Item>
              )}
            />
          );
        })}
      </Carousel>
    </>
  );
};

export default HomeCarousel;
