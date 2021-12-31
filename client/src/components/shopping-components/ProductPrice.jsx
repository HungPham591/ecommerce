import React from "react";
import './style.scss'

const ProductPrice = ({price}) => {
  const subprice = Math.floor((price * 100) % 100);
  const mainprice = Math.floor(price);

  return (
    <span className="product-price">
      <span className="sub-text">$</span>
      {mainprice}
      {subprice !== 0 && (
        <span className="sub-text" style={{ fontWeight: 400 }}>
          .{subprice}
        </span>
      )}
    </span>
  );
};

export default ProductPrice;
