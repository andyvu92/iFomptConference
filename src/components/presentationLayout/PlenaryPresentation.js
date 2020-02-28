import React from 'react'

// import elements
import {PdfFile} from '../Icons'

export default function PlenaryPresentation(props) {
    const isAdmin = document.getElementById('wpadminbar')

    const PdfIcon = () => {
        return { __html: PdfFile }
    }

    return (
        <div className="presentation-session" data-name="plenary">
            <div className="presentations single-column">
                { props.presentations.map( (presentation, index) => {
                    const {time, title, is_title_bold, panel_speakers, chair, invited_speakers,
                            main_speaker, is_main_speaker_the_president, is_q_and_a,
                            second_title, abstract} = presentation
                    let visible = true
                    if (props.selectedPresentationCat === ''){
                        visible = true
                    } else {
                        if( presentation.category.term_id === props.selectedPresentationCat ){
                            visible = true
                        } else {
                            visible = false
                        }
                    }

                    return (
                        visible && is_q_and_a ? (
                            <div className="single-presentation plenary" key={index}>
                                <p className="heading" style={{marginBottom: '0px'}}>
                                    <span className="highlight">{title}</span>
                                </p>
                            </div>
                        ) : (
                            <div className="single-presentation plenary" key={index}>
                                <p className="session-label">{props.sessionLabel}</p>

                                {isAdmin && props.getEdit(props.id)}
                                
                                <p className="time">
                                    {time}
                                </p>
                                <p className="heading">
                                    {is_title_bold ? 
                                        (
                                            <span className="highlight">{title}</span>
                                        ) : (
                                            title
                                        )
                                    }
                                </p>
                                {panel_speakers &&
                                    <div className="additional-speakers">
                                        <p className="label">Panel speakers:</p>
                                        <ul className="presenter-list">
                                            {panel_speakers.map(speaker => 
                                                <li key={speaker.ID}>
                                                    <a href={speaker.ID} className="name get_speaker_details">
                                                        {props.speakers.filter(x => x.id === speaker.ID).map(
                                                            prepend => {return(prepend.acf.position)+' '}
                                                        )}
                                                        {speaker.post_title}
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                }
                                {chair &&
                                    <div className="main-speaker">
                                        <p className="label">Chair:</p>
                                        <a href={chair.ID} className="name get_speaker_details">
                                            {chair.post_title}
                                        </a>
                                    </div>
                                }
                                {second_title &&
                                    <p className="heading">
                                        <span className="highlight">{second_title}</span>
                                    </p>
                                }
                                {main_speaker &&
                                    <div className="main-speaker">
                                        {is_main_speaker_the_president ?
                                            (
                                                <React.Fragment>
                                                    <a href={main_speaker.ID} className="name get_speaker_details">
                                                        {main_speaker.post_title}
                                                    </a>
                                                    <p className="label">President IFOMPT</p>
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <p className="label">Keynote Speaker:</p>
                                                    <a href={main_speaker.ID} className="name get_speaker_details">
                                                        {main_speaker.post_title}
                                                    </a>
                                                </React.Fragment>
                                            )
                                        }
                                    </div>
                                }
                                {invited_speakers &&
                                    <div className="additional-speakers">
                                        <p className="label">Invited speakers:</p>
                                        <ul className="presenter-list">
                                            {invited_speakers.map(speaker => 
                                                <li key={speaker.ID}>
                                                    <a href={speaker.ID} className="name get_speaker_details">
                                                        {props.speakers.filter(x => x.id === speaker.ID).map(
                                                            prepend => {return(prepend.acf.position)+' '}
                                                        )}
                                                        {speaker.post_title}
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                }
                                {abstract &&
                                    <a href={abstract} 
                                        target="_blank" 
                                        rel="noopener noreferer"
                                        className="abstract-url"
                                    >
                                        <span className="button-icon" dangerouslySetInnerHTML={PdfIcon()} />
                                        <span className="button-label">View Abstract</span>
                                    </a>
                                }
                            </div>
                        )
                        
                    )
                })}
            </div>
        </div>
    )
}
