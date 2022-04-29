import { makeAutoObservable, toJS } from 'mobx';

export const storeGameProps = makeAutoObservable({
    layers: [
        {
            id: '111111',
            name: 'aaaa',
            type: 'img',
        },
        {
            id: '2222',
            name: 'bbbbb',
            type: 'img',
        },
    ],
    currentLayerID: null,
    popupAddLayerIsOpened: false,
    popupDelLayerIsOpened: false,
    setLayersList (list) {
        this.layers.clear()
        for (let i = 0; i < list.length; ++i) {
            this.layers.push(list[i])
        }
    },
})