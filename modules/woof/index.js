'use strict';
const fs = require('fs');
const request = require('request');

module.exports = class Woof extends BaseStorageModule {
    async handle(data) {
        const avatarUrl = await this.getAvatarUrl(data);
        if (avatarUrl) {
            const match = await this.getUseridMatch(data)
            const woofUrl = await this.createWoofFromUrl(data, match[1]);
            this.bot.postMessage(data.channel, `Woof! ${woofUrl}`);
            this.saveWoofUrl(match[1], woofUrl);
            return;
        }

        const imgRegex = new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/);
        const imgMatch = imgRegex.exec(data.user_text);
        if (imgMatch) {
            const url = await this.createWoofFromUrl(data, imgMatch[0])
            this.bot.postMessage(data.channel, `Woof! ${url}`);
            this.saveWoofUrl(imgMatch[0], url);
            return;
        }


        this.bot.postMessage(data.channel, this.help());
    }

    async createWoofFromUrl(data, key) {
        const cacheUrl = await this.findUserWoof(key)
        if (cacheUrl && (!data.args || !data.args.includes('--force'))) {
            return cacheUrl;
        }

        return await this.createWoof(key);
    }

    async getAvatarUrl(data) {
        const match = this.getUseridMatch(data);
        if (!match) {
            return null;
        }

        const userData = await this.bot.userDataPromise(match[1]);
        if (userData.error) {
            return null;
        }
        return userData.user.profile.image_512;
    }

    getUseridMatch(data) {
        const regex = new RegExp(/\<\@(.*?)\>/);
        const match = regex.exec(data.user_text);
        return match;
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

    registerSqliteModel() {
        this.WoofModel = this.db.define('woof', {
            userid: { type: this.Sequelize.STRING, primaryKey: true },
            url: this.Sequelize.STRING,
        })
    }

    async saveWoofUrl(userid, url) {
        await this.upsert(
            this.WoofModel,
            { where: { userid: userid } },
            {
                userid: userid,
                url: url,
            },
            {
                url: url,
            }
        );
    }
    async findUserWoof(userid) {
        const woof = await this.WoofModel.findOne({
            where: {
                userid: userid,
            },
        });

        if (!woof) {
            return null;
        }

        return woof.get('url');
    }

    help() {
        return `Buzz's girlfriend... woof!\nUsage: ?woof @username\nUse --force option to update cached image`;
    }
};
