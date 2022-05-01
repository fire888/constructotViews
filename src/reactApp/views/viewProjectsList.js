import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import '../../stylesheets/view-project-list.css'
import { toJS, action } from 'mobx';
import { storeGamesList } from '../Store/GamesList'
import { storeGameProps } from "../Store/GameProperties";
import { storePopup } from "../Store/StorePopup";
import { sendResponse } from '../../toServerApi/toServerApi'
import { updateListLayersFromServer, editListLayersAndUpdateList  } from './viewProjectProperties'


/** TO SERVER AND RETURN RESPONSE ************************/

const updateListGamesFromServer = (callback = () => {}) => {
    sendResponse('get-list-projects', null, r => {
        console.log(r)
        storeGamesList.setGamesList(r.list)
        callback()
    })
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
    const existingCurrentProjectDataCopy = JSON.parse(JSON.stringify(storeGameProps.layers))
    addProjectAndUpdateList(data, () => {
        editListLayersAndUpdateList(data.id, existingCurrentProjectDataCopy, action(() => {
            storeGamesList.currentGameID = data.id
            callback()
        }))
    })
}
export const editProjectAndUpdateList = (data, callback) => {
    sendResponse('edit-project', data, () => {
        updateListGamesFromServer()
        callback()
    })
}
const removeProjectAndUpdateList = (id, callback) => {
    sendResponse('remove-project', { id }, () => {
        updateListGamesFromServer()
        callback()
    })
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
    const currentProjectName = storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0].name
    storePopup.setData(
        [
            {type: 'title', val: 'delete game:',},
            {type: 'text', val: currentProjectName ,},
        ],
        () => {
            removeProjectAndUpdateList(storeGamesList.currentGameID, action(() => {
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
            duplicateProjectAndUpdateList({name: data[3]}, () => storePopup.clearAll())
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
                    val='add new'
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
                    storeGamesList.currentGameID = projectItem.id
                    // updateListLayersFromServer(projectItem.id)
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
