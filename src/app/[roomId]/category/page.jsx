// app/[roomId]/category/page.jsx
'use client'

import { useEffect, useState } from 'react';
import { getCategoriesFromChatGPT } from '@/data/api/getBalanceGameQuestion'; // 필요한 함수 가져오기
import { useRecoilState } from 'recoil'
import { selectedCategoriesState } from '@/recoil/atoms'
import CategoryButton from './_components/category_button'
import GenerateGameButton from './_components/generate_game_button'

export default function CategoryPage() {
    const [selectedCategories, setSelectedCategories] = useRecoilState(
        selectedCategoriesState
    );
    const [chatGPTCategories, setChatGPTCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
        setSelectedCategories([]);
    }, []);  // 빈 배열로 초기화

	useEffect(() => {
		const fetchCategories = async () => {
		  try {
			const categoryData = await getCategoriesFromChatGPT();
			console.log('받아온 카테고리:', categoryData); // 카테고리 로그 확인
			setChatGPTCategories(categoryData);
		  } catch (error) {
			console.error('카테고리 로드 중 오류 발생:', error);
		  } finally {
			setLoading(false);
		  }
		};

		fetchCategories();
	}, []);

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
	useEffect(() => {
		console.log('선택된 카테고리:', selectedCategories); // 상태 확인용
	  }, [selectedCategories]);

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mt-4">2가지를 선택하세요</h1>
			{loading}
            <div className="grid grid-cols-2 gap-4 mt-8">
                {chatGPTCategories.map((category) => (
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


