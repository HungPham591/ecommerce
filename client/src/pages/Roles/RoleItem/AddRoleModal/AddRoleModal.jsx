import { Checkbox, List, Modal } from "antd";
import useListItem from "components/hooks/useListItem";
import CustomAvatar from "components/unit-components/CustomAvatar";
import EmailTag from "components/unit-components/EmailTag";
import PhoneTag from "components/unit-components/PhoneTag";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const AddRoleModal = ({ role, visible, onCancel, onAdd }) => {
  const [allUsers, reloadAllUsers, loading, error] = useListItem("users", {
    filter: (u) => u.role_id != role.id,
  });
  const [selectedUserId, setSelectedUserId] = useState([]);

  useMemo(() => {
    if (!visible) {
      setSelectedUserId([]);
    }
  }, [visible]);

  const changeCheckedUser = (e, id) => {
    if (e.target.checked) {
      setSelectedUserId([...selectedUserId, id]);
    } else {
      setSelectedUserId(selectedUserId.filter((userId) => userId != id));
    }
  };

  allUsers.sort((curr, next) => curr.first_name.localeCompare(next.first_name));

  const handleCancel = () => {
    setSelectedUserId([]);
    onCancel();
  };

  return (
    <Modal
      title={`Add ${role.name} Role To Users`}
      visible={visible}
      centered
      onCancel={handleCancel}
      onOk={() => onAdd(selectedUserId)}
    >
      <List
        itemLayout="horizontal"
        dataSource={allUsers}
        header="Select users you want to add this permission to..."
        pagination={{ pageSize: 5 }}
        renderItem={(user) => (
          <List.Item
            extra={
              <Checkbox
                checked={selectedUserId.includes(user.id)}
                onChange={(e) => changeCheckedUser(e, user.id)}
              />
            }
            key={user.id}
          >
            <List.Item.Meta
              avatar={<CustomAvatar src={user.avatar} />}
              title={
                <Link to={`user/${user.id}`}>
                  {user.first_name} - {user.last_name}
                </Link>
              }
              description={
                <>
                  <EmailTag email={user.email} />
                  {user.phone && <PhoneTag phone={user.phone} />}
                </>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default AddRoleModal;
