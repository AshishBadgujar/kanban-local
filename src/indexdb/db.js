import Localbase from 'localbase'
import { v4 as uuidV4 } from 'uuid'

let db = new Localbase('db')

const dbGetBoard = async () => {
    try {
        let columns = await db.collection('columns').get()
        let cards = await db.collection('cards').get()
        let columnOrder = await db.collection('columnOrder').doc('column-order').get()
        columnOrder = columnOrder?.data || []
        return {
            board: { columns, cards, columnOrder }
        }
    } catch (error) {
        console.log(error)
    }
}
const dbCreateColumn = async (newColumn) => {
    try {
        let id = uuidV4()
        newColumn.id = id
        newColumn.cardIds = []
        let res = await db.collection('columns').add(newColumn, id)
        let array = await db.collection('columnOrder').doc('column-order').get()
        array = array?.data || []
        array.push(res.data.key)
        await db.collection('columnOrder').doc('column-order').set({ data: array })
        return res.data
    } catch (error) {
        console.log(error)
    }
}
const dbUpdateColumn = async (columnId, updateColumn) => {
    try {
        let res = await db.collection('columns').doc(columnId).set(updateColumn)
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
    }
}
const dbDeleteColumn = async (columnId) => {
    try {
        await db.collection('columns').doc(columnId).delete()
        let array = await db.collection('columnOrder').doc('column-order').get()
        array = array?.data || []
        array = array.filter(item => item != columnId)
        await db.collection('columnOrder').doc('column-order').set({ data: array })
    } catch (error) {
        console.log(error)
    }
}
const dbUpdateColumnOrder = async (newColumnOrder) => {
    try {
        await db.collection('columnOrder').doc('column-order').set({ data: newColumnOrder })
    } catch (error) {
        console.log(error)
    }
}

const dbAddCard = async (card, columnId) => {
    try {
        let id = uuidV4()
        card.id = id
        await db.collection('cards').add(card, id)
        let col = await db.collection('columns').doc(columnId).get()
        let cardIds = col.cardIds || []
        cardIds.push(id)
        await db.collection('columns').doc(columnId).update({ cardIds })
    } catch (error) {
        console.log(error)
    }
}
const dbDeleteCard = async (cardId, columnId) => {
    try {
        await db.collection('cards').doc(cardId).delete()
        let col = await db.collection('columns').doc(columnId).get()
        let cardIds = col.cardIds || []
        cardIds.filter(item => item != cardId)
        await db.collection('columns').doc(columnId).update({ cardIds })
    } catch (error) {
        console.log(error)
    }
}
const dbPersistCard = async (columns) => {
    try {
        let values = Object.values(columns);
        console.log(values)
        values = values.map(item => {
            return { ...item, _key: item.id }
        })
        let res = await db.collection('columns').set(values, { keys: true })
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
}

export { dbCreateColumn, dbUpdateColumn, dbDeleteColumn, dbUpdateColumnOrder, dbGetBoard, dbAddCard, dbDeleteCard, dbPersistCard }