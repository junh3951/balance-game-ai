// app/[roomId]/category/page.jsx
'use client'

import { useRecoilState } from 'recoil'
import { selectedCategoriesState } from '@/recoil/atoms'
import CategoryButton from './_components/category_button'
import GenerateGameButton from './_components/generate_game_button'

export default function CategoryPage() {
	const [selectedCategories, setSelectedCategories] = useRecoilState(
		selectedCategoriesState,
	)
	const categories = [
		'카테고리1',
		'카테고리2',
		'카테고리3',
		'카테고리4',
		'카테고리5',
	]

	const toggleCategory = (category) => {
		setSelectedCategories((prev) => {
			if (prev.includes(category)) {
				return prev.filter((item) => item !== category)
			} else if (prev.length < 2) {
				return [...prev, category]
			} else {
				return prev
			}
		})
	}

	return (
		<div className="flex flex-col items-center min-h-screen p-4">
			<h1 className="text-2xl font-bold mt-4">2가지를 선택하세요</h1>
			<div className="grid grid-cols-2 gap-4 mt-8">
				{categories.map((category) => (
					<CategoryButton
						key={category}
						category={category}
						isSelected={selectedCategories.includes(category)}
						toggleCategory={toggleCategory}
					/>
				))}
			</div>
			<GenerateGameButton isActive={selectedCategories.length === 2} />
		</div>
	)
}
