import React from 'react'

import {chevronRight} from './Icons'

export default function DaySelectField(props) {
    const createChevronRightMarkup = () => {
        return {__html: chevronRight}
    }
    return (
        <div className="day-select-wrapper">
            <select
                value={props.selectedPresentationDay}
                onChange={e => props.handleDayChange(e.target.value)} 
            >
                <option value=''>All</option>
                { props.presentationDays
                    .sort((a, b) => a.acf.order < b.acf.order ? -1 : 1)
                    .map(day => 
                        <option key={day.id} value={day.id}>{day.name}: {day.acf.label}</option>
                )}
            </select>
            <span className="icon" dangerouslySetInnerHTML={createChevronRightMarkup()} />
        </div>
    )
}


