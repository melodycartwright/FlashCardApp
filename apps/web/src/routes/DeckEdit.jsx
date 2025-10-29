import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeckForm from "../components/DeckForm";

export default function DeckEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState("");

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
          } else if (response.status === 403) {
            throw new Error("You don't have permission to edit this deck");
          } else {
            throw new Error("Failed to load deck");
          }
        }

        const data = await response.json();
        setDeck(data.deck);
      } catch (error) {
        console.error("Error fetching deck:", error);
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/decks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          // Handle validation errors from server
          setErrors(data.errors);
        } else if (response.status === 403) {
          throw new Error("You don't have permission to edit this deck");
        } else {
          throw new Error(data.message || "Failed to update deck");
        }
        return;
      }

      // Navigate to the updated deck detail page
      navigate(`/decks/${id}`);
    } catch (error) {
      console.error("Error updating deck:", error);
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <h2 className="text-lg font-medium mb-2">Error Loading Deck</h2>
              <p>{fetchError}</p>
              <div className="mt-4">
                <button
                  onClick={() => navigate("/decks")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Decks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Deck</h1>

          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <DeckForm
              initialData={deck}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
              isSubmitting={isSubmitting}
              errors={errors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
