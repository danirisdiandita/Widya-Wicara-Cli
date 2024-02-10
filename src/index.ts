#! /usr/bin/env node

import * as figlet from 'figlet';
import * as fs from 'fs';
import * as os from 'os';
import axios from 'axios';

import { Command } from 'commander';
const program = new Command();

if (process.argv.includes('-h') || process.argv.includes('--help') || process.argv.length <= 2 ) {
    console.log(figlet.textSync("Wicara Cli"));
}

const writeConfig = async (discord_webhook_url: string): Promise<any> => {
    const configFilePath = `${os.homedir()}/.wcr/config.json`;
    const configDir = `${os.homedir()}/.wcr`;

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true })
    }

    const config = {
        discord_webhook_url
    }
    fs.writeFile(configFilePath, JSON.stringify(config), 'utf-8', () => {
        console.log('config file is successfully written');
    })

}


const sendMessage = async (msg: string): Promise<any> => {
    const configFilePath = `${os.homedir()}/.wcr/config.json`;
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    const payload = {
        content: null, embeds: [
            { title: "Message", description: msg, attachments: [] }
        ]
    }
    axios.post(config.discord_webhook_url,
        payload).then((response) => { console.log('message sent to discord') }).catch((err) => { console.log('error') })
}

program.name('Widya Wicara Command Line Interface').version('0.0.1')
    .description('Widya Wicara Command Line Interface')

program.command('set-config').description('set configuration, example: wcr set-config -dw <DISCORD_WEBHOOK_URL>')
    .option('-dw, --discord_webhook_url', 'input discord webhook url')
    .action((options, str) => {
        if (options.discord_webhook_url) {
            writeConfig(str.args[0]);
        }
    })

program.command('message').description('send message to discord').action((opts, msg) => {
     sendMessage(msg.args[0])
})

program.parse() 