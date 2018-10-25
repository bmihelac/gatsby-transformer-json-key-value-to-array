# gatsby-transformer-json-key-value-to-array

Transforms JSON objects into queryable array with key/value pairs.

## Install

`npm install --save gatsby-transformer-json-key-value-to-array`

If you want to transform json files, you also need to have `gatsby-source-filesystem` installed and configured so it
points to your files.

## How to use

In your `gatsby-config.js`:

```javascript
module.exports = {
  plugins: [
    `gatsby-transformer-json-key-value-to-array`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data/`,
      },
    },
  ],
}
```

## Parsing algorithm

It recognizes files with `application/json` media type.

Each key/value is parsed into Node of type `KeyValue` with following fields:

* `key` - original key
* `value` - original value if it is string, otherwise JSON value of original value
* `isJson` - boolean field indicates if original value is JSON
* `file` - foreign key to source file (to allow filtering)

## Examples

If your project has a `en.json` with

```json
{ "title": "My title",  "description": "Lorem ipsum" }
```

Then the following two nodes would be created:

```json
[
  {
    "key": "title",
    "value": "My title",
    ...
  },
  {
    "key": "description",
    "value": "Lorem ipsum",
    ...
  }
]
```

Query example that will return all items with key starting with `title`:

```graphql
{
  allKeyValue(filter: {key:{regex: "/^title/"}}) {
    edges {
      node {
        key
        value
      }
    }
  }
}
```

Returns:

```json
{
  "data": {
    "allKeyValue": {
      "edges": [
        {
          "node": {
            "key": "title",
            "value": "My title"
          }
        }
      ]
    }
  }
}
```
