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

export async function getBalanceGameQuestion(selectedCategories) {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const prompt = `밸런스 게임을 위한 질문을 만들어줘. 카테고리1: ${selectedCategories[0]}, 카테고리2: ${selectedCategories[1]}. 두 카테고리 중 하나를 선택해 관련된 밸런스 게임을 만들어줘
  두 가지 선택지를 vs를 포함해서 한번만 제공해줘. 동물 카테고리로 예를 들자면 사자vs호랑이. 다른 설명은 필요 없어"`;

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
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('ChatGPT API 요청 실패');
  }

  const data = await response.json();
  return {
    question: data.choices[0].message.content.split('\n')[0], // 질문
    option1: data.choices[0].message.content.split('\n')[1], // 첫 번째 선택지
    option2: data.choices[0].message.content.split('\n')[2],  // 두 번째 선택지
  };
}