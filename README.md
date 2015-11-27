# ChibiPrint

A really tiny template engine for Node.js.

## Usage

```html
<!-- index.html -->
{!include header.html}
        <h1>{$title}</h1>
        
        <div class="posts">
            {!list $posts post.html}
        </div>
    </body>
</html>
```

```html
<!DOCTYPE html>
<!-- header.html -->
<html>
    <header>
        <title>{$title}</title>
    </header>
    <body>
```

```html
<!-- post.html -->
            <div class="post">
                <h2>{$title}</h2>
                <div class="body">
                    {$text}
                </div>
                {!? $tags include tags.html}
            </div>
```

```html
<!-- tags.html -->
                <div class="tags">
                    {!list $tags tag.html}
                </div>
```

```html
<!-- tag.html -->
                    <a class="tag" href="tag/{$content}/">{$content}</a>
```

```javascript
var fs = require("fs");
var render = require("chibiprint").render;

var data = {
    title: "My cool blog",
    posts: [
        {
            title: "Today I ate noodles",
            text: "They were really delicious. I can recommend it.",
            tags: [
                "noodles", "delicious"
            ]
        },
        {
            title: "Went to see Iron Maiden",
            text: "Best. Concert. Ever. 'Nough said."
        }
    ]
};

fs.writeFileSync("out/index.html", render("index.html", data));
```

## Syntax

### {$[variable name]}

Prints the content of a variable. If the variable doesn't exist, nothing is printed.

### {!list [variable] [template file]}

The list command renders the items in an array or object using another template file.

If the item itself is an object, the object's properties are available in the list template as variables. The parent template's variables are available in the list template prefixed with "parent.", e.g. `{$parent.title}`.

If the item is a primitve value like string or number, `{$key}` can be used for the item's key or index, and `{$content}` prints the item's value.

### {!include [template file]}

The include command renders another template with the current template's variables.

### {!? $[variable name] [command name] [arg1] ... [argN]}

The `?` command executes another command with `arg1` to `argN` as the arguments if the specified variable exists and is truthy.

## Adding new commands

You can extend ChibiPrint by adding new commands it can utilize:

```javascript
var render = require("chibiprint").render;

render.commands["hello-world"] = function (base, vars /*, arg1, ..., argN */) {
    
    // base is the base path / folder of the current template
    // vars is an object containing the available variables
    
    // commands can have any number of optional arguments
    
    // commands must return a string:
    return "Hello world!";
};

```

## API

### render(templateFile, data)

Renders the file located at `templateFile` using the key-value pairs in `data` as variables.

### render.commands

The available commands. This object can be extended to add new commands to ChibiPrint.

### engine()

Creates a new `render` function. This is useful if you want to have render functions with a different command vocabulary.

## License

BSD-3-Clause. See LICENSE file for details.
