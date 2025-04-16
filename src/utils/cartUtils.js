export const addToCart = (item, setNotification) => {
    // Retrieve current cart from local storage
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Check if the item is already in the cart
    const itemInCart = currentCart.find((cartItem) => cartItem.objectID === item.objectID);
  
    // If the item is already in the cart, increase the quantity, else add it
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      currentCart.push({
        objectID: item.objectID,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        color: item.color,
        quantity: 1,
      });
    }
  
    // Save the updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(currentCart));
  
    // Display a notification
    setNotification(`Item ${item.objectID} added to cart`);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };