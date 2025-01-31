import {Component} from 'react'
import Header from './components/Header'

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
    const data = await response.json()
    const updatedData = data.projects.map(project => ({
      id: project.id,
      imageUrl: project.image_url,
      name: project.name,
    }))
    if (response.ok === true) {
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

  renderProjectsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstantStatus.success:
        return this.renderSuccessView()
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
