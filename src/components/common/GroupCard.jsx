// group cards have fixed sizing

export default function GroupCard({ children }) {
  return (
    <div className='bg-white rounded-lg shadow p-4 w-64 h-128 flex items-center justify-center dark:bg-gray-800 dark:text-white'>
      {children}
    </div>
  );
}
