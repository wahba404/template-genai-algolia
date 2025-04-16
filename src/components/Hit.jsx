import { useState } from "react";
import { Link } from "react-router";
import { addToCart } from "../utils/cartUtils";

function Hit({ hit, highlight: Highlight }) {
  const [notification, setNotification] = useState("");

  const handleAddToCart = () => {
    const item = {
      objectID: hit.objectID,
      name: hit.name,
      price: hit.price,
      image: hit.primary_image,
      category: hit.list_categories?.[0],
      color: hit.color?.original_name,
    };

    addToCart(item, setNotification);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col dark:bg-gray-800 dark:text-white"   style={{ width: "300px", height: "350px" }}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <Link
          to={`/product/${encodeURIComponent(hit.objectID)}`}
          className="flex justify-center items-center"
        >
          <img
            src={hit["primary_image"]}
            alt={hit["name"]}
            className="mb-2 w-full h-48 object-cover rounded"
          />
        </Link>

        <p className="text-xs text-gray-500 dark:text-gray-400 ">{hit["list_categories"][0]}</p>

        <Highlight
          attribute="name"
          hit={hit}
          tagName="h2"
          className="text-lg font-semibold mb-1 text-center break-words line-clamp-2"
        />
        <p className="text-base text-green-700 dark:text-green-400">
          ${hit["price"]["value"].toFixed(2)}
        </p>
      </div>

      <div className="flex justify-center space-x-3 items-end">
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded transition"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <Link to={`/product/${encodeURIComponent(hit.objectID)}`}>
          <button className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded transition">
            View Details
          </button>
        </Link>
      </div>
      {notification && (
        <div className="fixed top-24 right-1 mt-2 mr-2 bg-green-500 bg-opacity-75 text-white text-lg px-6 py-4 rounded">
          <Link to="/cart" className="flex">
            {notification}
          </Link>
        </div>
      )}
    </div>
  );
}

export default Hit;
