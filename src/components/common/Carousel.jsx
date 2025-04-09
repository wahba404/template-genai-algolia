// simple but custom carousel with horzontal scroll
import CarouselCard from './Carousel-Card';

export default function Carousel() {
  return (
    <div className='flex-1 overflow-x-auto border border-gray-200 rounded-lg p-4'>
      <div className='flex gap-6'>
        <CarouselCard>Item 1</CarouselCard>
        <CarouselCard>Item 2</CarouselCard>
        <CarouselCard>Item 3</CarouselCard>
        <CarouselCard>Item 4</CarouselCard>
      </div>
    </div>
  );
}
