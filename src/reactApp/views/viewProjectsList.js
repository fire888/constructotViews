import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import '../../stylesheets/view-project-list.css'
import { storeApp } from '../store'



let n = 0

const ProjectsListView = observer(({ projectsList }) => (
    <div className='area project-list'>
        projects:
        <div className='list'>
            {projectsList.map((project, i) => (
                <ProjectView
                    projectItem={project}
                    onChoise={() => {
                        ++n
                        storeApp.gamesList[i] = 'BBB_' + n
                    }}
                    key={i} />
            ))}
        </div>
    </div>
))


const ProjectView = observer(({ projectItem, onChoise }) => {
    return (
        <AppButton
            val={projectItem}
            callBackClick={onChoise}/>
    )
})




export const createProjectsListView = () => (<ProjectsListView projectsList={storeApp.gamesList} />)
