import { makeAutoObservable, toJS } from 'mobx';

export const storeApp = makeAutoObservable({
    gamesList: [
        'AAAAA',
        'AAAAA',
        'AAAAA',
        'AAAAA',
    ],
    fillGames: arr => {
        storeApp.gamesList = arr
    },
    get gamesAll() {
        return this.gamesList
    }
})


console.log(toJS(storeApp.gamesList))
//storeApp.fillGames([ 'BBBBB' ])
storeApp.gamesList[0] = 'BBBB'
console.log(toJS(storeApp.gamesList))
// setTimeout(() => {
//
//     setTimeout(() => {
//         console.log(toJS(storeApp.gamesList))
//     }, 500)
// },2000)