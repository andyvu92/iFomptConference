import React from 'react'

// import child components
import SimplePresentation from './presentationLayout/SimplePresentation'
import WorkshopPresentation from './presentationLayout/WorkshopPresentation'
import PlenaryPresentation from './presentationLayout/PlenaryPresentation'
import ConcurrentPresentation from './presentationLayout/ConcurrentPresentation'

export default function DayListWithPresentations(props) {
    const getEdit = (id) => {
        return <a target="_blank" href={`https://ifomptconference.org/wp-admin/post.php?post=${id}&action=edit&classic-editor`}>Edit</a>
    }

    return (
        <div className="day-list-wrapper">
            {props.toRenderDays
                .sort((a, b) => a.acf.order < b.acf.order ? -1 : 1)
                .map(day => {
                    let visible = true
                    return (
                        visible &&
                        <div key={day.id} className="single-day">
                            <p className="day-heading">
                                <span className="label">{day.name}:</span> {day.acf.label}
                            </p>
                            <div className="presentations-wrapper">
                                { props.allPresentations
                                    .filter(x => x.program_date[0] === day.id)
                                    .sort((a,b) => a.acf.order < b.acf.order ? -1 : 1 )
                                    .map(session => {
                                    // define classes
                                    let presentations = []
                                    let isQandA = false
                                    // get session type
                                    const type = session.acf.type
                                    // get presentations on "type"
                                    if (type === "Workshop"){
                                        presentations = [...session.acf.workshop_presentation]
                                    } else if (type === "Plenary"){
                                        presentations = [...session.acf.plenary_presentation]
                                    } else if (type === "Simple"){
                                        presentations = [...session.acf.simple_presentation]
                                    } else if (type === "Concurrent"){
                                        presentations = [...session.acf.concurrent_presentation]
                                    } else {
                                        isQandA = true
                                    }
                                    return (
                                        <React.Fragment key={session.id}>
                                            {(props.selectedPresentationCat === '' && type === "Simple") &&
                                                <SimplePresentation 
                                                    presentations={presentations}
                                                />
                                            }

                                            {(props.selectedPresentationCat === '' && isQandA) &&
                                                <div className="presentation-session">
                                                    <div className="single-presentation q-and-a">
                                                        <p>Q & A</p>
                                                    </div>
                                                </div>
                                            }

                                            {type === "Workshop" && 
                                                <WorkshopPresentation
                                                    id={session.id}
                                                    setupSpeaker={props.setupSpeaker}
                                                    getEdit={getEdit}
                                                    presentations={presentations}
                                                    speakers={props.speakers}
                                                    screenWidth={props.screenWidth}
                                                    selectedPresentationCat={props.selectedPresentationCat}
                                                    setSelectedPresentation={props.setSelectedPresentation}
                                                    dayLabel={day.acf.label}
                                                    day={day.name}
                                                    setFullPresentationVisible={props.setFullPresentationVisible}
                                                />
                                            }
                                            { (props.selectedPresentationCat === '' || props.selectedPresentationCat === 216) &&
                                                type === "Plenary" && 
                                                    <PlenaryPresentation
                                                        id={session.id}
                                                        getEdit={getEdit}
                                                        presentations={presentations} 
                                                        selectedPresentationCat={props.selectedPresentationCat}
                                                        sessionLabel={session.title.rendered}
                                                        speakers={props.speakers}
                                                    />
                                            }

                                            {(props.selectedPresentationCat !== '' && type === "Plenary") 
                                                && props.selectedPresentationCat !== 215 &&
                                                <div className="session-break"></div> 
                                            }

                                            { (props.selectedPresentationCat === '' 
                                                || props.selectedPresentationCat === 217 
                                                || props.selectedPresentationCat === 218) 
                                                && type === "Concurrent" && 
                                                <ConcurrentPresentation
                                                    id={session.id}
                                                    setupSpeaker={props.setupSpeaker}
                                                    getEdit={getEdit}
                                                    presentations={presentations}
                                                    selectedPresentationCat={props.selectedPresentationCat}
                                                    screenWidth={props.screenWidth}
                                                />
                                            }
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }
            )}
        </div>
    )
}
