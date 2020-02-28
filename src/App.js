import React, {useState, useEffect, useLayoutEffect} from 'react'
import './App.sass'
import axios from 'axios'

// import child components
import DaySelectField from './components/DaySelectField'
import CategoryGrid from './components/CategoryGrid'
import DayListWithPresentations from './components/DayListWithPresentations'

export default function App() {
  // program apis
  const presentationCatApi = 'https://ifomptconference.org/wp-json/wp/v2/program_category/?per_page=100'
  const presentationDateApi = 'https://ifomptconference.org/wp-json/wp/v2/program_date/?per_page=100'
  const presentationApi = 'https://ifomptconference.org/wp-json/wp/v2/program_presentation/?per_page=100'
  const speakerApi = 'https://ifomptconference.org/wp-json/wp/v2/program_speaker/?per_page=100'

  const pdfLabelApi = 'https://ifomptconference.org/wp-json/acf/v3/options/options/pdf_label'
  const pdfLinkApi = 'https://ifomptconference.org/wp-json/acf/v3/options/options/pdf_file'

  // initial states
  const [pdfLabel, setPdfLabel] = useState(null)
  const [pdfLink, setPdfLink] = useState(null)
  const [presentationCats, setPresentationCats] = useState([])
  const [presentationDays, setPresentationDays] = useState([])
  const [toRenderDays, setToRenderDays] = useState([])
  const [selectedPresentationCat, setSelectedPresentationCat] = useState('')
  const [selectedPresentationDay, setSelectedPresentationDay] = useState('')
  const [allPresentations, setAllPresentations] = useState([])
  const [selectedPresentation, setSelectedPresentation] = useState({
    presentation: null,
    day: null,
    dayLabel: null
  })
  const [fullPresentationVisible, setFullPresentationVisible] = useState(false)
  const [speakers, setSpeakers] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // get screen width for responsiveness layout
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  // update screen width on resize
  useLayoutEffect(() => {
    function updateScreenWidth() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateScreenWidth);
    updateScreenWidth();
  }, [])

  // get PDF label and link
  useEffect(() => {
    // get label
    axios.get(pdfLabelApi)
      .then(res => {
        setPdfLabel(res.data.pdf_label)
      })
    // get link
    axios.get(pdfLinkApi)
      .then(res => setPdfLink(res.data.pdf_file))
  }, [])

  // iterate through all pages and get all program presentations 
  const getAllPresentations = async (pageNumber) => {
    const presentations = []
    const randomTimestamp = Math.floor(Math.random() * Math.floor(9999999999))
    for (let page = 1; page <= pageNumber; page += 1) {
      let apiUrl = `${presentationApi}&page=${page}&timestamp=${randomTimestamp}`
      const tempArray = axios.get(apiUrl)
      presentations.push(tempArray)
    }
    await axios.all(presentations)
      .then((response) => {
        const data = response.map(res => res.data)
        setAllPresentations(data.flat().reverse())
        //console.log('%c presentations loaded', 'padding: 10px; border: 1px solid green; background: green; color: white')
      })
      .catch(error => {
        console.log(error)
      })
  }

  // iterate through all pages and get all program speakers 
  const getAllSpeakers = async (pageNumber) => {
    const speakers = []
    for (let page = 1; page <= pageNumber; page += 1) {
      let apiUrl = `${speakerApi}&page=${page}`
      const tempArray = axios.get(apiUrl)
      speakers.push(tempArray)
    }
    await axios.all(speakers)
      .then((response) => {
        const data = response.map(res => res.data)
        setSpeakers(data.flat().reverse())
        //console.log('%c speakers loaded', 'padding: 10px; border: 1px solid green; background: green; color: white')
        setIsDataLoaded(true)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    // get all categories
    if (!isDataLoaded){
      const randomTimestamp = Math.floor(Math.random() * Math.floor(9999999999))
      axios.get(`${presentationCatApi}&timestamp=${randomTimestamp}`)
        .then(response => {
          setPresentationCats(response.data)
        })
        .catch(error => {
          console.log(error)
        })
  
      // get all days
      axios.get(presentationDateApi)
        .then(response => {
          setPresentationDays(response.data)
          setToRenderDays(response.data)
        })
        .catch(error => {
          console.log(error)
        })
  
      // get presentation max page
      axios.get(presentationApi)
        .then(response => {
          getAllPresentations(response.headers['x-wp-totalpages'])
        })
        .catch(error => {
          console.log(error)
        })
  
      // get speaker max page
      axios.get(speakerApi)
        .then(response => {
          getAllSpeakers(response.headers['x-wp-totalpages'])
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [isDataLoaded])

  const handleDayChange = (dayId) => {
    setSelectedPresentationDay(dayId)
    if( dayId !== '' ){
      const tempArray = presentationDays.filter( day => day.id.toString() === dayId )
      setToRenderDays(tempArray)
    } else {
      setToRenderDays(presentationDays)
    }
  }

  const handleCatSelect = (id) => {
    if (id === selectedPresentationCat ){
      setSelectedPresentationCat('')
    } else {
      setSelectedPresentationCat(id)
    }
  }

  const createIntroMarkup = (content) => {
    return {__html: content}
  }

  const setupSpeaker = (id, isMain) => {
    return speakers.filter(x => x.id === id).map(speaker => 
      isMain ? (
        <a key={speaker.id} href={speaker.id} 
          className="main_speaker get_speaker_details">
          {speaker.acf.position} {speaker.title.rendered}
        </a>
      ) : (
        <a key={speaker.id} href={speaker.id} 
          className="name get_speaker_details">
          {speaker.acf.position} {speaker.title.rendered}
        </a>
      )
    )
  }

  const handleCloseAbstractCta = () => {
    setFullPresentationVisible(false)
    setTimeout(() => {
      setSelectedPresentation({
        presentation: null,
        day: null,
        dayLabel: null
      })
    }, 500)
    document.body.style.overflow = ""
  }

  return (
    <div id="program-presentation">
        <section className="day-filter-section">
          <div className="first-col">
            <p className="sub-heading">Filter by day</p>
            <DaySelectField 
              presentationDays={presentationDays}
              handleDayChange={handleDayChange}
            />
          </div>
          <div className="last-col">
            <a href={pdfLink} 
                target="_blank"
                rel="noopener noreferer"
                className="download-pdf">
                  {pdfLabel}
            </a>
          </div>
        </section>

        <section className="category-filter-section">
          <CategoryGrid 
            presentationCats={presentationCats}
            handleCatSelect={handleCatSelect}
            selectedPresentationCat={selectedPresentationCat}
          />
        </section>

        <section className="presentations-section">
          <DayListWithPresentations 
            toRenderDays={toRenderDays}
            selectedPresentationDay={selectedPresentationDay}
            selectedPresentationCat={selectedPresentationCat}
            allPresentations={allPresentations}
            speakers={speakers}
            screenWidth={screenWidth}
            setSelectedPresentation={setSelectedPresentation}
            setFullPresentationVisible={setFullPresentationVisible}
            setupSpeaker={setupSpeaker}
          />

          {selectedPresentation.presentation &&
            <div className={fullPresentationVisible ? "full_abstract active" : "full_abstract"}>
              <div className="abtract_wrapper">
                <h3 className="main_heading">{selectedPresentation.dayLabel}</h3>
                <p className="date">{selectedPresentation.day}</p>
                <h4 className="theme">Theme: {selectedPresentation.presentation.theme}</h4>
                <div className="short_intro" 
                  dangerouslySetInnerHTML={
                    createIntroMarkup(selectedPresentation.presentation.short_intro)
                  }
                />
                <p className="label">Presenter:</p>

                {setupSpeaker(selectedPresentation.presentation.main_speaker.ID, true)}

                {selectedPresentation.presentation.additional_presenters.length > 0 && 
                  <p className="label">Additional presenters:</p>
                }

                <div className="additional_speakers">
                  {selectedPresentation.presentation.additional_presenters.length > 0 && 
                    selectedPresentation.presentation.additional_presenters.map(presenter =>
                      {
                        return (
                          <React.Fragment key={presenter.ID}>{setupSpeaker(presenter.ID)}</React.Fragment>
                        )
                      }
                    )
                  }
                </div>

                <p className="label">About this workshop:</p>
                <div className="abstract_content" 
                    dangerouslySetInnerHTML={
                      createIntroMarkup(selectedPresentation.presentation.full_content)
                    }
                />
              </div>
              <div className="cta_wrapper">
                <span className="close_full_abstract" 
                  onClick={() => {handleCloseAbstractCta()}}>Back to previous</span>
              </div>
            </div>
          }
        </section>
    </div>
  )
}