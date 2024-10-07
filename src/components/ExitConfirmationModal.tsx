import React from "react";

interface ExitConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Are you sure you want to exit?
        </h2>
        <p className="text-xl text-gray-800 mb-4">
          Your progress will be lost.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Yes, Exit
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;
