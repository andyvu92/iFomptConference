import React, {useState} from 'react'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {PdfFile} from '../Icons'

export default function ConcurrentPresentation(props) {
    const isAdmin = document.getElementById('wpadminbar')

    const PdfIcon = () => {
        return { __html: PdfFile }
    }

    const [expanded, setExpanded] = useState(false)
    const [introExpanded, setIntroExpanded] = useState(null)

    const handleChange = panel => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false)
    }

    const handleShortIntroToggle = (compareString) => {
        compareString === introExpanded ? 
            setIntroExpanded(null) : setIntroExpanded(compareString)
    }

    return (
        <div className="presentation-session" data-name="concurrent">
            <div className="presentations multiple">
                {props.presentations.map((presentation, index) => {
                    const tempId = index
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

                    const {session_label, category, presentations, additional_presenters, abstract} = presentation
                    return (
                        props.screenWidth > 767 ? (
                            visible &&
                                <div className="single-presentation concurrent" key={index}>
                                    <p className="label">
                                        {session_label}
                                    </p>
                                    {isAdmin && props.getEdit(props.id)}
                                    <p className="theme">
                                        {category.name}
                                    </p>
                                    <div className="period-wrapper">
                                        {presentations.map((period, index) => {
                                            const {time, title, main_speaker} = period
                                            const compareString = `${index}${time}${title}`
                                            
                                            return (
                                                <div className="single-period" key={index}>
                                                    <p className="time">
                                                        {time}
                                                    </p>
                                                    
                                                    <div className={introExpanded === compareString ? "short-intro-wrapper expanded" : "short-intro-wrapper"}>
                                                        <p className="short-intro">
                                                            {title}
                                                        </p>
                                                        {title !== 'TBA' &&
                                                            <ExpandMoreIcon 
                                                                className="expand-toggle" 
                                                                onClick={() => handleShortIntroToggle(compareString)}
                                                            />
                                                        }
                                                    </div>
                                                    {main_speaker &&
                                                        <p className="main-speaker">
                                                            <span className="label">Convener:</span>
                                                            <a href={main_speaker.ID} className="name get_speaker_details">
                                                                {main_speaker.post_title}
                                                            </a>
                                                        </p>
                                                    }
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
                                        })}
                                    </div>
                                </div>
                        ) : (
                            visible &&
                            <div className="single-presentation concurrent" key={index}>
                                <ExpansionPanel 
                                    expanded={expanded === index} 
                                    onChange={handleChange(index)}
                                    className="accordion-wrapper period-wrapper"
                                >
                                    <ExpansionPanelSummary
                                        className="accordion-header"
                                        expandIcon={<ExpandMoreIcon className="icon" />}
                                    >
                                        <p className="label">
                                            {session_label}
                                        </p>
                                        <p className="theme">
                                            {category.name}
                                        </p>
                                        { presentations.slice(0,1).map((period, index) => {
                                            const {time, title} = period
                                            return (
                                                <p className={expanded === tempId ? "short-intro hidden" : "short-intro"} key={index}>
                                                    <span className="time">{time.replace('am', '').replace('pm', '')}</span>
                                                    <span className="intro">{title}</span>
                                                </p>
                                            )
                                        })}
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails className="accordion-body period-wrapper">
                                        {presentations.map((period, index) => {
                                            const {time, title, main_speaker} = period
                                            return (
                                                <div className="single-period" key={index}>
                                                    <p className="time">
                                                        {time}
                                                    </p>
                                                    <div className="short-intro-wrapper">
                                                        <p className="short-intro">
                                                            {title}
                                                        </p>
                                                    </div>
                                                    {main_speaker &&
                                                        <p className="main-speaker" key={index}>
                                                            <span className="label">Convener:</span>
                                                            <a href={main_speaker.ID} className="name get_speaker_details">
                                                                {main_speaker.post_title}
                                                            </a>
                                                        </p>
                                                    }
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
                                        })}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </div>
                        )
                    )
                })}
            </div>
        </div>
    )
}
