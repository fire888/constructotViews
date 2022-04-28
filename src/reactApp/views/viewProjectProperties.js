import * as React from 'react'
import { observer } from "mobx-react-lite"
import { AppButton} from '../components/button'
import { Popup } from "../components/popup";
import '../../stylesheets/view-project-list.css'
import { toJS, action } from 'mobx';
import { storeApp } from '../store'
import { sendResponse } from '../../toServerApi/toServerApi'

//
// const updateListGamesFromServer = () => {
//     sendResponse('get-list-projects', null, r => storeApp.setGamesList(r.list))
// }
// const removeProjectAndUpdateList = (id, callback) => {
//     sendResponse('remove-project', { id }, () => {
//         updateListGamesFromServer()
//         callback()
//     })
// }
// const addProjectAndUpdateList = data => {
//     sendResponse('add-project', data, () => {
//         updateListGamesFromServer()
//     })
// }
// const editProjectAndUpdateList = (data, callback) => {
//     sendResponse('edit-project', data, () => {
//         updateListGamesFromServer()
//         callback()
//     })
// }
// updateListGamesFromServer()
//

//let n = 0

const ProjectProperties = observer(() => {

    if (!storeApp.currentGame) {
        return (<></>)
    }

    const itemData = storeApp.gamesList.filter(item => item.id === storeApp.currentGame)[0]

    return (
        <div className={'project-properties list'}>
            <div className='h-50' />
            <div>{itemData.id}</div>
            <div>{itemData.name}</div>
            {/*<div className='area project-list'>*/}
            {/*    projects:*/}
            {/*    <div className='list'>*/}
            {/*        {storeApp.gamesList.map((project, i) => (*/}
            {/*            <ProjectView projectItem={project} key={i} />*/}
            {/*        ))}*/}
            {/*    </div>*/}

            {/*    <div className='h-10' />*/}

            {/*    <AppButton*/}
            {/*        val='add new'*/}
            {/*        callBackClick={action(() => {*/}
            {/*            storeApp.currentGame = null*/}
            {/*            storeApp.popupAddGameIsOpened = true*/}
            {/*        })}/>*/}
            {/*</div>*/}


            {/*{storeApp.popupAddGameIsOpened &&*/}
            {/*<Popup*/}
            {/*    rows={[*/}
            {/*        { type: 'title', val: 'add new game:', },*/}
            {/*        { type: 'text', val: 'name:', },*/}
            {/*        { type: 'input', val: '', },*/}
            {/*    ]}*/}
            {/*    callBackDone={data => {*/}
            {/*        storeApp.popupAddGameIsOpened = false*/}
            {/*        addProjectAndUpdateList({ id: 'id_' + Math.floor(Math.random() * 10000), name: data[2] })*/}
            {/*    }}*/}
            {/*    callBackCancel={action(() => {*/}
            {/*        storeApp.popupAddGameIsOpened = false*/}
            {/*    })}*/}
            {/*/>}*/}

            {/*{storeApp.popupDelGameIsOpened &&*/}
            {/*<Popup*/}
            {/*    rows={[*/}
            {/*        { type: 'title', val: 'delete game:', },*/}
            {/*        { type: 'text', val: storeApp.gamesList.filter(item => item.id === storeApp.currentGame)[0].name, },*/}
            {/*    ]}*/}
            {/*    callBackDone={() => {*/}
            {/*        removeProjectAndUpdateList(storeApp.currentGame, action(() => {*/}
            {/*            storeApp.popupDelGameIsOpened = false*/}
            {/*        }))*/}
            {/*    }}*/}
            {/*    callBackCancel={action(() => {*/}
            {/*        storeApp.popupDelGameIsOpened = false*/}
            {/*    })}*/}
            {/*/>}*/}


            {/*{storeApp.popupEditGameIsOpened &&*/}
            {/*<Popup*/}
            {/*    rows={[*/}
            {/*        { type: 'title', val: 'edit game:', },*/}
            {/*        { type: 'text', val: storeApp.gamesList.filter(item => item.id === storeApp.currentGame)[0].name, },*/}
            {/*        { type: 'input', val: storeApp.gamesList.filter(item => item.id === storeApp.currentGame)[0].name, },*/}
            {/*    ]}*/}
            {/*    callBackDone={data => {*/}
            {/*        editProjectAndUpdateList(*/}
            {/*            { id: storeApp.currentGame, name: data[2] },*/}
            {/*            action(() => storeApp.popupEditGameIsOpened = false)*/}
            {/*        )*/}
            {/*    }}*/}
            {/*    callBackCancel={action(() => {*/}
            {/*        storeApp.popupEditGameIsOpened = false*/}
            {/*    })}*/}
            {/*/>}*/}
        </div>
    )
})







export const createProjectProperties = () => (<ProjectProperties/>)