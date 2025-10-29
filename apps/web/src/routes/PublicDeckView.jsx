import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function PublicDeckView() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/public/decks/${id}`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Deck not found or not public");
          } else {
            throw new Error("Failed to load deck");
          }
        }

        const data = await response.json();
        setDeck(data.deck);
      } catch (error) {
        console.error("Error fetching deck:", error);
        setError(error.message);
      }
    };

    const fetchCards = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/public/decks/${id}/cards`,
        );

        if (!response.ok) {
          throw new Error("Failed to load cards");
        }

        const data = await response.json();
        setCards(data.cards || []);
      } catch (error) {
        console.error("Error fetching cards:", error);
        // Don't set error for cards, just leave empty
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      await fetchDeck();
      await fetchCards();
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCards(cards);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = cards.filter(
        (card) =>
          card.front.toLowerCase().includes(query) ||
          card.back.toLowerCase().includes(query),
      );
      setFilteredCards(filtered);
    }
  }, [cards, searchQuery]);

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
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go Home
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
          {/* Read-Only Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Public Read-Only View
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  You're viewing a shared deck. You can browse the content but
                  cannot make any changes.
                </p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {deck.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <span>{deck.cardCount || 0} cards</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Public
                </span>
              </div>
              {/* Tags */}
              {deck.tags && deck.tags.length > 0 && (
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
              )}
            </div>
            <div className="text-right">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go Home
              </Link>
            </div>
          </div>

          {/* Deck Info */}
          {(deck.description || deck.course || deck.topic) && (
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
                      <h4 className="text-sm font-medium text-gray-500">
                        Topic
                      </h4>
                      <p className="text-gray-900">{deck.topic}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cards Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <h3 className="text-lg font-medium text-gray-900">
                  Flashcards
                </h3>
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              {cards.length === 0 ? (
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
                    This deck doesn't have any cards to display.
                  </p>
                </div>
              ) : filteredCards.length === 0 && searchQuery.trim() ? (
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
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No cards found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search query to find cards.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cards Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredCards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <div className="space-y-3">
                          {/* Front */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Front
                            </h4>
                            <p className="text-gray-900 line-clamp-3">
                              {card.front}
                            </p>
                          </div>

                          {/* Back */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Back
                            </h4>
                            <p className="text-gray-700 line-clamp-3">
                              {card.back}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Results summary */}
                  <div className="text-sm text-gray-500 text-center pt-4">
                    Showing {filteredCards.length} of {cards.length} cards
                    {searchQuery.trim() && (
                      <span> matching "{searchQuery}"</span>
                    )}
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
