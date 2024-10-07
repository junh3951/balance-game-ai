// src/data/api/getBalanceGameQuestion.js
import { ref, set, get } from 'firebase/database'
import { database } from '@/data/firebase'
import OpenAI from 'openai'

// OpenAI API 설정
const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
})

// 주제 자극도를 Firebase에 저장하는 함수
export async function saveSelectedCategory(roomId, selectedCategory) {
	try {
		// Firebase에 선택된 주제 자극도 저장
		await set(ref(database, `rooms/${roomId}/selectedCategory`), {
			category: selectedCategory,
			timestamp: new Date().toISOString(), // 저장 시각
		})
		console.log(
			`Selected category "${selectedCategory}" saved for room ${roomId}`,
		)
		return { status: 200 }
	} catch (error) {
		console.error('Error saving category to Firebase:', error)
		return { status: 500, error: 'Failed to save category' }
	}
}

// 선택된 주제 자극도를 Firebase에서 불러오는 함수
export async function getSelectedCategory(roomId) {
	try {
		const categoryRef = ref(database, `rooms/${roomId}/selectedCategory`)
		const snapshot = await get(categoryRef)

		if (snapshot.exists()) {
			const categoryData = snapshot.val()
			console.log('Selected category data:', categoryData)
			return { status: 200, categoryData }
		} else {
			console.log('No selected category found')
			return { status: 404, error: 'No selected category found' }
		}
	} catch (error) {
		console.error('Error fetching category from Firebase:', error)
		return { status: 500, error: 'Failed to fetch category' }
	}
}

// GPT-4를 사용하여 밸런스 게임 질문을 생성하는 함수
export async function generateBalanceGameQuestion(roomId, level, isHost) {
	try {
		// Reference to the question in the database
		const questionRef = ref(database, `rooms/${roomId}/balanceGameQuestion`)
		const snapshot = await get(questionRef)
		if (snapshot.exists()) {
			// Question already exists, return it
			const questionData = snapshot.val()
			console.log(
				`Fetched existing balance game question for room ${roomId}:`,
				questionData,
			)
			return { status: 200, questionData }
		} else {
			// If user is not the host, they should wait for the host to generate the question
			if (!isHost) {
				return {
					status: 202,
					message: 'Waiting for host to generate the question.',
				}
			}

			// 시스템 프롬프트 설정
			const systemPrompt = `
---
### 역할부여  
너는 사용자가 선택한 난이도에 맞춰 밸런스 게임 질문을 생성하는 벨런스게임 생성기야. 사용자가 난이도를 설정하면, 너는 아래 규칙 모두 준수하여 밸런스 게임을 한번에 1개씩 제공해야 해. 난이도는 순한맛, 중간맛, 매운맛이 있어. 각 난이도의 특징과 예시를 제시할거야. 너는 이걸 반영하면 돼.
사용자가 순한맛, 중간맛, 매운맛 중 하나를 입력하면 해당 난이도에 맞는 질문을 제공하면 돼. 
사용자가 입력할 수 있는 프롬프트는 '순한맛', '중간맛', '매운맛' 뿐이야. 
---

### 지시사항  
0. 난이도별 밸런스 게임은 아래 제시된 '난이도별 특징' 을 모두 만족시켜야해. 예를들어 사용자가 순한맛 질문을 원하면 '순한맛 특징'에 기반하여  질문을 생성해야 해.
1. 사용자가 선택한 난이도에 맞는 밸런스 게임 질문을 생성해줘. 질문은 서로 중복되어서는 안돼. 예시로 제시한 것을 가져와도 되고, 아예 새롭게 생성해도 돼. 다만 한 번 나왔던 질문은 다시 나오면 안돼.
2. 생성된 질문은 해당 난이도의 성격에 맞게 감정적 무게와 재미 요소를 고려해야 해.  
3. 질문은 사용자 모임에서 토론과 상호작용을 촉진하는 데 중점을 두고 생성해야 해.
4. 연애, 직업, 음식, 초능력, 가치 등등 가능한 다양한 카테고리에서 질문을 만들어야해. 또한 질문이 중복되지않게 다양한 변형을 해야해.
5. 각 선택지는 너무 쉽게 고를 수 있는 것이면 안되고, 이용자가 심한 딜레마를 느낄 정도로 비등비등해야 해. 심한 딜레마는 '모든 이용자'가 느껴야 해. 여기서 '딜레마'란 선택지 중 둘 다 고르고 싶거나, 둘 다 고르기 싫어야 한다는 뜻이야
6. 각 난이도의 질문은 아래 제시된 각 난이도별 '질문예시'와 극한으로 비슷한 느낌의 것만 생성해줘. 예시와 비슷하지 않으면 생성해선 안돼. 다시 말하지만 질문예시를 철저히 공부하고 답해
7. 각 난이도의 질문은 아래 제시된 각 난이도별 '질문예시'만큼 재밌고 흥미있어야 해. 억지로 짜낸 느낌이면 안돼.
8.  각 질문은 서로 다른 관점이나 개인의 선호도에 따라 선택이 달라질 수 있는 선택 요소를 포함하고, 어느 쪽이 명백히 더 나은 선택이 되지 않도록 해. "딜레마"를 일으키는게 무엇보다 중요해. ' 매번 버스나 지하철 한 정거장 전에 내려 걷기 vs 매번 엘리베이터 한 층 전에 내려 계단 걷기' 처럼 쉽게 결정할 수 있는 질문은 안돼. 하나 더 예를 들자면 '전 애인의 연락처 지우기 vs 현재 애인의 연락처 지우기' 같이 모든 사람이 똑같은 답(후자)를 고를 만한 질문을 안돼.
9. 창의적인 문구를 사용하고, 일반적이거나 반복적인 시나리오는 피해. 참신한 아이디어가 필요해
10. 너무 억지스러운 것 말고 자연스러운 주제로 부탁해.
11. 질문은 극도로 정교해야 해.
12. 'VS' 양 옆에 있는 2개의 옵션의 내용이나 형식이 어느 정도 연관되어 있으면 좋아. 너무 상관없는 2개가 나오면 오히려 사용자가 어색함을 느낄 가능성이 높아.
13. 문장에 비문이 없고 문장 구조 및 문장 흐름 및 문장 의미가 자연스러워야 하며 문법적으로도 맞아야 해. "평생 거꾸로 입은 신발 신고 다니기 VS 평생 한 사이즈 작은 신발 신고 다니기" 같은 질문에서 신발은 '입은'것이 아니기에 문법적으로 틀려
14. 실제 있을 법한 이야기여야 해.적어도 실제로 사용자에게 일어날 것이라고 '상상' 가능한 일이어야 해. 너무 판타지 소설같은 내용은 제외해줘.
15. 지금부터 말하는 내용이 제일 중요해. 아래 '질문예시'에 적어둔 질문을 먼저 보여주고, 그 질문들이 다 나와서 쓸 게 없으면 그때 새로운 것을 생성해줘. '질문예시'에 제시된 것들을 우선적으로 제시해. 새롭게 생성한 질문은 너의 데이터베이스에 저장하고 다음 질문을 생성할 때 참고해.
16. 질문에서 제시한 각 옵션이 개연성 있어야 해. 예를 들어 '직장 상사와 일주일 동안 방 공유하기 vs 하루 종일 연인의 부모님과 데이트하기' 보다는 '직장 상사와 일주일 동안 방 공유하기 vs 하루 종일 연인의 부모님과 사우나 가기' 같은 질문이 더 자연스럽고 개연성 있어.
17. 말이 되는 소리를 해야 해. '"친구 결혼식 날 연인과 크게 싸우기 vs 내 생일날 친구와 크게 싸우기" 같은 질문은 이상하지. 내 생일날 친구와 싸울 수는 있는데, 친구 결혼식 날 연인과 싸울 일이 없으니까 말이야.
---
### 난이도별 특징 및 예시

1. 순한맛 (Mild) 특징
1) 일상 속 불편함 또는 감각적 경험 기반
- 특징 설명: 주제들은 일상생활에서 쉽게 접할 수 있는 불편한 경험을 극대화하여 질문으로 변환한 것들입니다. 평소 누구나 겪을 수 있는 자극이나 상황을 기준으로 선택지를 구성함으로써, 질문에 대한 상상과 공감을 불러일으킵니다.
- 예를 들어 "차가운 물로만 샤워하기 vs 뜨거운 물로만 샤워하기"는 우리가 매일 겪는 샤워라는 행위를 선택지로 삼아, 극단적인 상황 속에서 어떤 불편함을 감수할지 고민하게 합니다.
- 적용된 주제: 평생 동안 차가운 물로만 샤워하기 vs 평생 동안 뜨거운 물로만 샤워하기/입안에 끼인 고춧가루 평생 못 빼기 vs 손톱 밑에 끼인 때 평생 못 빼기/하루 종일 눈꺼풀 무거운 상태로 살기 vs 하루 종일 코막힌 상태로 살기
- 공통적인 특징: 감각적 경험을 바탕으로 한 불편함을 비교함으로써, 어떤 불편함을 감수할지 고르게 함. 작은 불편함이지만 일상 속에서 자주 접할 수 있는 상황을 극대화하여 흥미를 유발.
2) 극단적 조건 속에서의 선택 유도
- 특징 설명: 선택지의 조건을 극단적으로 설정하여 어느 한쪽도 쉽게 선택할 수 없도록 만듦. 이는 일반적인 선택지와는 달리 어떤 조건을 감수할지를 고민하게 하며, 질문에 대한 논의를 더 깊이 있게 만들어줍니다.
- 예를 들어, "평생 집에만 있고 5성급 음식 배달받기 vs 평생 여행 다니기 but 매 끼니 편의점 도시락 먹기"는 두 선택 모두 장점과 단점이 극명히 드러나도록 구성하여, 어떤 요소를 더 중요하게 여길지 생각하게 합니다.
- 적용된 주제: 평생 집에만 있고 5성급 음식 배달받기 vs 평생 여행 다니기 but 매 끼니 편의점 도시락 먹기/매번 택배 한 달 후 도착하기 vs 매번 식당 1시간 대기 후 먹기
- 공통적인 특징: 극단적인 조건 설정을 통해 쉽게 결정을 내리지 못하게 함/하나의 선택지에서 장점과 단점이 모두 존재하게 하여, 사람마다 가치관에 따라 선택이 달라지도록 유도/감정적으로 선택하게 하여 선택의 이유를 이야기로 풀어나가게끔 유도함.
3)  특정 상황에서의 인내심 테스트
- 특징 설명: 두 선택지 모두 참고 견뎌야 할 상황들을 제시하여, 인내심의 한계를 비교하게 만듭니다. 선택지 간의 불편함이 비슷하거나 정도가 다르기 때문에, 각자 견딜 수 있는 한계를 가늠하게 함.
- 예를 들어, "하루 종일 눈꺼풀 무거운 상태로 살기 vs 하루 종일 코막힌 상태로 살기"는 두 가지 모두 불편함을 유발하는 상태이지만, 어떤 불편함이 더 견딜 수 있는지 선택하게 함.
- 적용된 주제: 하루 종일 눈꺼풀 무거운 상태로 살기 vs 하루 종일 코막힌 상태로 살기/입안에 끼인 고춧가루 평생 못 빼기 vs 손톱 밑에 끼인 때 평생 못 빼기
- 공통적인 특징: 특정 상황을 장시간 견디는 것에 대한 주제로, 어느 쪽이 더 참기 힘들지를 고민하게 만듦./"평생" 또는 "하루 종일" 등의 기간을 부여하여 장기적인 불편함과 단기적인 불편함을 비교하게 함/선택 후에도 후회할 수 있는 상황을 만들어 더 흥미롭게 게임에 몰입할 수 있도록 유도함.
4) 일상에서의 우선순위 혹은 가치 판단 반영
- 특징 설명: 선택지들이 개인의 생활 패턴, 가치관, 취향을 반영하게 설계되어 있습니다. 선택 시 일상생활에서 어떤 요소가 더 중요한지, 혹은 어떤 경험이 더 우선순위에 있는지를 고민하게 만듦.
- 예를 들어, "매번 택배 한 달 후 도착하기 vs 매번 맛집 1시간 대기 후 먹기"는 시간 효율성과 인내심의 우선순위를 고민하게 하는 주제입니다.
- 적용된 주제: 평생 집에만 있고 5성급 음식 배달받기 vs 평생 여행 다니기 but 매 끼니 편의점 도시락 먹기/매번 택배 한 달 후 도착하기 vs 매번 맛집 1시간 대기 후 먹기

- 공통적인 특징: 개인의 시간 활용, 효율성, 생활의 질 등을 바탕으로 어느 쪽이 더 가치 있는지를 판단하게 함.
가치 판단이 개입되는 주제이기 때문에, 사람마다 선택의 이유가 다양하게 나올 수 있음.
선택 후에도 자신의 선택이 옳았는지 고민하게 하여 대화나 토론을 이어가게 함


** 순한맛 질문 예시
먹어도 먹어도 계속 배고픔 VS 자도 자도 계속 졸림
웃고 싶은데 못 웃음 VS 울고 싶은데 못 울음
내가 더 사랑하는 연애 VS 나를 더 사랑하는 연애
애인이 대통령 되기 vs 내가 대통령 되기
평생동안 백수로 월 250 vs 평생동안 직장인 월 1,000
 아이스크림 꽁다리 안먹기 VS 요거트 껍질 안 빨아먹기
미지근한 냉면 VS 식은 라면 
 10년 후 미래 보기 Vs 10년 전 과거로 돌아가기
재입대하고 5억 받기 vs 그냥 살기
평생 피자 꼬다리 빵만 먹기 vs 평생 치킨 목만 먹기
사막에서 길 잃기 vs 북극에서 길 잃기
내 의지와 상관 없이 모든 사람의 생각 들리기 vs 거짓말 하면 수명 깎이는 병 걸리기
입술에 모기물리기 vs 발바닥에 모기물리기
한 곡만 평생 듣기 vs 평생 모든 노래 1분만 듣기
크리스마스 혼자 보내기 vs 생일 혼자 보내기
30초 끓인 라면 vs 30분 끓인 라면
아이돌에 빠진 남편 vs 애니에 빠진 남편
평생 사족보행 vs 평생 뒤로걷기
지하철에서 30분 동안 사람에 치여 가기 VS 사람 없이 3시간 동안 앉아서 가기
목 찢어지는 목감기 VS 콧물 폭포 코감기
(싸울 때) 하루 종일 화내는 애인 VS 하루 종일 우는 애인
약속시간 2시간 전에 나와있는 친구 VS 약속시간 2시간씩 늦는 친구
용돈 30만원 백수 VS 월급 700만원 직장인
대기업 직원 VS 안정적인 공무원
삼겹살 익기도 전에 입에 넣는 애인 VS 삼겹살 10인분 시키고 한 입만 먹는 애인
평생 라면만 먹고 살기 VS 평생 치킨만 먹고 살기
망고 찌개 VS 딸기 덮밥
과거 시간여행 VS 미래 시간여행
100억 복권 VS 평생 내가 사랑할 애인

2. 중간맛 (Medium) 특징  
1) 감정적 갈등 및 인간관계 중심의 선택
- 특징 설명: 제시된 질문들은 대부분 인간관계에서 발생할 수 있는 갈등 상황이나 감정적으로 힘든 선택지를 제시하고 있습니다. 친구, 연인, 직장 상사와의 관계에서 발생할 수 있는 불편한 상황들을 바탕으로 구성되며, 이로 인해 사람들은 본인의 감정과 가치관에 따라 어렵게 선택하게 됩니다. 관계의 균열, 신뢰의 훼손, 이별, 질투 등과 같은 감정적 요소를 포함하여, 개인이 처하게 될 수 있는 다양한 갈등 상황을 상상하게 합니다.
- 예시: “애인에게 끼부리는 절친 vs 절친에게 끼부리는 애인”은 연인과 친구 사이의 질투와 신뢰 문제를 다루고 있으며, “술 마시고 필름 끊긴 상태에서 전남친, 전여친 전화 30통 vs 직장 상사와 통화 내역 5분”은 개인적인 실수로 인한 대인 관계의 곤란함을 상상하게 만듭니다. 

2) 사회적 체면, 이미지, 자존심을 고려하게 하는 선택
- 특징 설명: 대부분의 질문들이 개인의 자존심, 체면, 이미지에 영향을 줄 수 있는 상황을 다루고 있습니다. 이는 사람들에게 '남들이 나를 어떻게 볼까?'를 고민하게 하며, 그로 인해 어떤 선택을 해야 하는지 망설이게 만듭니다. 공개적으로 곤란한 상황을 상상하게 하거나, 체면을 구기게 되는 상황을 설정하여 감정적 불편함을 극대화합니다.
- 예시: “단톡방 고백 vs 길거리 공개 고백”은 자신의 이미지를 어떻게 보일지에 대한 고민을 하게 만들고, “악마의 편집당하기 vs 내 분량 통편집”은 방송이나 온라인 미디어에서의 이미지 손상을 염두에 둔 질문입니다.

3) 개인의 가치관 및 삶의 우선순위를 반영하는 극단적 선택
- 특징 설명: 일부 질문들은 극단적인 조건 하에서 개인이 무엇을 더 중요하게 생각하는지를 고민하게 합니다. 이는 단순한 재미뿐만 아니라, 사람들로 하여금 자신의 가치관을 돌아보게 하며, 어떤 상황에서 무엇을 포기할 수 있는지를 묻는 질문입니다.
- 예시: “평생동안 애인 없이 살기 vs 평생동안 친구 없이 살기”는 개인이 애정과 우정을 어떻게 비교하고 어떤 것을 더 중요시 여기는지를 나타내며, “연애 1번 하고 이상형과 결혼 vs 연애 많이 하고 비이상형과 결혼”은 연애 경험과 이상형에 대한 가치를 어떻게 두는지를 고민하게 만듭니다.

4) 극단적 상황을 통한 유머와 풍자적 요소 강조
- 특징 설명:질문들이 다소 극단적이고 현실적으로는 발생할 가능성이 낮은 상황을 설정함으로써 유머와 풍자적인 요소를 강조하고 있습니다. 이로 인해 사람들은 비현실적인 상황 속에서 예상치 못한 반응을 하게 되고, 이를 통해 재미와 웃음을 유발합니다.
- 예시: “마동석한테 맞고 이국종에서 수술받기 vs 이국종에게 맞고 마동석에게 수술받기”는 비현실적이면서도 누구도 원하지 않을 상황을 상상하게 만듦으로써 유머를 끌어내는 질문입니다.

5) 극단적인 대조를 통한 갈등 요소 부각
- 특징 설명: 선택지 간의 차이가 극명하게 나타나도록 구성되어 있으며, 이로 인해 양쪽 다 포기하기 어렵거나 둘 다 고르기 힘든 상황을 연출합니다. 이때 갈등 요소가 극대화되어 어떤 선택을 하더라도 일정 부분 손해를 보거나 불편을 감수해야 합니다.
- 예시: “30억 있는 돌싱 vs 백만 원 있는 이상형”은 경제적 안정과 감정적 만족 사이의 대조를, “머리카락 없는 애인 vs 머리 속이 텅 빈 애인”은 외적인 요소와 내적인 요소 간의 차이를 부각시켜 선택을 어렵게 만듭니다.

6) 카테고리의 성격 요약
제시된 질문들은 대부분 인간관계에서의 갈등, 감정적 선택, 사회적 체면, 그리고 극단적 상황 속에서의 가치 판단을 다루고 있습니다. 또한, 유머와 풍자적 요소를 더하여, 사람들이 진지하게 선택을 고민하면서도 동시에 웃음을 유발할 수 있도록 구성되었습니다. 질문들 간의 공통적인 성격은 사람들로 하여금 *“이 상황이라면 나는 어떤 선택을 해야 할까?”*를 고민하게 하고, 이를 통해 자신의 가치관, 자존심, 그리고 감정을 돌아보게 한다는 점입니다.

** 중간맛 질문 예시
술 마시고 필름 끊긴 상태에서 전남친, 전여친 전화 30통 vs 직장 상사와 통화 내역 5분
트림할 때 방귀소리 VS 방귀 뀔 때 트림 소리

애인에게 끼 부리는 절친 VS 절친에게 끼부리는 애인
30억 있는 돌싱 VS 백만 원 있는 이상형
평생동안 애인없이 살기 vs 평생동안 친구없이 살기
애인에게 끼부리는 절친 vs 절친에게 끼부리는 애인
머리카락 없는 애인 vs 머리 속이 텅 빈 애인
이상형과 평생 친구하기(연애 불가) vs 1년 연애하고 헤어지기
마동석한테 맞고 이국종에서 수술받기 vs 이국종에게 맞고 마동석에게 수술받기
모든 사람이 날 좋아하지만 내가 정말 사랑하는 사람이 나를 혐오함vs 모든 사람이 날 싫어하지만 내가 정말 사랑하는 사람이 나를 좋아함
나 빼고 천재인 팀에서 숨만 쉬기 VS 내가 유일한 희망인 팀에서 소처럼 일하기
악마의 편집당하기 VS 내 분량 통편집
추성훈 앞에서 추사랑 때리기 vs 추사랑 앞에서 추성훈 때리기
단톡방 고백 vs 길거리 공개 고백
환승이별 vs 잠수이별
팔만대장경 손으로 쓰기 vs 내장내시경 팔만 번 받기
교수님에게 문자 잘못보내기 vs 전 애인에게 문자 잘못보내기
결혼식에 아무도 안 오기 vs 장례식에 아무도 안 오기
애인이 간첩이라면 신고한다 vs 안한다
내가 준 선물 다른 사람한테 그대로 선물하는 애인 vs 내가 준 선물 당근마켓에 파는 애인
연애 1번 하고 이상형과 결혼 vs 연애 많이 하고 비이상형과 결혼
환승 이별 당하기 vs 환승할 때마다 추가요금 내기
길거리 공개고백 VS 카톡 공개고백
빛이 100억 있는데 나만 보는 애인 VS 돈이 100억 있는데 바람 피는 애인
(수능날) 대각선에서 신들린 듯이 다리 떠는 친구 VS 뒷자리에서 진짜 신들린 친구
허세 애인 VS 짠돌이 애인
게임에 미친 애인 VS 술에 미친 애인
바둑방송 시청 강요하는 부모님 VS 페이스북 친구 추가하는 부모님
안경 두 개씩 쓰고 다니는 애인 VS 반팔 입고 한쪽 손목에 시계 2개 차고 다니는 애인
말만 번지르르하고 아무것도 안 하는 애인 VS 예고 1도 안하고 바로 행동으로 옮겨버리는 애인
난폭한 애인 VS 찌질한 애인
싫어하는 친구에게 세계 3대 진미 사주기 VS 강남 한복판에서 그 가격만큼의 돈 뿌리기


3. 매운맛 (Spicy) 특징  

1) 친밀한 관계 속에서 발생하는 민감하고 논란이 될 수 있는 갈등
- 특징 설명: 질문들은 주로 친구, 애인, 가족 등 매우 가까운 관계에서 발생할 수 있는 민감한 상황들을 다루고 있습니다. 이로 인해 사람들은 더 큰 갈등을 느끼고, 해당 상황을 상상하기만 해도 불편하거나 화가 날 수 있는 요소를 포함하고 있습니다.
- 예시: “내가 절친 동생 만나기 vs 동생이 내 절친 만나기”는 가까운 사람들 간의 연애 문제를 다룸으로써, 가족과 친구 관계가 얽힐 때의 갈등을 상상하게 합니다.

2) 신체적, 성적인 불편함이나 민망함을 포함한 질문
- 특징 설명: 제시된 질문들은 신체적 접촉, 성적인 뉘앙스, 혹은 민망한 상황을 포함하고 있어 사람들에게 더 큰 불편함과 난처함을 느끼게 만듭니다. 이로 인해 선택이 어렵고, 웃음을 유발하거나 당황하게 만드는 질문들이 많습니다.
- 예시: “친구 팬티 안에 내 손 vs 내 팬티 안에 친구 손”은 신체적 접촉을 통해 상황의 민망함과 난처함을 극대화한 예시입니다.

3) 자존심 및 프라이버시의 노출에 대한 갈등 유발
- 특징 설명: 선택지들이 개인의 자존심이나 프라이버시와 관련된 상황을 설정하여, 어느 쪽도 쉽게 선택할 수 없도록 합니다. 자신의 민감한 부분이 노출되거나 과거의 실수 등이 드러날 때 어떤 것을 감수할지 고민하게 만드는 질문들이 많습니다.
- 예시: “50억 받고 역대 검색기록 공개하기 vs 그냥 살기”는 돈이라는 유혹과 자신의 프라이버시 노출 사이에서 갈등을 유발합니다.

4) 연애 관계에서 발생할 수 있는 신뢰와 질투의 문제
- 특징 설명: 애인과의 관계에서 발생할 수 있는 신뢰의 훼손, 질투심, 혹은 과거의 연애 경험 등을 바탕으로 갈등을 유발하는 질문들이 많습니다. 이러한 질문들은 개인의 연애관과 신뢰도를 탐색하게 만듭니다.
- 예시: “전 애인과 비교하는 애인 vs 전 애인과 비교되는 애인”은 상대방의 발언으로 인해 감정적인 상처를 받는 상황을 설정하여, 선택이 어렵도록 만듭니다.

5) 사회적 금기나 일반적인 상식에서 벗어난 상황
- 특징 설명: 사람들에게 불쾌감을 주거나, 윤리적으로 문제될 수 있는 상황을 설정하여 어떤 금기를 넘을지 고민하게 만드는 질문들이 많습니다. 이로 인해 사람들은 사회적 시선과 자신의 기준 사이에서 고민하게 됩니다.
- 예시: “발가벗고 백화점 들어가면 원하는 물건 공짜라면... 들어간다 vs 안 들어간다”는 공공장소에서의 벌거벗음이라는 사회적 금기를 설정하여, 어떤 상황에서도 그 조건을 감수할지 고민하게 만듭니다.

**매운맛 질문 예시

내가 절친 동생 만나기 vs 동생이 내 절친 만나기
친구 팬티 안에 내 손 VS 내 팬티 안에 친구 손
내 원수랑 바람난 애인 vs 내 절친이랑 바람난 애인
전 애인과 비교하는 애인 VS 전 애인고 비교되는 애인
1년 동안 10명과 사귄 애인 VS 1명과 10년 동안 사귄 애인
애인이 이성과 바람나기 VS 애인이 동성과 바람나기
50억 받고 역대 검색기록 공개하기 vs 그냥 살기
절친에게 꼬리치는 애인 vs 애인에게 꼬리치는 절친
평생 양치 안 하는 애인 vs 평생 샤워 안 하는 애인
(발가벗고 백화점 들어가면 원하는 물건 공짜라면)들어간다 vs 안 들어간다
방귀 뀔 때 트름소리 vs 트름할 때 방귀소리
친구 집에 내 애인 속옷 vs 내 애인 집에 친구 속옷
(야동 보다가) 애인에게 걸리기 vs 부모님께 걸리기
플레이보이 VS 마마보이
1년간 10명 만난 애인 VS 10년간 1명 만난 애인
숨겨진 자녀가 있는 애인 VS 이혼한 사람만 3명 있는 애인
친구의 전 애인과 사귀기 VS 전 애인 친구와 사귀기
입냄새 심각단계 애인과 1시간 키스하기 VS 연인 똥에 1초간 뽀뽀하기
친구 팬티 안에 내 손 VS 내 팬티 안에 친구 손
평생 젖꼭지 한 개로 살기 VS 평생 젖꼭지 세 개로 살기
(엘리베이터 탈 때) 키스하는 커플과 함께 타기 VS 똥 방귀 뀌는 아저씨랑 같이 타기
(무조건 한 곳에 살아야 한다면) 사람 미어터지는 노래방 옆집 VS 사람 미어터지는 모텔 옆집
남사친과 1박 2일 여행 간다는 애인 VS 풀세팅하고 전 애인과 술 마신다는 애인
바람 피운 걸 평생 비밀로 하는 애인 VS 바람 피운 걸 자백하고 봐 달라는 애인

시스템은 항상 JSON 형식으로 응답을 반환해야 합니다.

###입력 예시:
{
  "level": "순한맛"
}

### 출력 예시:
{
  "question": "둘 중 하나를 무조건 선택해야 한다면?",
  "option1": "평생 동안 차가운 물로만 샤워하기",
  "option2": "평생 동안 뜨거운 물로만 샤워하기"
}
`
			const response = await openai.chat.completions.create({
				model: 'gpt-4o', // 모델 이름은 필요에 따라 변경하세요
				messages: [
					{
						role: 'system',
						content: systemPrompt,
					},
					{
						role: 'user',
						content: JSON.stringify({ level: level }),
					},
				],
				temperature: 1.1,
				max_tokens: 4095,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
				response_format: {
					type: 'json_object',
				},
			})

			// 응답 처리
			const questionData = response.choices[0].message.content // 필요한 경우 응답에서 데이터를 추출하세요

			// Firebase에 생성된 질문 저장 (선택 사항)
			await set(ref(database, `rooms/${roomId}/balanceGameQuestion`), {
				...questionData,
				timestamp: new Date().toISOString(),
			})

			console.log(
				`Generated balance game question for room ${roomId}:`,
				questionData,
			)

			// 질문 데이터 반환
			return { status: 200, questionData }
		}
	} catch (error) {
		console.error('Error generating balance game question:', error)
		return {
			status: 500,
			error: 'Failed to generate balance game question',
		}
	}
}
