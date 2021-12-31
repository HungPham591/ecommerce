import { useHistory } from "react-router-dom";

export function getLinksFromPathname(pathname) {
  const seperateLinks = pathname.split("/").filter((link) => link);
  const links = ["/"];
  for (let i = 0; i < seperateLinks.length; i++) {
    links.push(
      links[links.length - 1].concat((i > 0 ? "/" : "") + seperateLinks[i])
    );
  }
  return links;
}

export function getScreenSize(size) {
  const sizeMap = {
    xs: 416,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  };
  if (sizeMap[size] == undefined) throw new Error("Invalid input");
  return sizeMap[size];
}

export function mailValidatorNotNull(_, value) {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,4}$/im;
  return regex.test(value)
    ? Promise.resolve()
    : Promise.reject(new Error("phone is not in the correct format"));
}
export function mailValidatorCanNull(_, value) {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,4}$/im;
  return regex.test(value) || !value
    ? Promise.resolve()
    : Promise.reject(new Error("phone is not in the correct format"));
}

export function getStringScreenSize(size) {
  const sizeMap = {
    xs: 416,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  };
  if (size < sizeMap.sm) return "xs";
  if (size < sizeMap.md) return "sm";
  if (size < sizeMap.lg) return "md";
  if (size < sizeMap.xl) return "lg";
  if (size < sizeMap.xxl) return "xl";
  return "xxl";
}

export function getFilter(records, arrayField) {
  if (!Array.isArray(arrayField))
    throw new Error("getFilter get incorrect param");

  const getValueRecord = (record) => {
    let res = record[arrayField[0]];
    for (let i = 1; i < arrayField.length; i++) {
      res = res[arrayField[i]];
    }
    return res;
  };

  const result = [...new Set(records.map(getValueRecord))].map((r) => ({
    text: r,
    value: r,
  }));
  return {
    filters: result,
    onFilter: (value, record) => getValueRecord(record)?.includes?.(value) || getValueRecord(record) === value,
  };
}
