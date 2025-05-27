import { Loader2 } from 'lucide-react'
import React, { Suspense } from 'react'

const Layout = ({ children }) => {
  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Industry Insights</h1>
      </div>
      <Suspense fallback={<Loader2 className="animate-spin w-5 h-5" />}>
        {children}
      </Suspense>
    </div>
  )
}

export default Layout
