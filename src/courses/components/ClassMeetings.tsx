import { Meeting, Instructor } from "../../types"
import { CourseContext } from "../Courses";
import { useContext } from "react";

export default function ClassMeetings() {
	const courseCtx = useContext(CourseContext);
	const details = courseCtx!.details;

	if (!details.meetings) return (<></>);

	return (
		<div className="meetings classDetails">
			<h3 className="heading">Meeting Times</h3>
			{details.meetings.map(
				(meeting: Meeting, index: number) => {
					return (
						<div
							key={index}
							style={{ marginBottom: "15px" }}
						>
							<p>
								<strong>Day and Times:</strong>{" "}
								{`${meeting.days} ${meeting.start_time}-${meeting.end_time}`}
							</p>
							<p>
								<strong>Location:</strong>{" "}
								{meeting.location}
							</p>
							<p>
								<strong>Instructor(s):</strong>{" "}
								{meeting.instructors.map((instructor: Instructor, i: number) => (
										<span key={i}>
											{instructor.name}
											{i < meeting.instructors.length - 1 ? ", " : ""}
										</span>
									),
								)}
							</p>
						</div>
					);
				}
			)}
		</div>

	)
}