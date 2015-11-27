var fs = require("fs");
var enjoy = require("enjoy-js");

var reduce = enjoy.reduce;
var each = enjoy.each;
var apply = enjoy.apply;
var isObject = enjoy.isObject;

function engine () {
    
    var commands = {};
    
    function insertVars (template, vars) {
        return reduce(vars, function (tpl, value, key) {
            return insertVar(tpl, key, value);
        }, template);
    }
    
    function insertVar (template, key, value) {
        return template.split("{$" + key + "}").join("" + value);
    }
    
    function render (path, env) {
        
        var fileName = path.split("/").pop();
        var basePath = path.replace(fileName, "");
        
        return renderTemplate(basePath, fileName, env || {});
    }
    
    function renderTemplate (base, path, vars) {
        
        var template = "" + fs.readFileSync(base + path);
        
        template = insertVars(template, vars);
        template = runCommands(base, vars, template);
        
        // Remove unknown variables:
        return template.replace(/\{\$.*?\}/g, "");
    }
    
    function runCommands (base, vars, template) {
        return reduce(commands, function (tpl, command, name) {
            return runCommand(base, vars, name, tpl, command);
        }, template);
    }
    
    function runCommand (base, vars, name, template, fn) {
        
        return reduce(template.split("{!" + name), function (tpl, part, index) {
            
            if (index > 0) {
                
                var parts = part.split("}")[0].split(" ");
                var command = "{!" + name + parts.join(" ") + "}";
                var chunk;
                
                if (parts.length > 0) {
                    parts.shift();
                }
                
                parts.unshift(vars);
                parts.unshift(base);
                
                chunk = apply(fn, parts);
                
                return tpl.replace(command, chunk);
            }
            
            return tpl;
            
        }, template);
    }
    
    
    commands["include"] = function (base, vars, path) {
        return render(base + path, vars);
    };
    
    commands["list"] = function (base, vars, key, path) {
        
        var chunk = "";
        
        key = key.replace("$", "");
        
        if (key in vars) {
            
            each(vars[key], function (data, i) {
                
                var subData = {};
                
                if (isObject(data)) {
                    each(data, function (value, key) {
                        subData[key] = value;
                    });
                }
                else {
                    subData.content = data;
                    subData.key = i;
                    subData.container = key;
                }
                
                each(vars, function (data, key) {
                    subData["parent." + key] = data;
                });
                
                chunk += render(base + path, subData);
            });
            
        }
        else {
            console.error("Cannot execute list command: No such variable:", key);
        }
        
        return chunk;
        
    };
    
    commands["?"] = function (base, vars, checkVar, commandName) {
        
        var subArgs;
        
        checkVar = checkVar.replace("$", "");
        
        if (!checkVar) {
            console.error("No check variable supplied in ? command.");
            return "";
        }
        
        if (!(checkVar in vars)) {
            console.error("Unknown variable in ? command:", checkVar);
            return "";
        }
        
        if (!commandName) {
            console.error("No command name specified in ? command.");
            return "";
        }
        
        if (!vars[checkVar]) {
            return "";
        }
        
        subArgs = [].slice.call(arguments, 4);
        
        subArgs.unshift(vars);
        subArgs.unshift(base);
        
        return apply(commands[commandName], subArgs);
        
    };
    
    render.commands = commands;
    
    return render;
}

module.exports.render = engine();
module.exports.engine = engine;
