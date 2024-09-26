import './globals.css'
import Providers from './providers'

export const metadata = {
	title: 'Balance Game AI',
	description: 'Gen AI based balance game project',
}

export default function RootLayout({ children }) {
	return (
		<html lang="ko">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
