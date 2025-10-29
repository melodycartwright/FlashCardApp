import { useState, useEffect } from "react";

export default function EditCardModal({
  isOpen,
  onClose,
  deckId,
  card,
  onCardUpdated,
}) {
  const [formData, setFormData] = useState({
    front: "",
    back: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (card) {
      setFormData({
        front: card.front || "",
        back: card.back || "",
      });
    }
  }, [card]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!formData.front.trim()) {
      newErrors.front = "Front side is required";
    }
    if (!formData.back.trim()) {
      newErrors.back = "Back side is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/decks/${deckId}/cards/${card.id}`,
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
          setErrors(data.errors);
        } else {
          throw new Error(data.message || "Failed to update card");
        }
        return;
      }

      // Success - notify parent and close modal
      onCardUpdated(data.card);
      handleClose();
    } catch (error) {
      console.error("Error updating card:", error);
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ front: "", back: "" });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Card</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Front Field */}
            <div>
              <label
                htmlFor="edit-front"
                className="block text-sm font-medium text-gray-700"
              >
                Front <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="edit-front"
                  rows={3}
                  value={formData.front}
                  onChange={(e) => handleChange("front", e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                    errors.front
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="Enter the question or prompt"
                  required
                />
                {errors.front && (
                  <p className="mt-1 text-sm text-red-600">{errors.front}</p>
                )}
              </div>
            </div>

            {/* Back Field */}
            <div>
              <label
                htmlFor="edit-back"
                className="block text-sm font-medium text-gray-700"
              >
                Back <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="edit-back"
                  rows={3}
                  value={formData.back}
                  onChange={(e) => handleChange("back", e.target.value)}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                    errors.back
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="Enter the answer or response"
                  required
                />
                {errors.back && (
                  <p className="mt-1 text-sm text-red-600">{errors.back}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
