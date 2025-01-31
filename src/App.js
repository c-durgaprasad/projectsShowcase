import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from './components/Header'
import Project from './components/Project'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstantStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

// Replace your code here
class App extends Component {
  state = {
    activeTab: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiConstantStatus.initial,
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    const {activeTab} = this.state
    this.setState({apiStatus: apiConstantStatus.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeTab}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(project => ({
        id: project.id,
        imageUrl: project.image_url,
        name: project.name,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiConstantStatus.success,
      })
    } else {
      this.setState({apiStatus: apiConstantStatus.failure})
    }
  }

  changeOption = event => {
    this.setState({activeTab: event.target.value}, this.getProjectDetails)
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="ul-list">
        {projectsList.map(project => (
          <Project key={project.id} project={project} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
      </div>
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="oops">Oops! Something Went Wrong</h1>
      <p className="desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry" onClick={this.getProjectDetails}>
        Retry
      </button>
    </div>
  )

  renderProjectsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstantStatus.failure:
        return this.renderFailureView()
      case apiConstantStatus.success:
        return this.renderSuccessView()
      case apiConstantStatus.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeTab} = this.state
    return (
      <div>
        <Header />
        <select
          className="select-input"
          onChange={this.changeOption}
          value={activeTab}
        >
          {categoriesList.map(category => (
            <option key={category.id} value={category.id}>
              {category.displayText}
            </option>
          ))}
        </select>
        {this.renderProjectsView()}
      </div>
    )
  }
}

export default App
