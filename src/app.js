/*!
 * Gemstone Redmine Theme (https://github.com/pierreavn/gemstone)
 * Copyright 2022-2023 The Gemstone Authors (https://github.com/pierreavn/gemstone/graphs/contributors)
 * Licensed under GPL-3.0 (https://github.com/pierreavn/gemstone/blob/main/LICENSE)
 */

const pkg = require('../package.json');
console.log(`Gemstone Theme v${pkg.version}`);

// Load configuration
const config = require('./config.json');
if (config.debug) {
    console.warn('Starting in debug mode');
    console.log('Loading assets...');
}

const scripts = document.getElementsByTagName("script");
const scriptUrl = scripts[scripts.length-1].src;

// Load vendors
require('./vendors/tabler/tabler.min.js');


$(function() {
    // Load other assets
    const contextLoader = require('./core/context');
    const moduleLoader = require('./core/module');
    const templates = require('./templates');
    const modules = require('./modules');

    // Add form class
    $("form label").addClass("form-label");
    $("em.info").replaceWith(function() {
        return $(`<small />`, {html: $(this).html(), class: "form-hint"});
    });
    $("input[type=text]").addClass("form-control");
    $("input[type=password]").addClass("form-control");
    $("input[type=date]").addClass("form-control");
    $("input[type=checkbox]").addClass("form-check-input mb-3");
    $("textarea").addClass("form-control");
    $("select").addClass("form-select");
    $("input[type=submit]").addClass(`btn btn-${config.color}`);

    // Add alerts class
    $(".flash").addClass("alert");
    $(".flash.error").addClass("alert-danger");

    // Apply colors
    $("#main a, #footer a").addClass(`text-${config.color}`);

    const context = {
        ...contextLoader(config, scriptUrl),
        availableModules: modules,
        config,
    };

    // Determine modules to activate
    let defaultModule = null;
    let hasActivatedPrimaryModule = false;
    for (const module of modules) {
        if (module.key === "default") {
            defaultModule = module;
        }

        if (!module.activators) break;

        let activators = module.activators;
        if (typeof module.activators === 'function') {
            activators = module.activators(context);
        }

        if (Array.isArray(activators)) {
            const elements = activators
                .map(activator => activator.toArray())
                .flat(1);

            if (elements.length > 0) {
                if (config.debug) {
                    console.log(`[module:${module.key}] Activating module for ${elements.length} element(s)`);
                }

                elements.forEach(element => moduleLoader(context, module, $(element)));
                context.activatedModules.push(module);
                hasActivatedPrimaryModule = hasActivatedPrimaryModule || !!module.isPrimary;
            }
        }
    }

    // If no primary module activated, use "default"
    if (!hasActivatedPrimaryModule && defaultModule) {
        if (config.debug) {
            console.log(`[module:default] Activating default module`);
        }

        moduleLoader(context, defaultModule, $("#main"));
        context.activatedModules.push(defaultModule);
    }

    // Clean content
    $("#content > h2").remove();
    $("#content > .tabs").remove();
    $("#admin-menu").remove();

    // Load template
    $("body").html(templates.layout({
        ...context,
        payload: $("#main").html(),
    }));

    // Loaded
    $("body").addClass("loaded");

    if (config.debug) {
        console.log('Context:', context);
    }
});
