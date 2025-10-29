import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CardFlip from "../components/CardFlip";

const GRADE_LABELS = {
  0: "Blackout",
  1: "Incorrect",
  2: "Incorrect (Easy)",
  3: "Correct (Hard)",
  4: "Correct",
  5: "Perfect",
};

export default function StudySession() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasStartedStudy, setHasStartedStudy] = useState(false);

  // Fetch deck and due cards
  useEffect(() => {
    const fetchStudyData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch deck info
        const deckResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/decks/${deckId}`,
          { credentials: "include" },
        );

        if (!deckResponse.ok) {
          throw new Error("Failed to load deck");
        }

        const deckData = await deckResponse.json();
        setDeck(deckData.deck);

        // Fetch due cards
        const cardsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/decks/${deckId}/cards?due=1`,
          { credentials: "include" },
        );

        if (!cardsResponse.ok) {
          throw new Error("Failed to load due cards");
        }

        const cardsData = await cardsResponse.json();
        setCards(cardsData.cards || []);

        if (cardsData.cards?.length === 0) {
          setShowCompletion(true);
        }
      } catch (error) {
        console.error("Error fetching study data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
  }, [deckId]);

  // Handle navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        hasStartedStudy &&
        currentCardIndex < cards.length &&
        !showCompletion
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handlePopState = (e) => {
      if (
        hasStartedStudy &&
        currentCardIndex < cards.length &&
        !showCompletion
      ) {
        const confirmExit = window.confirm(
          "Are you sure you want to exit your study session? Your progress will be lost.",
        );
        if (!confirmExit) {
          window.history.pushState(null, "", window.location.href);
          return;
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Push state to prevent back navigation
    if (hasStartedStudy) {
      window.history.pushState(null, "", window.location.href);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasStartedStudy, currentCardIndex, cards.length, showCompletion]);

  // Keyboard shortcuts for grading
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFlipped || submitting || showCompletion) return;

      const grade = parseInt(e.key);
      if (grade >= 0 && grade <= 5) {
        e.preventDefault();
        handleGrade(grade);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, submitting, showCompletion, currentCardIndex]);

  const handleFlip = useCallback(
    (flipped) => {
      setIsFlipped(flipped);
      if (flipped && !hasStartedStudy) {
        setHasStartedStudy(true);
      }
    },
    [hasStartedStudy],
  );

  const handleGrade = async (grade) => {
    if (!cards[currentCardIndex] || submitting) return;

    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/study/${cards[currentCardIndex].id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ grade }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Move to next card
      const nextIndex = currentCardIndex + 1;
      if (nextIndex >= cards.length) {
        setShowCompletion(true);
      } else {
        setCurrentCardIndex(nextIndex);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    if (cards.length === 0) return 100;
    return (currentCardIndex / cards.length) * 100;
  };

  const handleExitConfirm = () => {
    if (hasStartedStudy && currentCardIndex < cards.length && !showCompletion) {
      const confirmExit = window.confirm(
        "Are you sure you want to exit your study session? Your progress will be lost.",
      );
      if (!confirmExit) return;
    }
    navigate(`/decks/${deckId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading study session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Study Session
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              to={`/decks/${deckId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Deck
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Study Session Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              {cards.length === 0
                ? "No cards are due for review right now. Great job staying on top of your studies!"
                : `You've completed reviewing ${cards.length} card${cards.length !== 1 ? "s" : ""}. Well done!`}
            </p>
            <div className="space-y-3">
              <Link
                to={`/decks/${deckId}`}
                className="block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Deck
              </Link>
              <Link
                to="/decks"
                className="block w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View All Decks
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {deck?.title} - Study Session
            </h1>
            <p className="text-sm text-gray-600">
              Card {currentCardIndex + 1} of {cards.length}
            </p>
          </div>
          <button
            onClick={handleExitConfirm}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Exit Study
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Card */}
        <div className="mb-8">
          <CardFlip
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            className="mx-auto max-w-2xl"
          />
        </div>

        {/* Grading Buttons */}
        {isFlipped && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                How well did you know this card?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(GRADE_LABELS).map(([grade, label]) => (
                  <button
                    key={grade}
                    onClick={() => handleGrade(parseInt(grade))}
                    disabled={submitting}
                    className={`relative inline-flex items-center justify-center px-4 py-3 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                      parseInt(grade) <= 2
                        ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                        : parseInt(grade) === 3
                          ? "border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                          : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                    }`}
                  >
                    <span className="absolute top-1 left-2 text-xs opacity-75">
                      {grade}
                    </span>
                    <span className="text-center">{label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Use keyboard shortcuts 0-5 for quick grading
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
