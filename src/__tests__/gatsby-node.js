const { onCreateNode } = require(`../gatsby-node`)

// Make some fake functions its expecting.
const loadNodeContent = node => Promise.resolve(node.content)

const bootstrapTest = async (node, pluginOptions = {}) => {
  const createNode = jest.fn()
  const createParentChildLink = jest.fn()
  const actions = { createNode, createParentChildLink }
  const createNodeId = jest.fn()
  createNodeId.mockReturnValue(`uuid-from-gatsby`)
  const createContentDigest = jest.fn().mockReturnValue(`contentDigest`)

  return await onCreateNode(
    {
      node,
      loadNodeContent,
      actions,
      createNodeId,
      createContentDigest,
    },
    pluginOptions
  ).then(() => {
    return {
      createNode,
      createParentChildLink,
    }
  })
}

describe(`Process JSON nodes correctly`, () => {
  const baseNode = {
    id: `whatever`,
    parent: `SOURCE`,
    children: [],
    internal: {
      contentDigest: `whatever`,
      mediaType: `application/json`,
    },
  }

  const baseFileNode = {
    ...baseNode,
    name: `nodeName`,
    dir: `/tmp/foo/`,
    internal: {
      ...baseNode.internal,
      type: `File`,
    },
  }

  it(`correctly creates nodes from JSON`, async () => {
    const data = {
      title: 'My title',
      description: 'Lorem ipsum',
      nested: {foo: 'bar'},
    }
    const node = {
      ...baseFileNode,
      content: JSON.stringify(data),
    }

    return bootstrapTest(node).then(({ createNode, createParentChildLink }) => {
      expect(createNode.mock.calls).toMatchSnapshot()
      expect(createParentChildLink.mock.calls).toMatchSnapshot()
      expect(createNode).toHaveBeenCalledTimes(3)
      expect(createParentChildLink).toHaveBeenCalledTimes(3)
    })
  })
})
