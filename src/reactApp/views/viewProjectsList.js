import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import '../../stylesheets/view-project-list.css'
import { toJS, action } from 'mobx';
import { storeGamesList } from '../Store/GamesList'
import { storePopup } from "../Store/StorePopup";
import { sendResponse } from '../../toServerApi/toServerApi'
import { mapFunctionToData } from '../helpers/pipelines'


/** TO SERVER AND RETURN RESPONSE ************************/

const updateListGamesFromServer = (callback = () => {}) => {
    sendResponse('get-list-projects', null, action(r => {
        storeGamesList.setGamesList(r.list)
        callback()
    }))
}

const addProjectAndUpdateList = (data, callback = () => {}) => {
    const validatedData = validateNewProject(data)
    sendResponse('add-project', validatedData, () => {
        updateListGamesFromServer(callback)
    })
}
const validateNewProject = data => {
    const SCHEME_NEW_PROJECT = {
        'id': 'project_id_' + Math.floor(Math.random() * 1000000000),
        'name': 'projectName',
        'screens': [],
    }
    return { ...SCHEME_NEW_PROJECT, ...data }
}



const duplicateProjectAndUpdateList = (data, callback) => {
    const projectData = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0]
    const projectDataCopy = JSON.parse(JSON.stringify(toJS(projectData)))

    /** create new screens data copy **********/
    const dataToMapDuplicateScreens = []
    if (projectDataCopy.screens && projectDataCopy.screens.length > 0) {
        for (let i = 0; i < projectDataCopy.screens.length; ++i) {
            dataToMapDuplicateScreens.push({
                ...projectDataCopy.screens[i],
                id: 'screen_id_' + Math.floor(Math.random() * 100000000),
                layersID: 'layers_ID_' + Math.floor(Math.random() * 100000000),
            })
        }
    }

    const newProjectId = 'project_id_' + Math.floor(Math.random() * 1000000000)
    const newProjectData = {
        ...projectDataCopy,
        name: data.name,
        id: newProjectId,
        screens: dataToMapDuplicateScreens
    }

    addProjectAndUpdateList(newProjectData, () => {
        storeGamesList.currentGameID = newProjectId

        const createScreensToMap = []
        for (let i = 0; i < dataToMapDuplicateScreens.length; ++i) {
            createScreensToMap.push(['add-screen-layers', { id: dataToMapDuplicateScreens[i].layersID }])
        }
        mapFunctionToData(createScreensToMap, sendResponse, () => {
            callback()
        })
    })
}


export const editProjectAndUpdateList = (data, callback) => {
    sendResponse('edit-project', data, () => {
        updateListGamesFromServer()
        callback()
    })
}


const removeProjectAndUpdateList = (data, callback) => {
    const dataProject = toJS(data)

    /** delete screens */
    const dataToMapDeleteScreens = []
    if (dataProject.screens && dataProject.screens.length > 0) {
        for (let i = 0; i < data.screens.length; i++) {
            if (data.screens[i] && data.screens[i].layersID) {
                dataToMapDeleteScreens.push([ 'remove-screen-layers', { id: data.screens[i].layersID } ])
            }
        }
    }
    mapFunctionToData(dataToMapDeleteScreens,  sendResponse, () => {
            /** delete project */
            sendResponse('remove-project', { id: data.id }, () => {
                updateListGamesFromServer()
                callback()
            })
        }
    )
}
updateListGamesFromServer()




/** ACTIONS ON HTML ****************************************************************/

const openPopupAddProject = action(() => {
    storeGamesList.currentGameID = null
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
    const currentProject = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0]
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
    const currentProject = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0]
    storePopup.setData(
        [
            {type: 'title', val: 'delete game:',},
            {type: 'text', val: currentProject.name ,},
        ],
        () => {
            removeProjectAndUpdateList(currentProject, action(() => {
                storeGamesList.currentGameID = null
                storePopup.clearAll()
            }))
        },
        action(() => storePopup.clearAll()),
    )
})

const openPopupDuplicateProject = action(() => {
    const currentProjectName = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0].name
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
                    {storeGamesList.gamesList.map((project, i) => (
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
    const isCurrent = storeGamesList.currentGameID === projectItem.id
    return (
        <div>
            {isCurrent && <div className='h-10'/>}

            <AppButton
                val={projectItem.name}
                classNameCustom={isCurrent ? 'current' : ''}
                callBackClick={action(() => {
                    storeGamesList.currentScreenID = null
                    storeGamesList.currentGameID = projectItem.id
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
