import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CardList from "../components/CardList";
import AddCardModal from "../components/AddCardModal";
import EditCardModal from "../components/EditCardModal";

export default function DeckDetail() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

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

  useEffect(() => {
    const fetchCards = async () => {
      if (!deck) return;

      setCardsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/decks/${id}/cards`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load cards");
        }

        const data = await response.json();
        setCards(data.cards || []);
      } catch (error) {
        console.error("Error fetching cards:", error);
        // Don't set error here, just log it - cards are optional
      } finally {
        setCardsLoading(false);
      }
    };

    fetchCards();
  }, [id, deck]);

  const handleCardAdded = (newCard) => {
    setCards((prev) => [newCard, ...prev]);
    // Update deck card count
    setDeck((prev) => ({
      ...prev,
      cardCount: (prev.cardCount || 0) + 1,
    }));
  };

  const handleCardEdited = (card) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  const handleCardUpdated = (updatedCard) => {
    setCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
    );
  };

  const handleCardDeleted = (cardId) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    // Update deck card count
    setDeck((prev) => ({
      ...prev,
      cardCount: Math.max((prev.cardCount || 0) - 1, 0),
    }));
  };

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
          {/* Enhanced Header with Tags */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {deck.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <span>{deck.cardCount || 0} cards</span>
                {deck.isPublic && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Public
                  </span>
                )}
              </div>
              {/* Tags in header */}
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
                    Additional Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {deck.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <h3 className="text-lg font-medium text-gray-900">
                  Flashcards
                </h3>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
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
                  {/* Add Card Button */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                  >
                    Add Card
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              {cardsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-4 rounded w-1/4 mb-2"></div>
                      <div className="bg-gray-200 h-20 rounded mb-4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <CardList
                  deckId={id}
                  cards={cards}
                  searchQuery={searchQuery}
                  onCardUpdate={handleCardEdited}
                  onCardDelete={handleCardDeleted}
                />
              )}
            </div>
          </div>

          {/* Add Card Modal */}
          <AddCardModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            deckId={id}
            onCardAdded={handleCardAdded}
          />

          {/* Edit Card Modal */}
          <EditCardModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingCard(null);
            }}
            deckId={id}
            card={editingCard}
            onCardUpdated={handleCardUpdated}
          />
        </div>
      </div>
    </div>
  );
}
