'use strict';
const fs = require('fs');
const request = require('request');

module.exports = class Woof extends BaseModule {
    async handle(data) {
        const avatarUrl = await this.getUser(data);
        if (!avatarUrl) {
            this.bot.postMessage(data.channel, this.help());
            return;
        }

        const woofUrl = await this.createWoof(avatarUrl);
        this.bot.postMessage(data.channel, `Woof! ${woofUrl}`);
    }

    async getUser(data) {
        const regex = new RegExp(/\<\@(.*?)\>/);
        const match = regex.exec(data.user_text);
        if (!match) {
            return null;
        }

        const userData = await this.bot.userDataPromise(match[1]);
        if (userData.error) {
            return null;
        }
        return userData.user.profile.image_512;
    }

    async createWoof(url) {
        const size = 512;
        const aspectRatio = 11 / 17;
        return new Promise((resolve, reject) => {
            request({
                url: 'http://www.woofmaker.com/upload',
                method: 'POST',
                formData: {
                    'x': (size * aspectRatio) / 4,
                    'y': 0,
                    'w': size * aspectRatio,
                    'h': size,
                    'scale_w': size,
                    'scale_h': size,
                    'url': url,
                }
            }, (err, resp, body) => {
                if (err) {
                    reject(err);
                    return;
                }
                const json = JSON.parse(body)
                resolve(json.link)
            });
        });
    }

    help() {
        return `Buzz's girlfriend... woof!\nUsage: ?woof @username`;
    }
};
