const { execSync } = require('node:child_process');

exports.default = async function(context) {

    const { appOutDir, electronPlatformName } = context;

    console.log('-----------------------------------')
    console.log('---------- Castlabs Sign ----------')
    console.log('-----------------------------------')
    
    if(electronPlatformName === 'linux') {
        console.log('Widevine CDM does not support VMP.')
        console.log('Aborting VMP sign...')
        return;
    }


    const exec = execSync('python3 -m castlabs_evs.vmp sign-pkg ' + appOutDir);
    console.log(exec.toString('utf-8'))
    
}