import Tag from "./Tag";

interface NewsCardProps {
	title: string;
	link: string;
	summary: string;
	published: string;
	categories: string[],
	author: {
		name: string;
		pfp: string;
	}
}

function formatDate(date: string) {
	return new Date(date).toLocaleString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	})
}

export default function NewsCard(props: NewsCardProps) {
	return (
		<div
			className="RSS_FeedItem"
		// style={{ "--delay": `${i * 115}ms` } as React.CSSProperties}
		>
			<a href={props.link} target="_blank" rel="noopener noreferrer">
				{props.title}
			</a>
			<br />
			<div style={{display: 'flex', flexWrap: 'wrap'}}>
				{props.categories.map(c => (<Tag name={c} />))}
			</div>
			<p className="date">{formatDate(props.published)}</p>
			<p>{props.summary}</p>
		</div>
	)
}