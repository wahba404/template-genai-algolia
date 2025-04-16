import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Footer from "../components/common/Footer";
import Carousel from "../components/common/Carousel";
import GroupCard from "../components/common/GroupCard";
import ProductCard from "../components/common/ProductCard";
import ChatInterface from "../components/ChatInterface";
import Hit from "../components/Hit";
import AlgoliaLoadingIndicator from "../components/AlgoliaLoadingIndicator";
import { TextInput } from "flowbite-react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Configure,
  Hits,
  Highlight,
  RefinementList,
  CurrentRefinements,
  Pagination,
} from "react-instantsearch";
import { simple } from "instantsearch.js/es/lib/stateMappings";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY
);

function Home() {
  // Retrieve current cart from local storage
  const [currentCart, setCurrentCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  // Calculate the total amount
  const totalQuantity = currentCart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Clear past purchases
  const clearPastPurchases = () => {
    localStorage.removeItem("pastPurchases");
    // refresh the page
    window.location.reload();
  };

  const routing = {
    stateMapping: simple(),
  };

  //   scroll
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  //

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 max-w-full mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-x-6 gap-y-1 dark:bg-gray-900">
        <InstantSearch
          searchClient={searchClient}
          indexName={import.meta.env.VITE_ALGOLIA_INDEX_NAME}
          routing={routing}
          insights
        >
          <Configure hitsPerPage={4} />
          {/* ------------------ */}
          {/* Top Section: Search Bar */}
          {/* ------------------ */}
          <header className="col-span-2">
            <div className="mb-4">
              <SearchBox
                placeholder=""
                classNames={{
                  root: "relative",
                  input:
                    "w-full p-3 border-2 border-gray-700 rounded placeholder:text-xl dark:text-white dark:cursor-white",
                  submit: "hidden",
                  reset: "hidden",
                }}
              />
            </div>
          </header>

          {/* Right: Chat Interface */}
          <ChatInterface />

          {/* ------------------ */}
          {/* Row 2, Cols 1-2: Product Grid */}
          {/* ------------------ */}
          <section className="mt-6 col-span-2">
            <AlgoliaLoadingIndicator />
            <Hits
              hitComponent={({ hit }) => (
                <Hit hit={hit} highlight={Highlight} />
              )}
              classNames={{
                list: "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6",
                item: "",
              }}
            />
            <Pagination
              className="flex justify-center mt-4"
              classNames={{
                list: "flex justify-center px-4 rounded-md dark:bg-gray-800 dark:text-white",
                item: "px-4",
                selectedItem: "bg-blue-300 rounded",
              }}
            />
          </section>

          {/* ------------------ */}
          {/* Bottom Section: Groups and Carousel */}
          {/* ------------------ */}
          <section className="mt-6 col-span-4 flex items-start gap-6">
            <GroupCard>Group 1</GroupCard>
            <GroupCard>Group 2</GroupCard>
            <Carousel />
          </section>
          {/* include a floating cart button in the bottom right */}
            <Link
                to="/cart"
                className={`fixed bottom-4 right-4 bg-blue-200 text-white p-6 rounded-full shadow-lg hover:bg-blue-100 transition-transform transform ${
                isScrolled ? "scale-100" : "scale-0"
                }`}
            >
                <span className="text-xl font-bold text-black">🛒 {totalQuantity}</span>
            </Link>
        </InstantSearch>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
