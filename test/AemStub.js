module.exports = class AemStub {

    static throwException(text) {
        AemStub.exception = text
    }

    static getAction() {
        return AemStub.action
    }

    static getOptions() {
        return AemStub.options
    }

    static getConstructorOpts() {
        return AemStub.constructorOpts
    }

    constructor(opts) {
        AemStub.action = null
        AemStub.options = null
        AemStub.constructorOpts = opts;
    }

    start(detached, additionalOpts, timeout) {
        AemStub.action = 'start'
        AemStub.options = {
            detached: detached,
            additionalOpts: additionalOpts,
            timeout: timeout
        }
        return this._emulateHandling({pid: "test pid"})
    }

    installPkg(filepath, timeout) {
        AemStub.action = 'installPkg'
        AemStub.options = {
            filepath: filepath,
            timeout: timeout
        }
        return this._emulateHandling()
    }

    installBundle(filepath, timeout) {
        AemStub.action = 'installBundle'
        AemStub.options = {
            filepath: filepath,
            timeout: timeout
        }
        return this._emulateHandling()
    }

    remove(path, timeout) {
        AemStub.action = 'remove'
        AemStub.options = {
            path: path,
            timeout: timeout
        }
        return this._emulateHandling()
    }

    _emulateHandling(result) {
        return new Promise((resolve, reject) => {
            if(AemStub.exception) {
                let ex = AemStub.exception
                AemStub.exception = null
                reject(ex)
            } else {
                resolve(result)
            }
        })
    }
}
