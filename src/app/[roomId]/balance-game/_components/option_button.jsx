// src/app/[roomId]/balance-game/_components/option_button.jsx

import React from 'react'

export default function OptionButton({
	optionText,
	color,
	textColor,
	borderRadius,
	onSelect,
	fontSize = '18px', // 기본 폰트 크기
	fontWeight = 'normal', // 기본 폰트 굵기
}) {
	return (
		<button
			style={{
				display: 'flex',
				width: '180px',
				height: '454px',
				padding: '100px 31px',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '20px',
				flexShrink: '0',
				borderRadius: borderRadius,
				background: color,
				color: textColor,
				boxShadow:
					'0px 1px 4px 0px rgba(0, 0, 0, 0.20), 0px 0px 10px 0px rgba(0, 0, 0, 0.10)',
				fontSize: fontSize, // 폰트 크기 적용
				fontWeight: fontWeight, // 폰트 굵기 적용
			}}
			onClick={onSelect}
		>
			{optionText}
		</button>
	)
}
