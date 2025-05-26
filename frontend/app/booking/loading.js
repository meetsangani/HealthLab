export default function Loading() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
          
          <div className="border rounded-md p-6 mb-4 space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            
            <div className="space-y-2">
              <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            
            <div className="h-12 bg-gray-200 rounded-md mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
