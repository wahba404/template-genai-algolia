import { Carousel as CarouselComponent } from "flowbite-react";

export default function Carousel() {
  return (
    <div className="flex-1 h-56 sm:h-64 xl:h-80 2xl:h-96">
      <CarouselComponent>
        <img
          src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
          alt="..."
        />
        <img
          src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
          alt="..."
        />
        <div className="bg-red-700 rounded-lg shadow p-4 h-64 flex items-center justify-center">
          Item 3
        </div>
        <img
          src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
          alt="..."
        />
        <img
          src="https://flowbite.com/docs/images/carousel/carousel-4.svg"
          alt="..."
        />
        <img
          src="https://flowbite.com/docs/images/carousel/carousel-5.svg"
          alt="..."
        />
      </CarouselComponent>
    </div>
  );
}
