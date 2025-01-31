"use strict";
/*
  Component for an invidual comment
*/

const   PlayerUIComponent = require("./../lib/player_ui_component"),
        Utils = require("./../lib/utils"),
        moment = require("moment"),
        $ = require('jquery'),
        templateName = 'comment';

module.exports = class Comment extends PlayerUIComponent {

    constructor (data, player) {
        super(player);
        this.commentList = data.commentList;
        this.id = data.id || this.componentId;
        this.meta = data.meta;
        this.body = data.body;
        this.timestamp = moment(data.meta.datetime).unix();
        this.timeSince = this.timeSince();

        this.$el = $(this.render());
    }

    // Serialize data
    get data () {
        return {
            id: this.id,
            meta: this.meta,
            body: this.body
        };
    }

    get HTML () {
        return this.$el[0].outerHTML;
    }

    render () {
        return this.renderTemplate(
            templateName,
            {
                id:         this.id,
                body:       this.body,
                meta:       this.meta,
                timeSince:  this.timeSince,
                disableDelete: this.plugin.options.disableDelete
            }
        );
    }

    // Return time since comment timestamp
    timeSince () {
        return moment(this.meta.datetime).fromNow();
    }

    teardown (destroy=false) {
        super.teardown(destroy);
    }

    // Return a Comment obj given body content and plugin reference
    static newFromData (body, commentList, plugin) {
        let data = this.dataObj(body, plugin);
        return new Comment(data, plugin.player);
    }

    // Return an object with plugin data, timestamp, unique id, and body content
    static dataObj (body, plugin) {
        return {
            meta:   Object.assign({
                        datetime: moment().toISOString()
                    }, plugin.meta),
            id:     Utils.guid(),
            body
        };
    }
}
