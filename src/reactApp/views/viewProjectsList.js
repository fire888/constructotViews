import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import { Popup } from "../components/popup";
import '../../stylesheets/view-project-list.css'
import { toJS, action } from 'mobx';
import { storeGamesList } from '../Store/GamesList'
import { sendResponse } from '../../toServerApi/toServerApi'
import { updateListLayersFromServer } from './viewProjectProperties'


const updateListGamesFromServer = () => {
    sendResponse('get-list-projects', null, r => storeGamesList.setGamesList(r.list))
}
const removeProjectAndUpdateList = (id, callback) => {
    sendResponse('remove-project', { id }, () => {
        updateListGamesFromServer()
        callback()
    })
}
const addProjectAndUpdateList = data => {
    sendResponse('add-project', data, () => {
        updateListGamesFromServer()
    })
}
const editProjectAndUpdateList = (data, callback) => {
    sendResponse('edit-project', data, () => {
        updateListGamesFromServer()
        callback()
    })
}
updateListGamesFromServer()



const ProjectsListView = observer(() => {
    return (
        <div>
            <div className='area project-list'>
                <div className='h-50' />

                projects:
                <div className='list'>
                    {storeGamesList.gamesList.map((project, i) => (
                        <ProjectView projectItem={project} key={Math.floor(Math.random() * 1000)} />
                    ))}
                </div>

                <div className='h-10' />

                <AppButton
                    val='add new'
                    callBackClick={action(() => {
                        storeGamesList.currentGameID = null
                        storeGamesList.popupAddGameIsOpened = true
                    })}/>
            </div>


            {storeGamesList.popupAddGameIsOpened &&
                <Popup
                    rows={[
                        { type: 'title', val: 'add new game:', },
                        { type: 'text', val: 'name:', },
                        { type: 'input', val: '', },
                    ]}
                    callBackDone={data => {
                        storeGamesList.popupAddGameIsOpened = false
                        addProjectAndUpdateList({ id: 'id_' + Math.floor(Math.random() * 100000000), name: data[2] })
                    }}
                    callBackCancel={action(() => {
                        storeGamesList.popupAddGameIsOpened = false
                    })}
                />}

            {storeGamesList.popupDelGameIsOpened &&
                <Popup
                    rows={[
                        { type: 'title', val: 'delete game:', },
                        { type: 'text', val: storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0].name, },
                    ]}
                    callBackDone={() => {
                        removeProjectAndUpdateList(storeGamesList.currentGameID, action(() => {
                            storeGamesList.currentGameID = null
                            storeGamesList.popupDelGameIsOpened = false
                        }))
                    }}
                    callBackCancel={action(() => {
                        storeGamesList.popupDelGameIsOpened = false
                    })}
                />}


            {storeGamesList.popupEditGameIsOpened &&
                <Popup
                    rows={[
                        { type: 'title', val: 'edit game:', },
                        { type: 'text', val: storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0].name, },
                        { type: 'input', val: storeGamesList.gamesList.filter(item => item.id === storeGamesList.currentGameID)[0].name, },
                    ]}
                    callBackDone={data => {
                        editProjectAndUpdateList(
                            { id: storeGamesList.currentGameID, name: data[2] },
                            action(() => storeGamesList.popupEditGameIsOpened = false)
                        )
                    }}
                    callBackCancel={action(() => {
                        storeGamesList.popupEditGameIsOpened = false
                    })}
                />}
        </div>
    )
})



const ProjectView = observer(({ projectItem }) => {
    return (
        <div className='inline stretch'>
            <AppButton
                val={projectItem.name}
                classNameCustom={projectItem.id === storeGamesList.currentGameID ? 'current' : ''}
                callBackClick={action(() => {
                    storeGamesList.currentGameID = projectItem.id
                    updateListLayersFromServer(projectItem.id)
                })} />

            {storeGamesList.currentGameID === projectItem.id &&
                <>
                    <AppButton
                        val={'del'}
                        callBackClick={action(() => {
                            storeGamesList.popupDelGameIsOpened = true
                        })} />

                    <AppButton
                        val={'edit'}
                        callBackClick={action(() => {
                            storeGamesList.popupEditGameIsOpened = true
                        })} />

                    <AppButton
                        val={'duplicate'}
                        callBackClick={action(() => {
                            console.log('TODO add DUPLICATE')
                            //storeGamesList.popupEditGameIsOpened = true
                        })} />
                </>}
        </div>
    )
})




export const createViewProjectsList = () => (<ProjectsListView />)
