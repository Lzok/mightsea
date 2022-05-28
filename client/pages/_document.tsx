import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<link rel="preconnect" href="/fonts.googleapis.com" />
				<link rel="preconnect" href="/fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css"
					rel="stylesheet"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
