import * as React from 'react'
import { makeObservable, observable, computed, action } from "mobx"
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import '../../stylesheets/view-project-list.css'



class Project {
    id = Math.random()
    title = ""
    current = false

    constructor(title) {
        makeObservable(this, {
            title: observable,
            current: observable,
            toggle: action
        })
        this.title = title
    }

    toggle() {
        console.log('----')
        this.current = !this.current
    }
}



class ProjectsList {
    projects = []
    get unfinishedTodoCount() {
        return this.projects.filter(todo => !todo.finished).length
    }
    constructor(projects) {
        makeObservable(this, {
            projects: observable,
            unfinishedTodoCount: computed
        })
        this.projects = projects
    }
}




const ProjectsListView = observer(({ projectsList }) => (
    <div className='area project-list'>
        projects:
        <div className='list'>
            {projectsList.projects.map(project => (
                <ProjectView project={project} key={project.id} />
            ))}
        </div>
    </div>
))


const ProjectView = observer(({ project }) => {
    return (
    <AppButton
        val={project.title}
        classNameCustom={project.current ? 'current' : ''}
        callBackClick={() => {project.toggle()}} />
    )
})



const store = new ProjectsList([
    new Project("Get Coffee"),
    new Project("Write simpler code"),
    new Project("Write simpler code"),
    new Project("Write simpler code"),
    new Project("Write simpler code"),
])



export const createProjectsListView = () => (<ProjectsListView projectsList={store} />)

