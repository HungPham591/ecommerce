import { Breadcrumb } from "antd";
import useQuery from "components/hooks/useQuery";
import { getLinksFromPathname } from "helpers/logicFunctions";
import { Link } from "react-router-dom";
import routes from "services/routes/routes-config";

export default function BreadcrumbRoute({ pathname }) {
  const links = getLinksFromPathname(pathname)

  const query = useQuery();
  const cateName = query.get("type");
  const brandName = query.get("brand");

  const cateBread = cateName && cateName !== 'All' && (
    <Breadcrumb.Item key='cate'>
      <Link to={`shopping?type=${cateName}`}>{cateName}</Link>
    </Breadcrumb.Item>
  );
  const brandBread = brandName && brandName !== 'All' && (
    <Breadcrumb.Item key='brand'>
      <Link to={`shopping?brand=${brandName}`}>{brandName}</Link>
    </Breadcrumb.Item>
  );

  if (links.includes('/shopping')) {

  }
  
  return (
      <Breadcrumb style={{ margin: "16px 0" }}>
        {routes
          .filter((route) => links.includes(route.path))
          .map((route, index) => {
            return (
              <Breadcrumb.Item key={index}>
                <Link to={route.path}>{route.name}</Link>
              </Breadcrumb.Item>
            );
          })}
          {cateBread && cateBread}
          {brandBread && brandBread}
      </Breadcrumb>
  );
}
