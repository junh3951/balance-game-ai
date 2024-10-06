import React, { useEffect, useState } from 'react'
import './option_button.css'

export default function OptionButton({
	optionText,
	color,
	textColor,
	borderRadius,
	fontSize = '18px',
	fontWeight = 'normal',
}) {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		// 페이지 로드 후 애니메이션 시작
		const timeout = setTimeout(() => {
			setIsVisible(true)
		}, 100) // 짧은 딜레이 후 시작

		return () => clearTimeout(timeout)
	}, [])

	return (
		<div
			className={`option-button ${isVisible ? 'visible' : ''}`}
			style={{
				borderRadius: borderRadius,
				background: color,
				color: textColor,
				fontSize: fontSize,
				fontWeight: fontWeight,
			}}
		>
			{optionText}
		</div>
	)
}
