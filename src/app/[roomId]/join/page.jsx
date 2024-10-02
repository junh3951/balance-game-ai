// app/[roomId]/join/page.jsx
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { userNameState } from '@/recoil/atoms'
import { addParticipant, getRoomData } from '@/data/api/makeroom'

import NameInput from './_components/name_input'
import EnterButton from './_components/enter_button'

export default function JoinPage() {
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    const { roomId } = useParams();

    const handleEnter = async () => {
        const response = await addParticipant(roomId, name);
        if (response.status === 200) {
			console.log('room joined:', response.roomData); //참가 확인 로그
            router.push(`/${roomId}/room`);
        } else if (response.status === 404) {
            alert('방을 찾을 수 없습니다.');
            router.push('/');
        } else {
            alert('참가자 추가에 실패했습니다.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <input
                type="text"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    setIsActive(e.target.value.trim() !== '');
                }}
                placeholder="이름을 입력하세요"
            />
            <button onClick={handleEnter} disabled={!isActive}>참가</button>
        </div>
    );
}