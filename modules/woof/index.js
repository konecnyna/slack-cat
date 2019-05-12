'use strict';
const fs = require('fs');
const request = require('request');

module.exports = class Woof extends BaseStorageModule {
    async handle(data) {
        const avatarUrl = await this.getAvatarUrl(data);
        if (!avatarUrl) {
            this.bot.postMessage(data.channel, this.help());
            return;
        }

        const match = this.getUseridMatch(data)
        const cacheUrl = await this.findUserWoof(match[1])
        if (cacheUrl && (!data.args || !data.args.includes('--force'))) {
            this.bot.postMessage(data.channel, `Woof! ${cacheUrl}`);
            return;
        }

        const woofUrl = await this.createWoof(avatarUrl);
        this.bot.postMessage(data.channel, `Woof! ${woofUrl}`);
        this.saveWoofUrl(match[1], woofUrl);
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
