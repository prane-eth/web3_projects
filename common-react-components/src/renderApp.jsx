import React from 'react'
import { createRoot } from 'react-dom/client'
import AppCommon from './AppCommon'

const App = () => (
	<AppCommon
		projectName="Common React Components"
		Home={() => <div>Home component</div>}
		config={{
			"abi": [],
		}}
		contractAddresses={{
			"mumbaiAddress": "0x00",
			"sepoliaAddress": "0x00"
		}}
	/>
)


createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)

