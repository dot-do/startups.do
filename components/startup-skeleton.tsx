export function StartupSkeleton() {
  return (
    <main className="container mx-auto max-w-3xl py-8 space-y-8">
      {/* Hero skeleton */}
      <div className="text-center space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded-md w-3/4 mx-auto" />
        <div className="h-4 bg-muted animate-pulse rounded-md w-1/2 mx-auto" />
      </div>
      
      {/* Content sections skeleton */}
      <div className="space-y-6">
        <div className="h-6 bg-muted animate-pulse rounded-md w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded-md" />
          <div className="h-4 bg-muted animate-pulse rounded-md w-5/6" />
          <div className="h-4 bg-muted animate-pulse rounded-md w-4/6" />
        </div>
      </div>
      
      {/* Features skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border rounded-md space-y-2">
            <div className="h-5 bg-muted animate-pulse rounded-md w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded-md" />
            <div className="h-3 bg-muted animate-pulse rounded-md w-2/3" />
          </div>
        ))}
      </div>
    </main>
  )
}
