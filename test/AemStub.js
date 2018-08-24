module.exports = class AemStub {

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
        return new Promise(resolve => resolve({pid: "test pid"}))
    }

    installPkg(filepath, timeout) {
        AemStub.action = 'installPkg'
        AemStub.options = {
            filepath: filepath,
            timeout: timeout
        }
        return new Promise(resolve => resolve())
    }

    installBundle(filepath, timeout) {
        AemStub.action = 'installBundle'
        AemStub.options = {
            filepath: filepath,
            timeout: timeout
        }
        return new Promise(resolve => resolve())
    } 

    remove(path, timeout) {
        AemStub.action = 'remove'
        AemStub.options = {
            path: path,
            timeout: timeout
        }
        return new Promise(resolve => resolve())
    }
}
