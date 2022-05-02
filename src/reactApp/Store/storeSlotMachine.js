import { makeAutoObservable, toJS } from 'mobx';

export const storeSlotMachine = makeAutoObservable({
    currentId: null,
    currentName: null,

    columnsNum: 0,
    rowsNum: 0,

    horDivider: 0,
    vertDivider: 0,

    offsetTop: 0,
    offsetBottom: 0,
    offsetLeft: 0,
    offsetRight: 0,
})


