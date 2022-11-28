exports.key = "auth";
exports.isPrimary = true;
exports.template = require('./auth.hbs');

exports.activators = (context) => {
    if ([
        '/login',
        '/account/lost_password',
        '/account/register',
    ].includes(context.pathName)) {
        return [
            $("#content"),
        ]
    }
};

exports.preprocessor = (context, element) => {
    element.find("#errorExplanation").addClass("alert alert-warning");
    element.find("h2").remove();
};
