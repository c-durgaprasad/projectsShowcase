import './index.css'

const Project = props => {
  const {project} = props
  const {imageUrl, name} = project
  return (
    <li className="card-container">
      <img src={imageUrl} alt={name} className="project-img" />
      <p className="name">{name}</p>
    </li>
  )
}

export default Project
