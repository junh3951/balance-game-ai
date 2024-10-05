'use client'

export default function GenerateGameButton({ isActive, onClick }) {
	return (
		<div className="fixed bottom-0 pb-8 w-full flex justify-center">
			<button
				onClick={onClick}
				disabled={!isActive}
				className={`button w-3/4 h-16 rounded-lg select-none transition-all duration-150 ${
					isActive
						? 'bg-blue-500 text-white cursor-pointer'
						: 'bg-gray-400 text-gray-200 cursor-not-allowed'
				}`}
				role="button"
			>
				<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
					게임 생성
				</span>
			</button>
		</div>
	)
}
