const Discord = require('discord.js');
const {prefix, token, channel, interval} = require('./config.json');
const client = new Discord.Client();
const {Builder, By} = require('selenium-webdriver')
require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver')
var links = []

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

client.once('ready', ()=>{
    console.log('ready');
    client.channels.cache.get(channel).send("ready");
})

client.login(token).then(() => {console.log("login")});

function chk(a){
    let driver = new Builder().forBrowser('chrome').build();
    driver.get(links[a]);
    let cheese = driver.findElements(By.className('option-tiles__item '));
    cheese.then(function (elements) {
        if(elements.length===0) {
            console.log("\n\nout of stock\t" + a + "\n\n");
            driver.close();
        }
        else {
            console.log("\n\nin stock\t" + a + "\n\n");
            client.channels.cache.get(channel).send("item in stock!\n" + links[a]);
            links.splice(a);
            driver.close();
        }
    });
}

async function check_stock(){
    for (let i = 0; i < links.length; i++) {
        await console.log(i + "\n");
        await chk(i);
    }
}
setInterval(() => check_stock(), interval);
client.on('message', message =>{
    message.content.toLowerCase();
    if(message.content.startsWith(prefix + " add")){
        links.push(message.content.substring(6, message.content.length));
        console.log("link added " + message.content.substring(6, message.content.length) + "\n")
    } else if(message.content.startsWith(prefix + " remove")){
        for (let j = 0; j < links.length; j ++){
            if (links[j] === message.content.substring(9, message.content.length)){
                links.splice(j);
                console.log("link removed " + message.content.substring(9, message.content.length) + "\n")
            }
        }
    }
})
