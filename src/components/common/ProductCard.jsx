// product cards have fixed sizing

export default function ProductCard({ children }) {
  return (
    <div className='bg-white rounded-lg shadow p-4 flex items-center justify-center h-48 dark:bg-gray-800 dark:text-white'>
      {children}
    </div>
  );
}
