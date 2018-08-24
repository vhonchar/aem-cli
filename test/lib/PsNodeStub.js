class PsNodeMock {

    throwError(error) {
        PsNodeMock.error = error
    }

    mockLookup(filters, processes) {
        PsNodeMock[JSON.stringify(filters)] = processes
    }

    lookup(filters, handler) {
        let error = PsNodeMock.error
        let foundProcesses = PsNodeMock[JSON.stringify(filters)] || []
        PsNodeMock.error = null
        PsNodeMock[JSON.stringify(filters)] = null
        handler(error, foundProcesses)
    }
}

module.exports = new PsNodeMock()
