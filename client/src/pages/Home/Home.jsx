import { Button, Card, Carousel, Divider, List, Skeleton } from "antd";
import Title from "antd/lib/typography/Title";
import useListItem from "components/hooks/useListItem";
import LoadingScreen from "components/LoadingScreen";
import CustomAvatar from "components/unit-components/CustomAvatar";
import { getStringScreenSize } from "helpers/logicFunctions";
import ProductItem from "pages/Products/ProductItem/ProductItem";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import HomeCarousel from "./HomeCarousel";

const allCateSrc = 'images/app/all-product.jpg';

export default function Home() {
  const history = useHistory();
  const [categories, reloadCategories, cateLoadding, cateError] =
    useListItem("categories");
  const [products, reloadProdust, productLoading] =
    useListItem("products?forshop=1");
  const [bestSeller, reloadSeller, bestSellerLoading] =
    useListItem(`products/bestseller`);
  const [forYou, setForYou, forYouLoading] = useListItem(`products/foryou`);
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

  const newProducts = [...products]
    .sort((a, b) => b.starts_at?.localeCompare(a.starts_at))
    .slice(0, 15);

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
    <div className="container-fluid">
      {/* <Divider>
        <Link to={`/shopping`}>
          <Button
            type="primary"
            style={{
              fontWeight: "bold",
              height: 48,
              padding: "0px 48px",
              borderRadius: "50%",
            }}
          >
            GO TO SHOP NOW
          </Button>
        </Link>
      </Divider>

      <Title level={5} style={{ textAlign: "center" }}>
        Or
      </Title> */}

      <Divider>
        <Title level={2}>Shop by Category</Title>
      </Divider>

      {cateLoadding ? (
        <Skeleton active />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
            xl: 6,
            xxl: 6,
          }}
          style={{ background: "white" }}
          className="product-list"
          dataSource={[{title: 'All', avatar: allCateSrc, id: 'all'},...categories]}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card
                className="product-item"
                title={item.title}
                hoverable={true}
                bordered={false}
                onClick={() => history.push(`/shopping?type=${item.title === 'All' ? '' : item.title}`)}
                cover={
                  <CustomAvatar
                    src={item.avatar}
                    disable={true}
                    size={"100%"}
                    type="image"
                  />
                }
              />
            </List.Item>
          )}
        />
      )}

      {forYou.length > 0 && (
        <HomeCarousel
          title="Inspired by Your Shopping"
          products={forYou}
          numPerWidth={numProductForWidth}
        />
      )}

      {bestSellerLoading ? (
        <Skeleton active />
      ) : (
        <HomeCarousel
          title="Best Seller"
          products={bestSeller}
          numPerWidth={numProductForWidth}
        />
      )}

      {productLoading ? (
        <Skeleton active />
      ) : (
        <HomeCarousel
          title="New"
          products={newProducts}
          numPerWidth={numProductForWidth}
        />
      )}

      <Divider style={{ marginTop: 64 }}>
        <Button
          type="primary"
          shape="round"
          style={{
            fontWeight: "bold",
            height: 48,
            padding: "0px 32px",
            borderRadius: "50%",
          }}
          onClick={() => window.scrollTo(0, 0)}
        >
          GO TOP
        </Button>
      </Divider>
    </div>
  );
}
