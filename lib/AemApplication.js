'use strict'

const childProcess = require('child_process')
const net = require('net');
const enableDestroy = require('server-destroy');
const terminate = require('terminate');
const request = require('request');
const fs = require('fs');
const extend = require('extend');

module.exports = class AemApplicaiton {

    static get defaultOpts() {
        return {
            url: 'http://localhost',
            quickstart: 'quickstart.jar',
            port: '4502',
            runmodes: 'author,nosamplecontent',
            user: 'admin',
            pass: 'admin'
        }
    } 

    static default() {
        return new AemApplicaiton(defaultOpts)
    }

    constructor(opts) {
        let resolvedOpts = extend(AemApplicaiton.defaultOpts, opts)
        this.url = resolvedOpts.url
        this.quickstart = resolvedOpts.quickstart;
        this.port = resolvedOpts.port;
        this.runmodes = resolvedOpts.runmodes;
        this.opts = resolvedOpts;
    }

    start(detached = false, additionalOpts = [], timeout = 30) {
        this.aemProcess = this._startAemInSeparatedProcess(detached, additionalOpts)

        let startupPromise = new Promise((resolve, reject) => {
            this._rejectOnClosedProcess(reject)
            this._waitForAemToStart(resolve, reject, timeout)
        });

        return startupPromise
    }

    _startAemInSeparatedProcess(detached, additionalOpts) {
        let launchOptions = [
            '-jar', this.quickstart, 
            '-listener-port', '50007', 
            '-r', this.runmodes, 
            '-p', this.port, 
            '-verbose',
            '-nointeractive']
        console.log('Launching JVM: java ' + launchOptions.concat(additionalOpts).join(' '))

        const out = fs.openSync('./out.log', 'w+');
        const err = fs.openSync('./out.log', 'a');

        let aemProcess = childProcess.spawn('java', launchOptions, {
            stdio: ['ignore', out, err ],
            detached: detached
        })

        console.log('Starting AEM process with pid: ' + aemProcess.pid)
        detached && aemProcess.unref();
    
        return aemProcess;
    }

    _rejectOnClosedProcess(reject) {
        this.aemProcess.on('close', (error) => {
            console.log('AEM process is closing with some error.')
            console.log(fs.readFileSync('out.log').toString())
            reject(error)
        });
    }
    
    _waitForAemToStart(resolve, reject, timeoutAfterStart) {
        let aemProcess = this.aemProcess
        let server = net.createServer(function(socket) {
            let statusLine = '';
            socket.on('data', function (messagePart) {
                statusLine += messagePart.toString().trim()
                console.log('Server received: '+ statusLine)
                if( statusLine == 'started') {
                    server.destroy();
                    console.log(fs.readFileSync('out.log').toString())
                    console.log('Waiting ', timeoutAfterStart, ' seconds for just in case ...')
                    setTimeout(() => resolve(aemProcess), timeoutAfterStart * 1000)
                } else if (messagePart.length > 0) {
                    console.log('Appending message and will wait for the next message')
                } else {
                    server.destroy()
                    aemProcess.kill()
                    console.log(fs.readFileSync('out.log').toString())
                    reject('Bad startup response. Killing AEM.')
                }
            });
        });
        enableDestroy(server)
        server.listen(50007)
    }

    stop(pid, signal = 'SIGINT') {
        if(!pid && !this.aemProcess) {
            throw new Error("PID is undefined. (provide it into method or start AEM from this object)")
        }
        return new Promise((resolve, reject) => {
            terminate(pid || this.aemProcess.pid, signal, (err) => {
                if(!err) {
                    resolve()
                } else {
                    reject(err)
                }
            })
        })
    }

    installPkg (filePath, timeout = 30) {
        console.log('Installing ', filePath)
        return new Promise((resolve, reject) => {
            request
                .post(`${this.url}:${this.port}/crx/packmgr/service.jsp`, {
                    'auth': {
                        'user': this.opts.user,
                        'pass': this.opts.pass
                    },
                    formData: {
                        file: {
                            value:  fs.createReadStream(filePath),
                            options: {
                                contentType: 'application/octet-stream'
                            }
                        },
                        'force': 'true',
                        'install': 'true'
                    }
                })
                .on('response', response => console.log(response.statusCode, ' - ', response.statusMessage))
                .on('end', () => {
                    console.log('Waiting ' + timeout + ' seconds for just in case ...')
                    setTimeout(() => resolve(), timeout * 1000)
                })
                .on('error', error => reject(error))
                .pipe(process.stdout)
        })
    }

}