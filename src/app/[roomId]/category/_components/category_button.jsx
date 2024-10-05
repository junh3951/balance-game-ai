// app/[roomId]/category/_components/category_button.jsx
'use client'

export default function CategoryButton({
	category,
	isSelected,
	toggleCategory
}) {
	return (
		<button
			onClick={() => toggleCategory(category)}
			className={`p-4 w-32 bg-gray-200 rounded ${
				isSelected ? 'bg-blue-500 text-white' : ''
			}`}
		>
			{category}
		</button>
	);
}
