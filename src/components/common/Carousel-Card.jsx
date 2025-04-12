// carousel cards have custom sizing

export default function CarouselCard({ children }) {
  return (
    <div className='bg-white rounded-lg shadow p-4 min-w-[200px] h-64 flex items-center justify-center dark:bg-gray-800 dark:text-white'>
      {children}
    </div>
  );
}
