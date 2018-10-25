const _ = require(`lodash`)
const path = require(`path`)

const transform = src => {
  return _.map(src, (value, key) => {
    const isJson = !_.isString(value)
    return({
      key,
      value: isJson ? JSON.stringify(value) : value,
      isJson
    })
  })
}


async function onCreateNode(
  { node, actions, loadNodeContent, createNodeId, createContentDigest },
  pluginOptions
) {
  const { createNode, createParentChildLink } = actions

  // We only care about JSON content.
  if (node.internal.mediaType !== `application/json`) {
    return
  }

  const content = await loadNodeContent(node)
  const parsedContent = JSON.parse(content)
  const file___NODE = node.internal.type === 'File' ? node.id : null

  if (_.isPlainObject(parsedContent)) {
    const array = transform(parsedContent).map((obj, i) => ({
      ...obj,
      file___NODE,
      id: createNodeId(`${node.id}[${i}]`),
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(obj),
        type: 'KeyValue',
      },
    }))

    _.each(array, y => {
      createNode(y)
      createParentChildLink({ parent: node, child: y })
    })
  }
}

exports.onCreateNode = onCreateNode
