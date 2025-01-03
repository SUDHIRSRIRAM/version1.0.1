export const HowItWorks = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Remove backgrounds in three simple steps
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {/* Upload */}
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-gray-50 p-4 ring-1 ring-gray-200/50">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <dt className="mt-4 font-semibold text-gray-900">Upload Your Image</dt>
              <dd className="mt-2 text-sm leading-7 text-gray-600 text-center">
                Choose a single image, multiple images, or even an entire folder. Supports all major image formats.
              </dd>
            </div>

            {/* AI Processing */}
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-gray-50 p-4 ring-1 ring-gray-200/50">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <dt className="mt-4 font-semibold text-gray-900">AI Processing</dt>
              <dd className="mt-2 text-sm leading-7 text-gray-600 text-center">
                Our advanced AI technology automatically detects and removes the background with high precision.
              </dd>
            </div>

            {/* Download */}
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-gray-50 p-4 ring-1 ring-gray-200/50">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <dt className="mt-4 font-semibold text-gray-900">Download Result</dt>
              <dd className="mt-2 text-sm leading-7 text-gray-600 text-center">
                Get your processed image with transparent background in high-quality PNG format, ready to use.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};