/* global require, describe, it, __dirname */

var assert = require("assert");
var chibi = require("../index.js");
var render = chibi.render;
var engine = chibi.engine;
var base = __dirname;

describe("ChibiPrint", function () {
    
    describe("render(file, data)", function () {
        
        it("renders variables as expected", function () {
            
            var data = {foo: 1, bar: "baz"};
            
            assert.equal(render(base + "/templates/variables.tpl", data), "1 baz");
        });
        
        it("includes other templates as expected", function () {
            
            var data = {foo: 1, bar: "baz"};
            
            assert.equal(render(base + "/templates/includes.tpl", data), "foo 1 bar baz foo 1");
        });
        
        it("renders objects with {!list $items [template file]}", function () {
            
            var data = {
                foo: 2,
                items: {
                    foo: "bar",
                    bar: "baz"
                }
            };
            
            assert.equal(render(base + "/templates/list.tpl", data), "itemsfoobar2itemsbarbaz2");
            
        });
        
        it("renders array with {!list $items [template file]}", function () {
            
            var data = {
                foo: 2,
                items: [
                    "bar",
                    "baz"
                ]
            };
            
            assert.equal(render(base + "/templates/list.tpl", data), "items0bar2items1baz2");
            
        });
        
        it("renders lists of objects containing lists", function () {
            
            var data = {
                foo: 2,
                items: [
                    {
                        title: "foo",
                        tags: ["t1", "t2"]
                    },
                    {
                        title: "bar",
                        tags: ["t3", "t4"]
                    }
                ]
            };
            
            assert.equal(render(base + "/templates/list2.tpl", data), "foot1t2bart3t4");
            
        });
        
        it("executes commands conditionally with {!? $variable command arg1}", function () {
            
            var data = {
                foo: "bar",
                renderItems: true,
                items: [1, 2]
            };
            
            assert.equal(render(base + "/templates/conditionals.tpl", data), "bar12");
            
            data.renderItems = false;
            
            assert.equal(render(base + "/templates/conditionals.tpl", data), "bar");
            
        });
        
        it("allows adding new commands to render.commands", function () {
            
            render.commands.custom = function (base, vars, arg1) {
                return "" + arg1;
            };
            
            assert.equal(render(base + "/templates/custom-command.tpl", {}), "foo");
        });
        
    });
    
    describe("engine()", function () {
        
        it("creates a render function with a new command space", function () {
            
            var render2 = engine();
            
            assert.equal(render(base + "/templates/custom-command.tpl", {}), "foo");
            assert.equal(render2(base + "/templates/custom-command.tpl", {}), "{!custom foo}");
        });
        
    });
    
});
