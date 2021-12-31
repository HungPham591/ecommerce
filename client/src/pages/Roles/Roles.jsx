import { useState } from "react";
import { Tabs } from "antd";
import useListItem from "components/hooks/useListItem";
import RoleItem from "./RoleItem/RoleItem";
import "./style.scss";
import ErrorHandler from "components/ErrorHandler";
import LoadingScreen from "components/LoadingScreen";

const { TabPane } = Tabs;

const RoleList = () => {
  const [roles, reloadRoles, loading, error] = useListItem("roles", {sortBy: 'id'});
  const [showUsers, setShowUsers] = useState(true);

  if (error) return <ErrorHandler error={error} />;

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="site-card-wrapper">
      <Tabs onChange={null} type="card">
        {roles.map((role) => {
          return (
            <TabPane tab={role.name} key={role.id}>
              <RoleItem
                role={role}
                showUsers={showUsers}
                setShowUsers={setShowUsers}
                reloadRoles={reloadRoles}
              />
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default RoleList;
