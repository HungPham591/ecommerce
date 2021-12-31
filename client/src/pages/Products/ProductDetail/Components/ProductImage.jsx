import useResizeWindow from "components/hooks/useResizeWindow";
import CustomAvatar from "components/unit-components/CustomAvatar";
import React, { useEffect, useState } from "react";

const ProductImage = ({ images }) => {
  const [currentImg, setCurrentImg] = useState(images?.sort((a, b) => b.priority - a.priority)[0] || null);
  const [size] = useResizeWindow();

  useEffect(() => {
    setCurrentImg(images[0] || null);
  }, [images]);

  const handleSetCurrentImg = (id) => {
    const newImg = images.find((img) => img.id === id);
    setCurrentImg(newImg);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <CustomAvatar type="image" size={"100%"} src={currentImg?.src} />
      <div
        style={{
          overflow: "auto",
          display: "flex",
          flexDirection: "row",
          maxHeight: 80 * 4,
        }}
      >
        {images &&
          images.map((img, ind) => {
            return (
              <div onClick={() => handleSetCurrentImg(img.id)} key={img.id}>
                <CustomAvatar
                  type="image"
                  size={80}
                  src={img.src}
                  disable={true}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProductImage;
