import React from 'react'

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function WorkshopPresentation(props) {
    const isAdmin = document.getElementById('wpadminbar')

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    const handlePresentationSelect = (pre) => {
        document.body.style.overflow = "hidden"
        props.setFullPresentationVisible(true)
    }

    return (
        <div className="presentation-session">
            <div className="presentations multiple">
                {props.presentations.map( (presentation, index) => {
                    const {theme, time, is_continued, short_intro,
                            main_speaker, additional_presenters} = presentation
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
                        visible &&
                        <div className="single-presentation workshop" key={index}>
                            { props.screenWidth > 767 ? (
                                <React.Fragment>
                                    <p className="theme">
                                        <span className="label">Theme: </span>
                                        <span className="name">{theme} {is_continued && <span>(Cont'd)</span>}</span>
                                    </p>

                                    {isAdmin && props.getEdit(props.id)}

                                    <p className="time">{time}</p>
                                    <p className="short-intro">{short_intro}</p>

                                    <p className="main-speaker">
                                        <span className="label">Presenter:</span>
                                        <a href={main_speaker.ID} className="name get_speaker_details">
                                            {main_speaker.post_title}
                                        </a>
                                    </p>

                                    {additional_presenters &&
                                        <div className="additional-speakers">
                                            <p className="label">Additional presenters:</p>
                                            <ul className="presenter-list">
                                                {additional_presenters.map(speaker => 
                                                    <li key={speaker.ID}>
                                                        {props.setupSpeaker(speaker.ID)}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    }

                                    <div className="read-more-wrapper">
                                        <button className="read-more" onClick={() => 
                                            {props.setSelectedPresentation({
                                                presentation: presentation,
                                                day: props.day,
                                                dayLabel: props.dayLabel
                                            }); handlePresentationSelect()}}
                                        >
                                            <span className="readmore-icon"></span>
                                            Read more
                                        </button>
                                    </div>
                                </React.Fragment>
                            ) : (
                                <ExpansionPanel 
                                    expanded={expanded === index} 
                                    onChange={handleChange(index)}
                                    className="accordion-wrapper"
                                >
                                    <ExpansionPanelSummary
                                        className="accordion-header"
                                        expandIcon={<ExpandMoreIcon className="icon" />}
                                    >
                                        <p className="time">{time}</p>
                                        <p className="theme">{theme}</p>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails className="accordion-body">
                                        <p className="short-intro">{short_intro}</p>

                                        <p className="main-speaker">
                                            <span className="label">Speaker:</span>
                                            <a href={main_speaker.ID} className="name get_speaker_details">
                                                {main_speaker.post_title}
                                            </a>
                                        </p>

                                        {additional_presenters &&
                                            <div className="additional-speakers">
                                                <p className="label">Additional presenters:</p>
                                                <ul className="presenter-list">
                                                    {additional_presenters.map(speaker => 
                                                        <li key={speaker.ID}>
                                                            {props.setupSpeaker(speaker.ID)}
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        }

                                        <div className="read-more-wrapper">
                                            <button className="read-more" onClick={() => 
                                                {props.setSelectedPresentation({
                                                    presentation: presentation,
                                                    day: props.day,
                                                    dayLabel: props.dayLabel
                                                }); handlePresentationSelect()}}
                                            >
                                                <span className="readmore-icon"></span>
                                                Read more
                                            </button>
                                        </div>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
