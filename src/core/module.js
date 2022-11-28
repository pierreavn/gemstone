module.exports = (context, module, element) => {
    // Add style selector
    element.addClass(`module--${module.key}`);

    // Apply pre-processor script
    let data;
    if (module.preprocessor) {
        if (context.config.debug) {
            console.log(`[module:${module.key}] Running pre-processor...`);
        }

        data = module.preprocessor(context, element);
        
        if (context.config.debug) {
            console.log(`[module:${module.key}] Data:`, data);
        }
    }

    // Apply template
    if (module.template) {
        const payload = module.template({
            ...context,
            payload: element.html(),
            data: data || {},
        });

        element.html(payload);
    } else if (context.config.debug) {
        console.warn(`[module:${module.key}] No template found!`);
    }

    // Apply post-processor script
    if (module.postprocessor) {
        if (context.config.debug) {
            console.log(`[module:${module.key}] Running post-processor...`);
        }

        module.postprocessor(context, element);
    }
}
