import { Button, Divider, List, Select, Space } from "antd";
import ProductItem from "./ProductItem/ProductItem";
import useListItem from "components/hooks/useListItem";
import { FilterFilled, ClearOutlined } from "@ant-design/icons";
import useQuery from "components/hooks/useQuery";
import { useContext, useEffect, useState } from "react";
import "./style.scss";
import { AppContext } from "utilities/app";
import ErrorHandler from "components/ErrorHandler";
import LoadingScreen from "components/LoadingScreen";
import ProductFilter from "./ProductFilter/ProductFilter";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory } from "react-router-dom";

const sortBys = [
  "Most interested",
  "Price: low to hight",
  "Price: high to low",
  "Highest Rating",
  "New",
];

export default function ProductList() {
  const query = useQuery();
  const cateName = query.get("type");
  const history = useHistory();
  const [categoryName, setCategoryName] = useState(null);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [brandFilter, setBrandFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("0|9999");
  const [starFilter, setStarFilter] = useState(0);
  const [sortBy, setSortBy] = useState(sortBys[0]);
  const [search, setSreach] = useState("");
  const [pagiNum, setPagiNum] = useState(1);

  useEffect(() => {
    const brand = query.get("brand");
    setBrandFilter(brand && brand != "All" ? brand : "");

    const cateName = query.get("type") || null;
    setCategoryName(cateName);

    const searchName = query.get("search") || "";
    setSreach(searchName);
  }, [query]);

  useEffect(() => {
    setPagiNum(1);
  }, [query, brandFilter, priceFilter, starFilter, sortBy, search]);

  const [products, reloadProducts, loading, error] = useListItem(
    `products?forshop=1${cateName && `&category=${cateName}`}` //&${brand && `brand=${brand}`}`
  );
  const { state } = useContext(AppContext);

  useEffect(() => {
    document.title =
      (cateName ? cateName + " | " : "") + `${process.env.REACT_APP_WEB_NAME}`;
  }, [query]);

  let productData = [...products];
  // productData = [...productData, ...productData, ...productData];

  // filter brand
  if (brandFilter && brandFilter != "All") {
    productData = productData.filter(
      (product) => product.brand.name == brandFilter
    );
  }

  // filer search
  if (search && search.length > 0) {
    productData = productData.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // for more data
  productData = productData.map((product) => {
    const newProduct = { ...product };
    newProduct.rating =
      newProduct.reviews.length > 0
        ? newProduct.reviews.reduce((a, b) => a + b.rating, 0) /
          newProduct.reviews.length
        : 0;
    newProduct.reviewNum = newProduct.reviews.length;
    return newProduct;
  });

  // filter star
  productData = productData.filter((product) => product.rating >= starFilter);

  // filter price
  productData = productData.filter((product) => {
    const priceFilters = priceFilter.split("|");
    return (
      product.price >= parseInt(priceFilters[0]) &&
      product.price < parseInt(priceFilters[1])
    );
  });

  // sort by
  switch (sortBy) {
    case sortBys[0]: {
      productData.sort((a, b) => b.rating - a.rating);
      productData.sort((a, b) => b.reviewNum - a.reviewNum);
      break;
    }
    case sortBys[1]: {
      productData.sort((a, b) => a.price - b.price);
      break;
    }
    case sortBys[2]: {
      productData.sort((a, b) => b.price - a.price);
      break;
    }
    case sortBys[3]: {
      productData.sort((a, b) => b.reviewNum - a.reviewNum);
      productData.sort((a, b) => b.rating - a.rating);
      break;
    }
    case sortBys[4]: {
      productData.sort((a, b) => b.starts_at?.localeCompare(a.starts_at));
      break;
    }
  }

  const onCloseFilter = () => {
    setVisibleFilter(false);
  };

  const onClearFilter = () => {
    setPriceFilter("0|9999");
    setStarFilter(0);
    setBrandFilter("");
    history.push(`/shopping?type=${categoryName || ""}&brand=${"All"}&search=${search}`)
  };

  const isCus = !["sa", "ad"].includes(state.user.role);

  const gridCus = {
    gutter: 16,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    xxl: 6,
  };

  if (error) return <ErrorHandler error={error} />;

  return loading ? (
    <LoadingScreen />
  ) : (
    <div>
      {search && <Title>Search results for '{search}'</Title>}
      <Title level={5}>
        ({productData.length > 99 ? "99+" : productData.length} products found)
      </Title>
      <div
        style={{
          display: "flex",
          marginBottom: 16,
          justifyContent: "space-between",
          lineBreak: true,
        }}
      >
        <div>
          <Button
            shape="round"
            type="primary"
            icon={<FilterFilled />}
            onClick={() => setVisibleFilter(true)}
          >
            Filter
          </Button>
        </div>

        <div>
          <span>Sort by: </span>
          <Select
            style={{ width: 170, fontWeight: 500 }}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
          >
            {sortBys.map((sort) => (
              <Select.Option key={sort} value={sort}>
                {sort}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <List
        grid={
          isCus
            ? gridCus
            : {
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 5,
              }
        }
        className="product-list"
        dataSource={productData}
        pagination={{
          pageSize: 20,
          current: pagiNum,
          onChange: (num) => {
            setPagiNum(num);
            window.scrollTo(0, 0);
          },
        }}
        renderItem={(pro) => {
          return (
            <List.Item key={pro.id}>
              <ProductItem product={pro} />
            </List.Item>
          );
        }}
      />
      <ProductFilter
        onClose={onCloseFilter}
        visible={visibleFilter}
        currentBrand={brandFilter}
        brand={brandFilter}
        setBrand={(newBrand) => setBrandFilter(newBrand)}
        price={priceFilter}
        setPrice={(newPrice) => setPriceFilter(newPrice)}
        onClear={onClearFilter}
        rating={starFilter}
        setRating={setStarFilter}
        cateName={categoryName}
        search={search}
      />
    </div>
  );
}
