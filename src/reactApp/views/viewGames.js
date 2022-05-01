import * as React from 'react'
import { toJS, action } from 'mobx';
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'

import { storeGamesScreens } from '../Store/storeGamesScreens'
import { storePopup } from "../Store/storePopup";

import { deleteScreens, setCurrentScreen, duplicateScreens } from './viewScreens'
import { sendResponse } from '../../toServerApi/toServerApi'

import '../../stylesheets/view-project-list.css'


/** TO SERVER AND RETURN RESPONSE ************************/

const updateListGamesFromServer = (callback = () => {}) => {
    sendResponse('get-games', null, action(r => {
        storeGamesScreens.setGamesList(r.list)
        callback()
    }))
}

const addProjectAndUpdateList = (data, callback = () => {}) => {
    const validatedData = validateNewProject(data)
    sendResponse('add-game', validatedData, () => {
        updateListGamesFromServer(callback)
    })
}
const validateNewProject = data => {
    const SCHEME_NEW_PROJECT = {
        'id': 'game_id_' + Math.floor(Math.random() * 1000000000),
        'name': 'projectName',
        'screens': [],
    }
    return { ...SCHEME_NEW_PROJECT, ...data }
}



const duplicateProjectAndUpdateList = (data, callback) => {
    const projectData = storeGamesScreens.gamesList.filter(item => item.id === storeGamesScreens.currentGameID)[0]
    const projectDataCopy = JSON.parse(JSON.stringify(toJS(projectData)))

    duplicateScreens(projectDataCopy.id, screens => {
        const newProjectId = 'game_id_' + Math.floor(Math.random() * 1000000000)
        const newProjectData = {
            ...projectDataCopy,
            name: data.name,
            id: newProjectId,
            screens,
        }
        addProjectAndUpdateList(newProjectData, callback)
    })
}


export const editProjectAndUpdateList = (data, callback) => {
    sendResponse('edit-game', data, () => {
        updateListGamesFromServer()
        callback()
    })
}


const removeProjectAndUpdateList = (data, callback) => {
    deleteScreens(data.id, () => {
        sendResponse('remove-game', { id: data.id }, () => {
            updateListGamesFromServer(callback)
        })
    })
}
updateListGamesFromServer()




/** ACTIONS ON HTML ****************************************************************/

const openPopupAddProject = action(() => {
    storeGamesScreens.currentGameID = null
    storePopup.setData(
        [
            { type: 'title', val: 'add new game:', },
            { type: 'text', val: 'name: ', },
            { type: 'input', val: '', },
        ],
        data => {
            if (data[2] === '') {
                return;
            }
            addProjectAndUpdateList({ name: data[2] }, () => storePopup.clearAll())
        },
        action(() => storePopup.clearAll()),
    )
})


const openPopupEditProject = action(() => {
    const currentProject = storeGamesScreens.gamesList.filter(item => item.id === storeGamesScreens.currentGameID)[0]
    storePopup.setData(
        [
            { type: 'title', val: 'edit game name:', },
            { type: 'text', val: currentProject.name, },
            { type: 'input', val: currentProject.name, },
        ],
        data => {
            const copyProjectData = JSON.parse(JSON.stringify(currentProject))
            copyProjectData.name = data[2]
            editProjectAndUpdateList(copyProjectData, () => storePopup.clearAll())
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupDelProject = action(() => {
    const currentProject = storeGamesScreens.gamesList.filter(item => item.id === storeGamesScreens.currentGameID)[0]
    const copyGameData = JSON.parse(JSON.stringify(toJS(currentProject)))
    storePopup.setData(
        [
            {type: 'title', val: 'delete game:',},
            {type: 'text', val: copyGameData.name ,},
        ],
        () => {
            removeProjectAndUpdateList(copyGameData, action(() => {
                storeGamesScreens.currentGameID = null
                storePopup.clearAll()
            }))
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupDuplicateProject = action(() => {
    const currentProjectName = storeGamesScreens.gamesList.filter(item => item.id === storeGamesScreens.currentGameID)[0].name
    storePopup.setData(
        [
            { type: 'title', val: 'duplicate game:' },
            { type: 'text', val: currentProjectName, },
            { type: 'text', val: 'new name:', },
            { type: 'input', val: currentProjectName, },
        ],
        action(data => {
            if (data[3] === currentProjectName) {
                return;
            }
            duplicateProjectAndUpdateList({ name: data[3] }, () => storePopup.clearAll())
        }),
        action(() => storePopup.clearAll()),
    )
})



/** HTML *****************************************************************/

const ProjectsListView = observer(() => {
    return (
        <div>
            <div>
                projects:
                <div className='h-10' />
                <div className='list'>
                    {storeGamesScreens.gamesList.map((project, i) => (
                        <ProjectView projectItem={project} key={Math.floor(Math.random() * 1000000000)} />
                    ))}
                </div>

                <div className='h-50' />

                <AppButton
                    val='add new project'
                    callBackClick={openPopupAddProject}/>
            </div>
        </div>
    )
})




const ProjectView = observer(({ projectItem }) => {
    const isCurrent = storeGamesScreens.currentGameID === projectItem.id
    return (
        <div>
            {isCurrent && <div className='h-10'/>}

            <AppButton
                val={projectItem.name}
                classNameCustom={isCurrent ? 'current' : ''}
                callBackClick={action(() => {
                    setCurrentScreen(null)
                    storeGamesScreens.currentGameID = projectItem.id
                })} />

            {isCurrent &&
                <div className='inline stretch'>
                    <AppButton val={'edit'} callBackClick={openPopupEditProject} />
                    <AppButton val={'del'} callBackClick={openPopupDelProject} />
                    <AppButton val={'duplicate'} callBackClick={openPopupDuplicateProject} />
               </div>}

            {isCurrent && <div className='h-10'/>}
        </div>
    )
})




export const createViewProjectsList = () => (<ProjectsListView />)
