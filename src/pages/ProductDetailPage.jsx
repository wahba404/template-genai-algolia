import { useEffect, useState } from "react";
import { algoliasearch } from "algoliasearch";
import { liteClient } from "algoliasearch/lite";
import { useParams, Link } from "react-router";
import {
  InstantSearch,
  LookingSimilar,
  Carousel,
  Highlight,
} from "react-instantsearch";
import Hit from "../components/Hit";
import { addToCart } from "../utils/cartUtils";
import DefaultModal from "../components/common/DefaultModal";
import ChatInterface from "../components/ChatInterface";
import { useChat } from "../context/ChatContext";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY
);

const search2 = liteClient(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY
);

// --------------------------------------------------------------------------------
// dummy default product data
const product = {
  id: 1,
  name: "Sample Product",
  category: "Sample Category",
  description: "This is a detailed description of the sample product.",
  price: 29.99,
  imageUrl: "https://via.placeholder.com/300",
};
// --------------------------------------------------------------------------------

function ProductDetailPage() {
  const { id } = useParams();
  const objectID = decodeURIComponent(id);
  const [response, setResponse] = useState(null);
  const [notification, setNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addLlmMessage } = useChat();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await searchClient.getObject({
          indexName: import.meta.env.VITE_ALGOLIA_INDEX_NAME,
          objectID: objectID,
          attributesToRetrieve: ["*"],
        });
        setResponse(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [objectID]);

  useEffect(() => {
    const addResponse = async () => {
      if (response && response.objectID) {
        const item = {
          objectID: response.objectID,
          name: response.name,
          brand: response.brand,
          description: response.description,
          price: response.price.value,
          image: response.primary_image,
          category: response.list_categories,
          reviews: response.reviews,
          hierarchical_categories: response.hierarchical_categories,
          color: response.color.original_name,
        };
        const base64Image = await imageToBase64(response.primary_image);

        const systemMessage = {
          role: "system",
          content: `Current Product Page: ${JSON.stringify(item)}`,
          //   images: [base64Image]
        };

        addLlmMessage(systemMessage);
      }
    };
    addResponse();
  }, [response]);

  async function imageToBase64(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const handleAddToCart = () => {
    if (!response) return;

    const item = {
      objectID: response.objectID,
      name: response.name,
      price: response.price.value,
      image: response.primary_image,
      category: response.list_categories?.[0],
      color: response.color?.original_name,
    };

    addToCart(item, setNotification);
  };

  return (
    <div className="container mx-auto p-8 relative">
      <div className="absolute top-4 left-4 flex space-x-4">
        <Link
          to="/"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
        >
          Back to Home
        </Link>
        <Link
          to="/cart"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
        >
          Go to Cart
        </Link>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Chat
        </button>
      </div>
      <article className="flex flex-col items-center">
        <img
          src={response?.["primary_image"] || product.imageUrl}
          alt={response?.["name"] || product.name}
          className="w-1/2 max-w-xs h-auto mb-4 rounded"
        />
        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          {response?.["name"] || product.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {response?.["list_categories"][0] || product.category}
        </p>
        <p className="text-lg text-green-600 dark:text-green-400">
          ${response?.["price"]["value"] || product.price}
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          {response?.["description"] || product.description}
        </p>
        {/*  */}

        <div className="relative flex justify-center items-center space-x-2 mt-2">
          <button
            className="bg-green-500 text-white text-xl px-8 py-1.5 rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          {notification && (
            <div className="absolute top-full mt-2 w-[64rem] bg-green-500 bg-opacity-75 text-white text-lg px-6 py-4 rounded">
              <Link to="/cart" className="flex">
                {notification}
              </Link>
            </div>
          )}
        </div>
      </article>
      <div className="container mx-auto p-8 mt-4">
        <div className="border-b border-gray-300 mb-4"></div>
        <div className="mt-12 w-full flex justify-start items-start">
          <p className="w-full text-start text-xl font-semibold dark:text-white">
            Similar Products
          </p>
        </div>
        {/* {response?.objectID ? (
          <InstantSearch
            searchClient={search2}
            indexName={import.meta.env.VITE_ALGOLIA_INDEX_NAME}
          >
            <LookingSimilar
              objectIDs={[response?.objectID]}
              limit={5}
              itemComponent={({ item }) => (
                <Hit hit={item} highlight={Highlight} />
              )}
              classNames={{
                title: "hidden",
                root: "w-full overflow-x-scroll flex justify-start items-start",
                list: "mt-4 w-full overflow-x-scroll flex justify-start items-start",
                item: "mr-4 p-1 border-2 border-gray-200 rounded shadow-md flex-shrink-0 w-64",
              }}
            />
          </InstantSearch>
        ) : (
          <p>No similar products found</p>
        )} */}
      </div>
      {/* Chat Modal */}
      <DefaultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Chat with us"
        className="w-full max-w-2xl"
      >
        <ChatInterface />
      </DefaultModal>
    </div>
  );
}
export default ProductDetailPage;
