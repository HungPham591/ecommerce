import { Avatar, Comment, Rate, Tooltip } from "antd";
import React from "react";
import moment from "moment";
import Text from "antd/lib/typography/Text";
import CustomAvatar from "components/unit-components/CustomAvatar";
import { useHistory } from "react-router-dom";

const ProductReview = ({ review, isSA, subTitle }) => {
  const history = useHistory();
  return (
    <Comment
      author={
        <>
          <Text strong>{review.title}</Text>         
          <Rate
            style={{ color: "black", fontSize: "0.5rem", display: "block" }}
            disabled
            value={review.rating}
            allowHalf
          />
          <Text
            style={isSA && {color: 'blue'}}
            className={isSA ? `horver_cursor` : ""}
            onClick={
              isSA ? () => history.push(`/user?id=${review.user.id}`) : null
            }
          >
            {review.user.first_name + " " + review.user.last_name}
          </Text>
          {subTitle && subTitle}
        </>
      }
      avatar={<CustomAvatar size={32} src={review.user.avatar} />}
      content={<p>{review.content}</p>}
      datetime={
        <Tooltip
          title={moment(review.created_at).format("YYYY-MM-DD HH:mm:ss")}
        >
          <span>{moment(review.created_at).fromNow()}</span>
        </Tooltip>
      }
    />
  );
};

export default ProductReview;
