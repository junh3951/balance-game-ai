// app/home/_components/name_input.jsx
'use client'

export default function NameInput({ name, setName }) {
	return (
		<input
			type="text"
			value={name}
			onChange={(e) => setName(e.target.value)}
			placeholder="이름을 입력하세요"
			className={`w-64 h-12 bg-gradient-to-r border-2 from-gray-300 to-gray-400 shadow-[rgba(0,0,0,0.15)_0px_3px_6px,rgba(0,0,0,0.15)_0px_6px_12px] rounded-lg px-4 text-gray-700 font-bold transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-gray-500 ${
				name.trim()
					? 'translate-y-1 shadow-[rgba(0,0,0,0.15)_0px_1px_2px,rgba(0,0,0,0.15)_0px_2px_4px]'
					: 'shadow-[rgba(0,0,0,0.15)_0px_10px_0_0,#9e9e9e_0_10px_0_0]'
			}`}
			style={{
				transform: name.trim() ? 'translateY(5px)' : 'translateY(-5px)', // 눌려있는 효과
			}}
		/>
	)
}
