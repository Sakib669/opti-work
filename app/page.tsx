import { Home, User, Settings } from 'lucide-react'

// Define interfaces for type safety
interface UserData {
  id: string
  name?: string
  email: string
  image?: string
}

import { prisma } from '@/lib/db'

export default async function Dashboard() {
  // For demonstration: fetching the first user.
  // In a real app, you would use auth() from next-auth to get the session user ID.
  const user = await prisma.user.findFirst()
  const displayName = user?.name ?? 'Guest'
  const email = user?.email ?? 'No email'

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Home className="mr-2" />
          Optiwork Dashboard
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="mr-2" />
            Welcome, {displayName}
          </h2>
          <p className="text-gray-600">Email: {email}</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Settings className="mr-2" />
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}