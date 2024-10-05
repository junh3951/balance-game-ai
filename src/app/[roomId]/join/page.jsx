// app/[roomId]/join/page.jsx
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import { addParticipant} from '@/data/api/makeroom'

import NameInput from './_components/name_input'
import EnterButton from './_components/enter_button'

export default function JoinPage() {
    const router = useRouter()
    const { roomId } = useParams()
    const [userName, setUserName] = useRecoilState(userNameState)
    const [loading, setLoading] = useState(false)

    // QR 코드를 통해 접속한 사용자를 방에 추가하는 joinRoom 함수
    const joinRoom = async () => {
        if (!userName.trim()) {
            alert('이름을 입력하세요.')
            return
        }

        setLoading(true)
        
        const response = await addParticipant(roomId, userName)
        
        if (response.status === 200) {
            // 참가가 완료되면 해당 방으로 리디렉션
            router.push(`/${roomId}/room`)
        } else {
            alert('방에 참가할 수 없습니다.')
        }

        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <h1 className="text-2xl font-bold">방에 참가하기</h1>
            <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="border p-2 mt-4"
            />
            <button
                onClick={joinRoom}
                className="bg-blue-500 text-white px-4 py-2 mt-4"
                disabled={loading}
            >
                {loading ? '참가 중...' : '참가하기'}
            </button>
        </div>
    )
}