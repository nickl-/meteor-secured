if (Meteor.isClient) {

    Meteor.subscribe("messages");

    Template.CRUD.messages = function () {
        return Messages.find({}).fetch();
    };

    var openMessageDialog = function () {
        Session.set("createError", null);
        Session.set("showMessageDialog", true);
    };

    Template.CRUD.events({
        'click input':function () {
            openMessageDialog();
        }
    });

    Template.CRUD.showMessageDialog = function () {
        return Session.get("showMessageDialog");
    };

    Template.messageDialog.events({
        'click .save':function (event, template) {
            var heading = template.find(".heading").value;
            var message = template.find(".message").value;

            if (heading.length && message.length) {
                Meteor.call('createMessage', {
                    heading:heading,
                    message:message
                }, function (error, message) {
                    if (!error) {
                        Session.set("selected", message);
                        Session.set("showMessageDialog", false);
                    }
                    else
                        Session.set("createError", error.reason);
                });
            } else
                Session.set("createError",
                    "Both heading and message are required fields.");
        },
        'click .cancel':function () {
            Session.set("showMessageDialog", false);
        }
    });

    Template.messageDialog.error = function () {
        return Session.get("createError");
    };
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Meteor.publish("messages", function () {
            return Messages.find({});
        });
    });
}
