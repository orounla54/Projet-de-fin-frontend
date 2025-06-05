import React from "react";

function DeleteButton({ selectedItems, deleteAll }) {
  for (let item = 0; item < selectedItems.length; item++) {
    // console.log(selectedItems);
  }
  return (
    <div className={`${selectedItems.length < 1 && "hidden"}`}>
      <div className="flex items-center">
        <div className="xl:block text-sm italic mr-2 whitespace-nowrap">
          <span>{selectedItems.length}</span> elements selectionner
        </div>
        <button
          onClick={() => deleteAll(selectedItems)}
          className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default DeleteButton;
