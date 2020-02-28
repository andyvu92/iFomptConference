import React from 'react'

// import icons
import {closeIcon} from './Icons'

export default function CategoryGrid(props) {
    const createIconMarkup = (icon) => {
        return {__html: icon}
    }
    return (
        <div className="category-inner-wrapper">
            { props.presentationCats
                .sort((a, b) => a.acf.order < b.acf.order ? -1 : 1).map(cat =>{
                    let isSelected = false
                    if( cat.id === props.selectedPresentationCat ){
                        isSelected = true
                    }
                    let isVisible = cat.acf.visible
                    return (
                        isVisible &&
                            <div key={cat.id} className={isSelected ? "single-cat active" : "single-cat"}
                                onClick={() => props.handleCatSelect(cat.id)}
                            >
                                {isSelected && 
                                    <span className="close-toggle" dangerouslySetInnerHTML={createIconMarkup(closeIcon)} />
                                }
                                <span className="icon" dangerouslySetInnerHTML={createIconMarkup(cat.acf.svg_icon)} />
                                <p className="label">{cat.name}</p>
                            </div>
                    )
            })}
        </div>
    )
}
