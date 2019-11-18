class Namespace {
    constructor(id, nsTItle, img, endpoint) {
        this.id = id
        this.nsTItle = nsTItle
        this.img = img
        this.endpoint = endpoint
        this.rooms = []
    }

    addRoom(roomObj) {
        this.rooms.push(roomObj)
    }
}

module.exports = Namespace