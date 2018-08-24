const assert = require('assert')
const proxyquire = require('proxyquire').noPreserveCache()
const decache = require('decache')

const AemStub = require('./lib/AemStub')
const psStub = require('./lib/PsNodeStub')

let exitFuntion = process.exit
let exitCode = 0

describe("CLI interface", () => {
    beforeEach(() => {
        decache('commander')
        AemStub.action = null
        AemStub.options = null
        AemStub.constructorOpts = null;
    })

    describe("Package", () => {

        test({
            title: "test passing of options in installPkg",
            cmd: ['node.exe', 'aem', 'installPkg', 'some-file', '-p', '9999', '-t', '1000'],
            expectedAction: 'installPkg',
            expectedConstructorOpts: { port: "9999" },
            expectedOpts: { timeout: "1000", filepath: 'some-file' }
        })

        test({
            title: "test default options in installPkg",
            cmd: ['node.exe', 'aem', 'installPkg', 'some-file'],
            expectedAction: 'installPkg',
            expectedConstructorOpts: { port: "4502" },
            expectedOpts: { timeout: "30", filepath: 'some-file' }
        })

        testError({
            title: "test exception handler in installPkg",
            cmd: ['node.exe', 'aem', 'installPkg', 'some-file']
        })

    })

    describe("OSGi", () => {
        test({
            title: "test passing of options in installBundle",
            cmd: ['node.exe', 'aem', 'installBundle', 'some-file', '-p', '9999', '-t', '1000'],
            expectedAction: 'installBundle',
            expectedConstructorOpts: { port: "9999" },
            expectedOpts: { timeout: "1000", filepath: 'some-file' }
        })

        test({
            title: "test default options in installBundle",
            cmd: ['node.exe', 'aem', 'installBundle', 'some-file'],
            expectedAction: 'installBundle',
            expectedConstructorOpts: { port: "4502" },
            expectedOpts: { timeout: "5", filepath: 'some-file' }
        })

        testError({
            title: "test exception handler in installBundle",
            cmd: ['node.exe', 'aem', 'installBundle', 'some-file']
        })
    })

    describe("CRX", () => {
        test({
            title: "test passing of options in remove",
            cmd: ['node.exe', 'aem', 'remove', 'path', '-p', '9999', '-t', '1000'],
            expectedAction: 'remove',
            expectedConstructorOpts: { port: "9999" },
            expectedOpts: { timeout: "1000", path: 'path' }
        })

        test({
            title: "test default options in remove",
            cmd: ['node.exe', 'aem', 'remove', 'path'],
            expectedAction: 'remove',
            expectedConstructorOpts: { port: "4502" },
            expectedOpts: { timeout: 0, path: 'path' }
        })

        testError({
            title: "test exception handler in remove",
            cmd: ['node.exe', 'aem', 'remove', 'some-path']
        })
    })

    describe("Startup", () => {
        test({
            title: "test default options in start",
            cmd: ['node.exe', 'aem', 'start'],
            expectedAction: 'start',
            expectedConstructorOpts: { port: 4502, quickstart: "aem-quickstart.jar", runmodes: 'author' },
            expectedOpts: { detached: undefined, additionalOpts: [], timeout: 30 }
        })

        test({
            title: "test passing of options in start",
            cmd: ['node.exe', 'aem', 'start', '-q', 'some-file.jar', '-p', '9999', '-r', 'local', '-d', '-t', '1000'],
            expectedAction: 'start',
            expectedConstructorOpts: { port: "9999", quickstart: "some-file.jar", runmodes: 'local' },
            expectedOpts: { detached: true, additionalOpts: [], timeout: '1000' }
        })

        testError({
            title: "test exception handler in start",
            cmd: ['node.exe', 'aem', 'start']
        })


        test({
            title: "stop should find process by port and stop it with default signal",
            mock: () => {
                psStub.mockLookup({ command: 'java', arguments: '-p,4502' }, [{ pid: 111 }])
            },
            cmd: ['node.exe', 'aem', 'stop', '4502'],
            expectedAction: 'stop',
            expectedConstructorOpts: null,
            expectedOpts: { pid: 111, signal: 'SIGINT' }
        })

        testError({
            title: "stop should handle exception during process stopping",
            mock: () => {
                psStub.mockLookup({ command: 'java', arguments: '-p,4502' }, [{ pid: 111 }])
            },
            cmd: ['node.exe', 'aem', 'stop', '4502']
        })

        testError({
            title: "stop should handle exception during process lookup",
            mock: () => {
                psStub.throwError("some error")
            },
            cmd: ['node.exe', 'aem', 'stop', '4502']
        })

        test({
            title: "stop should do nothing if process were not found",
            mock: () => {
                psStub.mockLookup({ command: 'java', arguments: '-p,4502' }, [null])
            },
            cmd: ['node.exe', 'aem', 'stop', '4502'],
            expectedAction: null,
            expectedConstructorOpts: null,
            expectedOpts: null
        })

    })
})

function test({ title, mock, cmd, expectedAction, expectedConstructorOpts, expectedOpts } = {}) {
    it(title, () => {
        mock && mock()
        aemCli().execute(cmd)

        assert.equal(AemStub.getAction(), expectedAction)
        assert.deepEqual(AemStub.getConstructorOpts(), expectedConstructorOpts)
        assert.deepEqual(AemStub.getOptions(), expectedOpts)
    })
}

function testError({ title, mock, cmd }) {
    it(title, (resolve) => {
        mock && mock()
        AemStub.throwException("some error")

        let cli = aemCli()
        cli.execute(cmd)
        cli.promise.then(() => {
            assert.equal(exitCode, 1)
            resolve()
        })
    })
}

/*
Commander caches arguments if use the same instance, 
so we need to create new one each time like it does in reality
*/
function aemCli() {
    let cli = proxyquire('../index', {
        './lib/AemApplication.js': AemStub,
        'ps-node': { lookup: psStub.lookup }
    })
    exitCode = 0
    process.exit = function (code) {
        exitCode = code
    }
    return cli;
}

process.exit = exitFuntion