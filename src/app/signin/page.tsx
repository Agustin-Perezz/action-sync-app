import { MagicLinkForm } from "./components/MagicLinkForm";
import { OAuthButtons } from "./components/OAuthButtons";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to continue
          </p>
        </div>
        <MagicLinkForm />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 tracking-wider text-zinc-400 dark:bg-zinc-950">
              Or continue with
            </span>
          </div>
        </div>
        <OAuthButtons />
      </div>
    </div>
  );
}
