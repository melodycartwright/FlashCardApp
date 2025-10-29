import { useState, useEffect } from "react";

export default function CardList({
  deckId,
  cards,
  searchQuery,
  onCardUpdate,
  onCardDelete,
}) {
  const [filteredCards, setFilteredCards] = useState([]);

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

  const handleEdit = (card) => {
    onCardUpdate(card);
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/decks/${deckId}/cards/${cardId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      onCardDelete(cardId);
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Failed to delete card. Please try again.");
    }
  };

  if (cards.length === 0) {
    return (
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">No cards yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first flashcard.
        </p>
      </div>
    );
  }

  if (filteredCards.length === 0 && searchQuery.trim()) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      {/* Note for pagination/virtualization */}
      {cards.length > 100 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Performance Note:</strong> This deck has {cards.length}{" "}
                cards. For optimal performance with large card sets,
                pagination/virtualization will be added in v1.1.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="space-y-3">
              {/* Front */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Front
                </h4>
                <p className="text-gray-900 line-clamp-3">{card.front}</p>
              </div>

              {/* Back */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Back</h4>
                <p className="text-gray-700 line-clamp-3">{card.back}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(card)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results summary */}
      <div className="text-sm text-gray-500 text-center pt-4">
        Showing {filteredCards.length} of {cards.length} cards
        {searchQuery.trim() && <span> matching "{searchQuery}"</span>}
      </div>
    </div>
  );
}
