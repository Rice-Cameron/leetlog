import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <SignUp />
      </div>
    </div>
  )
}
