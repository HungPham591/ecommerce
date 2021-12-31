import { notification } from "antd";

const errorNotification = (err) => {
  const { status, data } = err.response || {
    status: 500,
    data: { message: "Something is wrong from the Server" },
  };

  switch (status) {
    case 401:
      notification.error({
        message: "Unauthorized",
        description: data.message,
      });
      break;
    case 403:
      notification.error({
        message: "Forbidden",
        description: data.message,
      });
      break;
    case 404:
      notification.warning({
        message: "No data",
        description: data.message,
      });
      break;
    default:
      notification.error({
        message: "Something is wrong",
        description: !!data.error?.errors?.length
          ? data.error.errors[0].message
          : data.message,
      });
  }
};

const getDeepErrorMessage = (err) => {
  const { data } = err.response || {
    data: { message: "Something is wrong from the Server" },
  };
  return !!data.error?.errors?.length
    ? data.error.errors[0].message
    : data.message;
};

export { getDeepErrorMessage };
export default errorNotification;
