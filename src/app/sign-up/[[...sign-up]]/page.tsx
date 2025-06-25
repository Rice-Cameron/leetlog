import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-32 left-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Sign-up container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card rounded-3xl p-8 shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-glow">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <h1 className="text-3xl font-bold text-gradient-secondary mb-2">
              Join LeetLog
            </h1>
            <p className="text-gray-600">
              Start tracking your coding progress today
            </p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0 p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsIconButton:
                  "border-2 border-gray-200 hover:border-purple-300 transition-colors",
                formButtonPrimary: "btn-primary w-full justify-center",
                formFieldInput:
                  "rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400",
                footerActionLink: "text-gradient hover:text-purple-700",
              },
            }}
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
}
