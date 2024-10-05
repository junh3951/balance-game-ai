// src/app/[roomId]/category/_components/traffic_light.jsx
'use client'

import React, { useEffect, useState, useRef } from 'react'
import './traffic_light.css'
import { onCategoryClickChange } from '@/data/api/statemanager' // Firebase API 임포트

export default function TrafficLight({ roomId, width = 330, height = 90 }) {
	const [lights, setLights] = useState({
		순한맛: false,
		중간맛: false,
		매운맛: false,
	})

	// 각 카테고리별 타이머를 관리하기 위한 ref
	const timers = useRef({
		순한맛: null,
		중간맛: null,
		매운맛: null,
	})

	// 신호등을 깜빡이게 하는 함수
	const blinkLight = (category) => {
		// 불이 깜빡이도록 설정
		setLights((prevLights) => ({
			...prevLights,
			[category]: false, // 먼저 꺼짐
		}))

		// 기존 타이머가 있으면 클리어
		if (timers.current[category]) {
			clearTimeout(timers.current[category])
		}

		// 깜빡임 효과: 즉시 꺼진 후 100ms 뒤 다시 켜고, 0.5초 후 자동으로 꺼짐
		setTimeout(() => {
			setLights((prevLights) => ({
				...prevLights,
				[category]: true, // 켜짐
			}))

			timers.current[category] = setTimeout(() => {
				setLights((prevLights) => ({
					...prevLights,
					[category]: false, // 0.5초 후 꺼짐
				}))
				timers.current[category] = null // 타이머 초기화
			}, 500)
		}, 100) // 100ms 후 켜짐
	}

	// Firebase에서 카테고리 클릭 변경을 실시간으로 감지
	useEffect(() => {
		const handleCategoryClick = (category) => {
			blinkLight(category) // 카테고리 클릭에 따른 신호등 깜빡임 처리
		}
		onCategoryClickChange(roomId, handleCategoryClick)
	}, [roomId])

	// 신호등 상태에 따라 클래스 적용
	const getLightClass = (isOn) => {
		return isOn ? 'light-on' : 'light-off'
	}

	return (
		<div
			className="trafficlight-horizontal"
			style={{ width: `${width}px`, height: `${height}px` }}
		>
			<div
				className={`light green-horizontal ${getLightClass(
					lights.순한맛, // 순한맛 신호등 (초록색)
				)}`}
			/>
			<div
				className={`light yellow-horizontal ${getLightClass(
					lights.중간맛,
				)}`}
			/>
			<div
				className={`light red-horizontal ${getLightClass(
					lights.매운맛, // 매운맛 신호등 (빨간색)
				)}`}
			/>
		</div>
	)
}
