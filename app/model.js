/** Collection of messages **/
Messages = new Meteor.Collection("messages");

/** Permissions **/
Messages.allow({
    insert: function (userId) {
        return null != this.userId;
    },
    update: function (userId) {
        return null != this.userId;
    },
    remove: function (userId) {
        return false;
    },
    fetch: ['heading', 'message']
});

/** Insert new message with validation **/
Meteor.methods({
    createMessage:function (options) {
        options = options || {};
        if (!(typeof options.heading === "string" &&
            options.heading.length &&
            typeof options.message === "string" &&
            options.message.length))
            throw new Meteor.Error(400, "Required parameter missing");
        if (options.heading.length > 100)
            throw new Meteor.Error(413, "Heading too long");
        if (options.message.length > 1000)
            throw new Meteor.Error(413, "Message too long");
        if (!this.userId)
            throw new Meteor.Error(403, "You must be logged in");

        return Messages.insert({
            author: this.userId,
            heading: options.heading,
            message: options.message
        });
    }
});

