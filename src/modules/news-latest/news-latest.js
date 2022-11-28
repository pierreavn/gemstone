exports.key = "news-latest";
exports.template = require('./news-latest.hbs');

exports.activators = [ $(".news.box > p") ];

exports.preprocessor = (context, element) => {
    const newsLink = element.find("> a:nth-child(2)");
    const projectLink = element.find("> a:nth-child(1)");

    return {
        title: newsLink.text(),
        url: newsLink.attr('href'),
        summary: element.find("> span.summary").html() ?? null,
        author: element.find(".author").html(),
        project: {
            name: projectLink.text(),
            url: projectLink.attr('href'),
        },
    };
};
