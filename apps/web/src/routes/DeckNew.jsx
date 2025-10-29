import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeckForm from "../components/DeckForm";

export default function DeckNew() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/decks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          // Handle validation errors from server
          setErrors(data.errors);
        } else {
          throw new Error(data.message || "Failed to create deck");
        }
        return;
      }

      // Navigate to the new deck detail page
      navigate(`/decks/${data.deck.id}`);
    } catch (error) {
      console.error("Error creating deck:", error);
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Create New Deck
          </h1>

          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <DeckForm
              onSubmit={handleSubmit}
              submitLabel="Create Deck"
              isSubmitting={isSubmitting}
              errors={errors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
