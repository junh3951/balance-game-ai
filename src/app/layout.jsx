// src/app/layout.jsx
import './globals.css'
import Providers from './providers'

export const metadata = {
	title: 'Balance Game AI',
	description: 'Gen AI based balance game project',
}

export default function RootLayout({ children }) {
	return (
		<html lang="ko">
			<body className="px-4 md:px-8">
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
