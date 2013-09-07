# ALCE

Accepting Language Config Environment
## API

### ALCE.parse(configSource, options)

Parses a string containing a ACLE source file. Returns an ACLE object.

- `configSource`: String representation of the configuration file
- `options`: Options hash.
  - `meta` : Set to truthy to return an editable version of the config that may be reconstructed. Falsy returns generic javascript object. See [#toObject](#toObject).
  - Formatter options. See [Formatters](#formatters) for more info

### ALCE.stringify(object, options)

Converts a ACLE or javascript object to it's string representation.

- `object`: Object to convert to a string
- `options`: Formatter options when converting a javascript object. See [Formatters](#formatters) for more info.

#### Array-like methods

ACLE instances representing arrays additionally implement:

- `length`
- `push`
- `pop`
- `unshift`
- `shift`
- `splice`

All of which behave as they would if operating on an normal array.


Human friendly JSON-like config file format. Takes the JSON out of humans' nightmares.
#### #objectFormatter(parent, object)

Called when a new object or array is created. Generally `parent` will be an array instance or a property. The `isArray` field may be used to determine if `parent` or `object` is an array.

```javascript
  objectFormatter: function(parent, object) {
    object.indent = alce.calcIndent(parent.preamble) + (parent.isArray ? '  ' : '');
    object.innerPrologue = '\n' + object.indent;
  },
```

#### #insertFormatter(parent, insert)

Called when a new value is inserted into an array or object instance. `insert` will be pushed to the end of the `parent.children` list after this operation occurs.

```javascript
  insertFormatter: function(parent, insert) {
    var indent = parent.indent || alce.calcIndent(parent.preamble);
    insert.preamble = (parent.children.length ? ',' : '') + '\n  ' + indent;
  },
```

#### #propertyFormatter(parent, property)

Called when a new property is created. This is useful for defining the `separator` value for a property.

```javascript
  propertyFormatter: function(parent, property) {
    property.separator = ': ';
  }
```

#### alce.calcIndent(preamble)

Utilitity method for formatters. Determines the indentation that should be used for a node relative to a given prefix. This is helpful for the `inserFormatter` to determine where to align new children inserted into an object.
