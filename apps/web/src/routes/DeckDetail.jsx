import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function DeckDetail() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/decks/${id}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Deck not found");
          } else {
            throw new Error("Failed to load deck");
          }
        }

        const data = await response.json();
        setDeck(data.deck);
      } catch (error) {
        console.error("Error fetching deck:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <h2 className="text-lg font-medium mb-2">Error Loading Deck</h2>
              <p>{error}</p>
              <div className="mt-4">
                <Link
                  to="/decks"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Decks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {deck.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{deck.cardCount || 0} cards</span>
                {deck.isPublic && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Public
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/decks/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Deck
              </Link>
              <Link
                to={`/decks/${id}/study`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Study Now
              </Link>
            </div>
          </div>

          {/* Deck Info */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4">
              {deck.description && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700">{deck.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deck.course && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Course
                    </h4>
                    <p className="text-gray-900">{deck.course}</p>
                  </div>
                )}
                {deck.topic && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Topic</h4>
                    <p className="text-gray-900">{deck.topic}</p>
                  </div>
                )}
              </div>

              {deck.tags && deck.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {deck.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cards Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Flashcards
                </h3>
                <Link
                  to={`/decks/${id}/cards/new`}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Card
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              {deck.cardCount > 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Card management coming soon...
                </p>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No cards yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first flashcard.
                  </p>
                  <div className="mt-6">
                    <Link
                      to={`/decks/${id}/cards/new`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add your first card
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
