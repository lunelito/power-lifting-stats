// components/ThemeTest.tsx
export default function ThemeTest() {
  return (
    <div className="p-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h1 className="text-black dark:text-white text-2xl font-bold">
          Theme Test
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          This should change colors with the theme
        </p>
        <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          This is a colored box that should change with theme
        </div>
      </div>
    </div>
  );
}