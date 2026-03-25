import { useContext } from "react";
import { CourseContext } from "../Courses";
import { Meeting, SecondarySection } from "../../types";
import MeetingInfo from "./MeetingInfo";
import { statusEmoji } from "../StatusEmoji";

/* a class has multiple discussion sections. Each discussion section can have multiple meeting times */

export default function Section({ section }: { section: SecondarySection }) {
	const courseCtx = useContext(CourseContext);
	if (!courseCtx!.details.secondary_sections) return (<></>);
	const text = `${statusEmoji(section.enrl_status)} Enrolled: ${section.enrl_total}/${section.capacity}`;

	return (
		<div className="section-card">
			<div className="section-card2">
				<div className="SectionInformation">
					<div style={{ marginBottom: "10px" }}>
						<p style={{ margin: "-8px 0" }}>
							{text}
						</p>
					</div>

					<div>
						{section.meetings.map((m: Meeting, _: number) => (<MeetingInfo meeting={m}/>))}
					</div>
				</div>

				{/* <div className="SectionCalendarButtons">
										<button
											onClick={() => {
												const ics =
													generateIcsForSection(
														details
															.primary_section
															.subject,
														details
															.primary_section
															.catalog_nbr,
														details
															.primary_section
															.title_long,
														section.class_nbr,
														section.meetings ||
														[],
														term,
													);
												const blob = new Blob(
													[ics],
													{
														type: "text/calendar",
													},
												);
												const url =
													URL.createObjectURL(
														blob,
													);
												const a =
													document.createElement(
														"a",
													);
												a.href = url;
												a.download = `${details.primary_section.subject}-${details.primary_section.catalog_nbr}-${section.class_nbr}.ics`;
												a.click();
												URL.revokeObjectURL(url);
											}}
											className="pisaButton"
											style={{
												marginBottom: "8px",
												padding: "6px 12px",
												fontSize: "15px",
											}}
										>
											<img
												src={DownloadIcon}
												alt="Download calendar icon"
												width="28"
												height="28"
												style={{
													verticalAlign: "middle",
												}}
											/>
											Download Calendar .ics
										</button>

										<button
											onClick={() => {
												const meeting =
													section.meetings?.[0];
												if (!meeting) return;

												const link =
													generateGoogleCalendarLink(
														details
															.primary_section
															.subject,
														details
															.primary_section
															.catalog_nbr,
														details
															.primary_section
															.title_long,
														section.class_nbr,
														meeting,
														term,
														"Section",
													);

												window.open(link, "_blank");
											}}
											className="pisaButton"
											style={{
												marginBottom: "8px",
												padding: "6px 12px",
												fontSize: "15px",
											}}
										>
											<img
												src={GoogleCalendarIcon}
												alt="Add to Google Calendar icon"
												width="28"
												height="28"
											/>
											Add to Google Calendar
										</button>
									</div> */}
			</div>
		</div>
	);
}