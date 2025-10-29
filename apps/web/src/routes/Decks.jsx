export default function Decks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Decks</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Sample Deck
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>A sample flashcard deck to get you started.</p>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-gray-500">25 cards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
