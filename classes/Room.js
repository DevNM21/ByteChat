class Room {
    constructor(id, roomTitle, namespace, privateRoom = false) {
        this.id = id
        this.roomTitle = roomTitle
        this.namespace = namespace
        this.privateRoom = privateRoom
        this.history = []
    }
    addMessage(message) {
        this.history.push(message)
    }
    clearHistory() {
        this.history = []
    }
}

module.exports = Room