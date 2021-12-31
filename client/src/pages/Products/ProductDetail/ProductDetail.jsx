import {
  Col,
  Divider,
  message,
  Row,
  Rate,
  Progress,
  Comment,
  Button,
} from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import ErrorHandler from "components/ErrorHandler";
import useListItem from "components/hooks/useListItem";
import useOneItem from "components/hooks/useOneItem";
import useQuery from "components/hooks/useQuery";
import LoadingScreen from "components/LoadingScreen";
import CustomAvatar from "components/unit-components/CustomAvatar";
import errorNotification from "helpers/errorNotification";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import clientAxios from "services/axios/clientAxios";
import { AppContext } from "utilities/app";
import ProductImage from "./Components/ProductImage";
import ProductInfo from "./Components/ProductInfo";
import ProductReview from "./Components/ProductReview";
import ReviewEditor from "./Components/ReviewEditor";
import HomeCarousel from "pages/Home/HomeCarousel";
import "./style.scss";

const ProductDetail = () => {
  const routerHistory = useHistory();
  const { state, dispatch } = useContext(AppContext);

  const query = useQuery();
  const productId = query.get("id");

  const [product, reloadProduct, loading, error] = useOneItem(
    `/products/${productId}`
  );
  const [reviews, reloadReviews, loaddingReview, errorReview] = useListItem(
    `/reviews?product_id=${productId}`,
    { sortBy: (a, b) => b.created_at.localeCompare(a.created_at) }
  );
  const [numOfLoadedReview, setNumOfLoadedReview] = useState(5);

  const [relatedProducts, reloadRelatedProducts] = useListItem(
    `products/${productId}/related`
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    reloadProduct();
    reloadReviews();
  }, [query]);

  const handleAddReview = async (title, content, stars) => {
    try {
      const newReview = {
        product_id: productId,
        title,
        content,
        rating: stars,
      };
      const { data } = await clientAxios.post(`/reviews`, newReview);

      message.success(`success`);

      reloadProduct();
      reloadReviews();
    } catch (err) {
      if (err.response.status === 401) {
        setTimeout(() => routerHistory.push("/auth/signin"), 2000);
      }

      errorNotification(err);
    }
  };

  const handleAddToCard = async (quantity) => {
    if (!state.isSignIn) {
      const oldCart = JSON.parse(localStorage.getItem("cartItems"));

      let newCart;
      if (oldCart) {
        const existItem = oldCart.find((item) => item.product_id == productId);
        if (existItem) {
          newCart = oldCart.map((i) =>
            i.product_id === existItem.product_id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          newCart = [...oldCart, { product_id: productId, quantity }];
        }
      } else {
        newCart = [{ product_id: productId, quantity }];
      }

      localStorage.setItem("cartItems", JSON.stringify(newCart));
      message.success(
        `${quantity} item(s) have been added to your shopping cart`
      );
      dispatch({ type: "RELOAD_CART" });
      return;
    }

    try {
      await clientAxios.post(`/cartitems`, {
        product_id: productId,
        quantity,
      });

      message.success(
        `${quantity} item(s) have been added to your shopping cart`
      );

      reloadProduct();
      reloadReviews();
    } catch (err) {
      if (err.response.status === 401) {
        setTimeout(() => routerHistory.push("/auth/signin"), 2000);
      }

      errorNotification(err);
    }
    dispatch({ type: "RELOAD_CART" });
  };

  if (error) return <ErrorHandler error={error} />;

  const sumStar =
    reviews.length > 0 &&
    reviews.map((r) => r.rating).reduce((a, b) => a + b, 0);
  const rateValue = reviews.length > 0 && sumStar / reviews.length;
  const rating = { value: rateValue, num: reviews.length };

  const myReview = reviews.find((r) => r.user.username === state.user.username);

  return loading ? (
    <LoadingScreen />
  ) : (
    <div>
      {product && (
        <Row gutter={24} className="product-detail">
          <Col span={24} md={12} style={{ marginBottom: 32 }}>
            <ProductImage
              type="image"
              images={product.productImages}
            ></ProductImage>
          </Col>
          <Col span={24} md={12}>
            <ProductInfo
              product={product}
              rating={rating}
              onAddCart={handleAddToCard}
            />
          </Col>
        </Row>
      )}
      <Divider orientation="left">
        <Title level={3} id="review">
          Reviews
        </Title>
      </Divider>
      {rating.value && (
        <>
          <Rate
            style={{ color: "gold" }}
            disabled
            value={rating.value}
            allowHalf
          />
          <Text strong style={{ marginLeft: 8 }}>
            {rating.value} out of 5 ({reviews.length})
          </Text>
          <div style={{ marginBottom: 16 }}>
            {[4, 3, 2, 1, 0].map((ind) => {
              const numReview = reviews.filter(
                (r) => r.rating === ind + 1
              ).length;
              const percent = (numReview / reviews.length) * 100;

              return (
                <Text key={ind} strong style={{ display: "block" }}>
                  {ind + 1} star:
                  <Progress
                    format={(per) => per + "%"}
                    percent={percent.toFixed(0)}
                    style={{ maxWidth: 300 }}
                  />
                </Text>
              );
            })}
          </div>
        </>
      )}
      <div style={{ maxWidth: 720 }}>
        {myReview && (
          <>
            <ProductReview
              key={myReview.id}
              subTitle={<Text type="success">{` (YOU)`}</Text>}
              review={myReview}
              isSA={state.user.role === "sa"}
            />
            <Divider />
          </>
        )}
        {reviews
          .filter((r) => r.user.username !== state.user.username)
          .slice(0, numOfLoadedReview)
          .map((review) => {
            return (
              <ProductReview
                key={review.id}
                review={review}
                isSA={state.user.role === "sa"}
              />
            );
          })}
        {reviews.length > numOfLoadedReview ? (
          <Divider>
            <Button
              type="primary"
              shape="round"
              onClick={() => setNumOfLoadedReview((pre) => pre + 5)}
            >
              More
            </Button>
          </Divider>
        ) : (
          <Divider />
        )}
        {state.isSignIn && !myReview && (
          <Comment
            avatar={<CustomAvatar size={32} src={state.user.avatar} />}
            content={<ReviewEditor handleSubmit={handleAddReview} />}
          />
        )}
      </div>
      <Divider orientation="left">
        <Title level={3}>Related products</Title>
      </Divider>
      <HomeCarousel products={relatedProducts}></HomeCarousel>
    </div>
  );
};

export default ProductDetail;
