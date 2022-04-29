const HOST = BACKEND_HOST.trim()

const PATHS = {
    'add-project': `${ HOST }/api/add-project`,
    'remove-project': `${ HOST }/api/remove-project`,
    'edit-project': `${ HOST }/api/edit-project`,
    'get-list-projects': `${ HOST }/api/get-list-projects`,

    'get-project-props': `${ HOST }/api/get-project-props`,
    'edit-project-props': `${ HOST }/api/edit-project-props`,
}



const reqParams = {
    post: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    },
    postFiles: {
        method: 'POST',
        headers: {
            'mode': 'cors',
            'credentials': 'include',
        }
    }
}



const defaultOnSuccess = json =>  console.log(JSON.stringify(json) + ',')
const defaultOnDenied = (mess, response) => console.log('denied' + mess, response)



export function sendResponse (key, data, onDone, offDone) {
    const body = JSON.stringify({...data})
    const params = Object.assign({}, reqParams.post, { body })

    doFetch(PATHS[key], params, onDone || defaultOnSuccess, offDone || defaultOnDenied)
}



// export function uploadFile (key, fileData, onDone, offDone) {
//     const body = new FormData()
//     body.append('id', fileData.id)
//     body.append('type', fileData.type)
//     body.append('fileKey', fileData.type + '_' + fileData.id)
//     body.append('file', fileData.file)
//     const params = Object.assign({}, reqParams.postFiles, { body })
//
//     doFetch(PATHS[key], params, onDone || defaultOnSuccess, offDone || defaultOnDenied)
// }



const doFetch = (path, params, onSuccess, onDenied) => {
    fetch(path, params)
        .then(response => {
            if (response.status === 200) {
                response.json().then(onSuccess)
                return;
            }
            onDenied(response.status, response)
        })
        .catch(err => onDenied('NETWORK ERROR', err))
}

