// app/[roomId]/room/_components/header.jsx
'use client'

export default function Header({ hostName }) {
	return <h1 className="text-2xl font-bold mt-4">{hostName}의 대기실</h1>
}
