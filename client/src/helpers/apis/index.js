export function productAPI(pro) {
  const {
    id_product: id,
    name_product: name,
    brand: { id_brand, name_brand },
    category: { id_category, name_category },
    description,
    price,
    image,
  } = pro;

  return {
    id,
    name,
    brand: {
      id: id_brand,
      name: name_brand,
    },
    category: {
      id: id_category,
      name: name_category,
    },
    description,
    price,
    image,
  };
}
export function brandAPI() {}
export function categoryAPI() {}
