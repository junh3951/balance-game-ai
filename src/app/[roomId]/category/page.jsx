'use client'

import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectedCategoriesState } from '@/recoil/atoms';
import CategoryButton from './_components/category_button';
import GenerateGameButton from './_components/generate_game_button';
import { getCategoriesFromChatGPT } from '@/data/api/getBalanceGameQuestion'; // ChatGPT API 함수 임포트

export default function CategoryPage() {
  const [selectedCategories, setSelectedCategories] = useRecoilState(selectedCategoriesState);
  const [categories, setCategories] = useState([]); // 카테고리 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategoriesFromChatGPT(); // ChatGPT에서 카테고리 받아오기
        setCategories(categoryData); // 카테고리 상태 설정
      } catch (error) {
        console.error('카테고리 로드 중 오류 발생:', error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchCategories();
  }, []);

  // selectedCategories 상태가 변경될 때마다 리렌더링을 확인
  useEffect(() => {
    console.log('Selected categories updated:', selectedCategories);
  }, [selectedCategories]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        console.log(`${category} 해제됨`);
        return prev.filter((item) => item !== category); // 선택 해제
      } else if (prev.length < 2) {
        console.log(`${category} 선택됨`);
        return [...prev, category]; // 새로운 선택 추가
      } else {
        console.log('최대 2개의 카테고리만 선택할 수 있습니다.');
        return prev;
      }
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mt-4">2가지를 선택하세요</h1>
      {loading ? (
        <p>카테고리를 불러오는 중...</p> // 로딩 중일 때 표시
      ) : (
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
      )}
      <GenerateGameButton isActive={selectedCategories.length === 2} />
    </div>
  );
}
