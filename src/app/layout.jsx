import './globals.css'

export const metadata = {
	title: 'Balance Game AI',
	description: 'Gen AI based balance game project',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
