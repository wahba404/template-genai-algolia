// Default attributes mapping
// Change the attribute values to match your data
export const ProductAttributes = {
    objectID: "objectID",
    name: "name",
    brand: "brand",
    description: "description",
    price: "price.value",
    image: "primary_image",
    category: "list_categories.0",
    reviews: "reviews",
    hierarchical_categories: "hierarchical_categories",
    color: "color.original_name",
  };

//   Default refinement attributes mapping
//   Change the attribute values to match your data
export const RefinementAttributes = {
    category: "list_categories.0",
    color: "color.original_name",
    brand: "brand",
};
