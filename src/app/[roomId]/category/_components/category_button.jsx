// app/[roomId]/category/_components/category_button.jsx
'use client'

export default function CategoryButton({
    category,
    isSelected,
    toggleCategory,
}) {
    console.log('Button rendered for category:', category, 'Selected:', isSelected);
    
    return (
        <button
            onClick={() => {
                console.log('Button clicked for category:', category);
                toggleCategory(category);
            }}
            className={`p-4 w-32 rounded transition-colors duration-300 ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            style={{ cursor: 'pointer' }}
        >
            {category}
        </button>
    )
}

