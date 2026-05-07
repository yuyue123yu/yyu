export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ✅ Next.js is Working!
        </h1>
        <p className="text-gray-600">
          If you can see this page, your Next.js app is running correctly.
        </p>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-500">
            <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
          </p>
          <p className="text-sm text-gray-500">
            <strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}
          </p>
        </div>
      </div>
    </div>
  );
}
