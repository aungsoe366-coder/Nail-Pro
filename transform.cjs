const fs = require('fs');
const babel = require('@babel/core');

function myPlugin({ types: t }) {
  return {
    visitor: {
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const nameNode = openingElement.name;

        // Button -> motion.button
        if (t.isJSXIdentifier(nameNode, { name: 'button' })) {
          const newName = t.jsxMemberExpression(
            t.jsxIdentifier('motion'),
            t.jsxIdentifier('button')
          );
          openingElement.name = newName;
          if (path.node.closingElement) {
            path.node.closingElement.name = newName;
          }

          // Add whileTap={{ scale: 0.97 }}
          let hasWhileTap = false;
          for (let attr of openingElement.attributes) {
            if (t.isJSXAttribute(attr) && attr.name.name === 'whileTap') {
              hasWhileTap = true;
            }
          }
          if (!hasWhileTap) {
            openingElement.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('whileTap'),
                t.jsxExpressionContainer(
                  t.objectExpression([
                    t.objectProperty(t.identifier('scale'), t.numericLiteral(0.97))
                  ])
                )
              )
            );
          }
        }
      }
    }
  };
}

const code = `
const App = () => {
  return (
    <div>
      <button onClick={click}>Click me</button>
    </div>
  )
}
`;

const result = babel.transformSync(code, {
  plugins: ['@babel/plugin-syntax-jsx', myPlugin],
});
console.log(result.code);
