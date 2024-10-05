// app/[roomId]/room/_components/qr_code_generator.jsx
'use client'

import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'

export default function QRCodeGenerator({ roomId }) {
	const qrCodeRef = useRef(null)
	const roomURL = `${window.location.origin}/${roomId}/join`

	// QR 코드 옵션 설정
	const qrCode = new QRCodeStyling({
		width: 200,
		height: 200,
		type: 'svg',
		data: roomURL,
		dotsOptions: {
			color: '#B4B4B4', // QR 코드 점 색상
			type: 'dots', // QR 코드 모양 (네모, 원 등으로 변경 가능)
		},
		cornersSquareOptions: {
			color: '#F8F8F8', // 네모 모서리 색상
			type: 'extra-rounded', // 네모 모서리 모양
		},
		backgroundOptions: {
			color: 'transparent', // QR 코드 배경색 (투명)
		},
		imageOptions: {
			crossOrigin: 'anonymous',
			margin: 7, // 로고 여백
		},
		image: '/logo.png', // QR 코드 중앙에 배치할 로고 이미지
	})

	// 페이지가 로드될 때 QR 코드를 렌더링
	useEffect(() => {
		if (qrCodeRef.current) {
			qrCode.append(qrCodeRef.current)
		}
	}, [qrCodeRef])

	return (
		<div className="my-4 flex justify-center items-center glow-on-hover">
			<div ref={qrCodeRef}></div>
		</div>
	)
}
