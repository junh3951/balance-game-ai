// 'use client'

// import { useRouter } from 'next/navigation'
// import Button from '@/presentation/components/button'
// import { auth, googleProvider, signInWithPopup } from '@/data/firebase'

// export default function LogInGroup() {
// 	const router = useRouter()

// 	const handleGoogleLogin = async () => {
// 		try {
// 			const result = await signInWithPopup(auth, googleProvider)
// 			// 성공 시 추가 작업
// 			console.log('Google 로그인 성공:', result)
// 			router.push('/main')
// 		} catch (error) {
// 			console.error('Google 로그인 오류:', error)
// 		}
// 	}

// 	return (
// 		<div className="w100 flex flex-col gap-2">
// 			<Button
// 				type="round"
// 				text="이메일로 가입하기"
// 				onClick={() => router.push('/register')}
// 				iconType="google"
// 				disabled={false}
// 			/>
// 			<Button
// 				type="roundW"
// 				text="Google로 시작하기"
// 				onClick={handleGoogleLogin}
// 				iconType="google"
// 				disabled={false}
// 			/>
// 			<Button
// 				type="roundW"
// 				text="Kakao로 시작하기"
// 				onClick={() => router.push('/login')}
// 				iconType="kakao"
// 				disabled={true}
// 			/>
// 			<Button
// 				type="roundW"
// 				text="Naver로 시작하기"
// 				onClick={() => router.push('/login')}
// 				iconType="naver"
// 				disabled={true}
// 			/>
// 			<div className="flex h-12 w-full items-center justify-center">
// 				<div className="font-bold text-sm px-3 text-center text-black">
// 					이미 아이디가 있다면
// 				</div>
// 				<Button
// 					type="roundmini"
// 					text="로그인하기"
// 					onClick={() => router.push('/login')}
// 				/>
// 			</div>
// 			<div className="py-10"></div>
// 		</div>
// 	)
// }
