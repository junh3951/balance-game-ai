// src/data/api/getBalanceGameQuestion.js

export async function getCategoriesFromChatGPT() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: '밸런스 게임을 위한 카테고리를 5개 랜덤으로 나열해줘.' }
      ],
      max_tokens: 100,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('ChatGPT API 요청 실패');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim().split('\n').filter(Boolean);
}

// src/data/api/getBalanceGameQuestion.js
export async function getBalanceGameQuestion(selectedCategories) {
  try {
    let categories;

    // selectedCategories가 제공된 경우, 해당 카테고리를 사용
    if (selectedCategories && selectedCategories.length > 0) {
      categories = selectedCategories;
    } else {
      // selectedCategories가 없으면 ChatGPT로부터 카테고리 받아오기
      categories = await getCategoriesFromChatGPT();
    }

    // 받아온(또는 선택된) 카테고리에서 두 개를 무작위로 선택
    const randomCategory1 = categories[Math.floor(Math.random() * categories.length)];
    const randomCategory2 = categories[Math.floor(Math.random() * categories.length)];

    // 선택된 카테고리로 질문 구성
    return {
      question: '다음 중 어떤 것을 선택하시겠습니까?',
      option1: randomCategory1, // 첫 번째 카테고리
      option2: randomCategory2, // 두 번째 카테고리
      example1: `${randomCategory1}에 대한 설명을 추가하세요.`,
      example2: `${randomCategory2}에 대한 설명을 추가하세요.`,
    };
  } catch (error) {
    console.error('카테고리 생성 중 오류 발생:', error);
    return {
      question: '카테고리를 불러오지 못했습니다.',
      option1: '오류',
      option2: '오류',
      example1: '오류',
      example2: '오류',
    };
  }
}
