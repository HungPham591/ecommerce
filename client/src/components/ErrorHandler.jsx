import { Result, Button } from "antd";
import { Link, useHistory } from "react-router-dom";

const ErrorHandler = ({ error }) => {
  const routerHistory = useHistory();
  let { status, data } = error;

  if (status == 401) {
    setTimeout(() => {
      routerHistory.push('/auth/signin');
    }, 2000);
    return (
      <Result
        title="Requires login"
        extra={
          <>
          <Link to="/auth/signin">
            <Button type="primary">Login</Button>
          </Link>
          <Link to="/">
            <Button>Back Home</Button>
          </Link>
        </>
        }
      />
    );
  }

  if (![404, 500, 403].includes(status)) status = "error";

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <Result
      status={status || 500}
      title={status || "500"}
      subTitle={data.message}
      extra={
        <>
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
          <Button onClick={reloadPage}>Reload page</Button>
        </>
      }
    />
  );
};

export default ErrorHandler;
