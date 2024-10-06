'use client'

export default function EnterButton({ isActive, onEnter }) {
	return (
		<div className="fixed bottom-0 pb-8 w-full flex justify-center">
			<div
				className={`flex mt-4 space-x-4 transition-transform duration-150 ${
					isActive ? 'translate-y-[-10px]' : 'translate-y-0'
				}`}
			>
				<button
					onClick={onEnter}
					disabled={!isActive}
					className={`button w-40 h-16 rounded-lg select-none transition-all duration-150 border-b-[1px] ${
						isActive
							? 'bg-gradient-to-r from-[#4A4A4A] to-[#6A6A6A] cursor-pointer text-white [box-shadow:0_10px_0_0_#4A4A4A,0_15px_0_0_#6A6A6A] active:translate-y-2 active:[box-shadow:0_0px_0_0_#4A4A4A,0_0px_0_0_#6A6A6A] active:border-b-[0px] border-[#5A5A5A]'
							: 'bg-gray-400 cursor-not-allowed text-gray-200 border-gray-400'
					}`}
					role="button"
				>
					<span className="flex flex-col justify-center items-center h-full font-bold text-lg">
						참가하기
					</span>
				</button>
			</div>
		</div>
	)
}
