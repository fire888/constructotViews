import { makeAutoObservable, toJS } from 'mobx';

export const storePopup = makeAutoObservable({
    rows: [],
    callBackDone: null,
    callBackCancel: null,
    setData (rows, done, cancel) {
        this.clearAll()
        for (let i = 0; i < rows.length; i++) {
            this.rows.push(rows[i])
        }
        this.callBackDone = done
        this.callBackCancel = cancel
    },
    clearAll () {
        this.rows.clear()
        this.callBackDone = null
        this.callBackCancel = null
    }
})

