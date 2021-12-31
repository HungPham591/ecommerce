import { Spin } from "antd";

const LoadingScreen = () => {
  return (
    <Spin
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    />
  );
};
export default LoadingScreen;
