import { Loader2 } from 'lucide-react'
import React, { Suspense } from 'react'

const Layout = ({ children }) => {
  return (
    <div className="p-4">
      <Suspense fallback={<Loader2 className="animate-spin w-5 h-5" />}>
        {children}
      </Suspense>
    </div>
  )
}

export default Layout
