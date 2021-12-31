import { Avatar } from "antd";
import { Link } from "react-router-dom";

const LinkToHome = () => {
  return (
    <Link to="/">
      <Avatar
        size={64}
        src={process.env.REACT_APP_AVATAR_URL}
        style={{ marginTop: 24, marginBottom: 8 }}
      ></Avatar>
    </Link>
  );
};

export default LinkToHome;
