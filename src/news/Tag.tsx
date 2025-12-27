export default function Tag({name}: {name: string}) {
	return (
		<span style={{
			background: '#9a9a00ff',
			marginRight: '2px',
			color: '#000000',
			borderRadius: '10px',
			fontSize: '12px',
			padding: '3px',
			whiteSpace: 'nowrap',
			marginTop: '2px'
		}}>
			{name}
		</span>
	)
}