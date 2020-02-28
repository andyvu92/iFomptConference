import React from 'react'

export default function SimplePresentation(props) {
    return (
        <div className="presentation-session">
            {props.presentations.map((presentation, index) => {
                return (
                        <div className="single-presentation simple" key={index}>
                            <p>
                                <span className="time">{presentation.time}</span>
                                <span className="break">:</span>
                                <span className="title">{presentation.title}</span>
                            </p>
                        </div>

                    
                )
            })}
        </div>
    )
}
