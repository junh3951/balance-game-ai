// app/[roomId]/balance-game/_components/CategorySelection.jsx

import { useEffect, useState } from 'react';
import { getCategoriesFromChatGPT } from '@/data/api/getBalanceGameQuestion'; // ChatGPT API 함수 가져오기

export default function CategorySelection() {
  const [categories, setCategories] = useState([]); // 카테고리 리스트 상태
  const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategoriesFromChatGPT(); // ChatGPT에서 카테고리 받아오기
        setCategories(categoryData); // 카테고리 상태 설정
      } catch (error) {
        console.error('카테고리 로드 중 오류 발생:', error);
      }
    };

    fetchCategories();
  }, []);

  // 카테고리 선택 시 상태 업데이트
  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      // 이미 선택된 카테고리는 선택 해제
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else if (selectedCategories.length < 2) {
      // 두 개까지만 선택 가능
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">2가지를 선택하세요</h1>
      <div className="grid grid-cols-2 gap-4">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategorySelect(category)}
              className={`p-4 rounded-lg ${
                selectedCategories.includes(category)
                  ? 'bg-gray-300'  // 선택된 경우 스타일
                  : 'bg-gray-100'  // 선택되지 않은 경우 스타일
              }`}
              disabled={selectedCategories.includes(category) || selectedCategories.length >= 2}
            >
              {category}
            </button>
          ))
        ) : (
          <p>카테고리를 불러오는 중...</p>
        )}
      </div>
      <button
        className="bg-green-500 text-white px-6 py-2 mt-6"
        onClick={() => console.log('선택된 카테고리:', selectedCategories)}
        disabled={selectedCategories.length !== 2} // 두 개 선택해야 버튼 활성화
      >
        밸런스 게임 생성
      </button>
    </div>
  );
}
