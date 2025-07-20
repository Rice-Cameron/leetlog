import { useRouter } from "next/navigation";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

const DotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
  </svg>
);

const CustomPage = () => (
  <div>
    <h1 className="text-lg font-bold">Custom Modal Page</h1>
    <p>This page appears in the modal!</p>
  </div>
);

export default function Header() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  return (
    <header className="relative z-10 animate-fade-in">
      <div className="glass-card rounded-none border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center animate-glow">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <button
                onClick={() => router.push("/")}
                className="text-3xl font-bold text-gradient tracking-tight hover:text-gradient-secondary transition-all cursor-pointer"
              >
                LeetLog
              </button>
            </div>
            <div className="flex items-center gap-6">
              {isSignedIn ? (
                <>
                  <span className="text-gray-700 font-medium hidden sm:block">
                    Welcome back,{" "}
                    <span className="text-gradient">
                      {user?.firstName || "Developer"}
                    </span>
                    !
                  </span>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-10 h-10 rounded-xl shadow-lg hover:shadow-xl transition-shadow",
                      },
                    }}
                  >
                    <UserButton.UserProfilePage
                      label="Modal Custom"
                      url="modal-custom"
                      labelIcon={<DotIcon />}
                    >
                      <CustomPage />
                    </UserButton.UserProfilePage>
                  </UserButton>
                </>
              ) : (
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/problems"
                  signUpForceRedirectUrl="/problems"
                >
                  <button className="btn-primary">Sign In</button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
