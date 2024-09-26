// app/[roomId]/room/_components/qr_code_generator.jsx
'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeGenerator({ roomId }) {
	const roomURL = `${window.location.origin}/${roomId}/join`

	return (
		<div className="my-4">
			<QRCodeSVG value={roomURL} size={200} />
		</div>
	)
}
