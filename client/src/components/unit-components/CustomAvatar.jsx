import { Avatar, Button, Image,  Tooltip } from "antd";
import { FileImageOutlined, DeleteOutlined, AreaChartOutlined } from "@ant-design/icons";
import clientAxios from "services/axios/clientAxios";
import { useEffect, useState } from "react";

const CustomAvatar = ({ src, type = "avatar", size, onDelete, preview = true, disable = false, onChangeAvatar }) => {
  const [haveImage, setHaveImage] = useState(true);

  useEffect(() => {
    const loadImg = async () => {
      try {
        await clientAxios.get(src);
      } catch {
        setHaveImage(false);
      }
    };
    loadImg();
  }, []);

  if (!haveImage) return null;

  if (type === "image")
    return (
      <div
        className="ligned-flex"
        style={{
          display: "inline-flex",
          marginRight: 8,
        }}
      >
        <Image
          width={size || 64}
          height={size || 64}
          src={src ? `${process.env.REACT_APP_BASE_URL}/${src}` : "error"}
          fallback={`${process.env.REACT_APP_BASE_URL}/images/app/empty.jpg`}
          preview={preview}
          preview={!disable}
        />
        {onDelete && (
          <Tooltip title={"Remove image"}>
            <Button
              shape='circle'
              style={{ position: "absolute"}}
              size="small"
              type="primary"
              danger
              onClick={onDelete}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        )}
        {onChangeAvatar && (
          <Tooltip title={"Set avatar"}>
            <Button
              shape='circle'
              style={{ position: "absolute", marginLeft: 32}}
              size="small"
              onClick={onChangeAvatar}
              icon={<AreaChartOutlined />}
            />
          </Tooltip>
        )}
      </div>
    );

  return src ? (
    <Avatar
      size={size || 42}
      style={{ marginRight: 8 }}
      src={`${process.env.REACT_APP_BASE_URL}/${src}`}
    />
  ) : (
    <Avatar
      size={size || 42}
      style={{ marginRight: 8 }}
      icon={<FileImageOutlined />}
    />
  );
};

export default CustomAvatar;
