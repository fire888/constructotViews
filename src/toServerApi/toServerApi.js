const HOST = BACKEND_HOST.trim()

const PATHS = {
    'add-game': `${ HOST }/api/add-game`,
    'remove-game': `${ HOST }/api/remove-game`,
    'edit-game': `${ HOST }/api/edit-game`,
    'get-games': `${ HOST }/api/get-games`,


    'get-layers': `${ HOST }/api/get-layers`,
    'add-new-layers-list': `${ HOST }/api/add-new-layers-list`,
    'remove-layers': `${ HOST }/api/remove-layers`,
    'edit-layers': `${ HOST }/api/edit-layers`,
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
    console.log(key)
    const body = JSON.stringify({...data})
    const params = Object.assign({}, reqParams.post, { body })

    doFetch(PATHS[key], params, onDone || defaultOnSuccess, offDone || defaultOnDenied)
}


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

