const { Project, SyntaxKind } = require("ts-morph");

const project = new Project();
project.addSourceFilesAtPaths("src/**/*.tsx");

project.getSourceFiles().forEach(sourceFile => {
  let changed = false;

  const callExprs = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  
  callExprs.forEach(callExpr => {
    try {
      const propAccess = callExpr.getExpressionIfKind(SyntaxKind.PropertyAccessExpression);
      if (propAccess && propAccess.getName() === 'map') {
         // It's a map call!
         // Ensure it returns a JSX Element
         const args = callExpr.getArguments();
         if (args.length > 0) {
           const func = args[0];
           if (func.isKind(SyntaxKind.ArrowFunction) || func.isKind(SyntaxKind.FunctionExpression)) {
             const body = func.getBody();
             let jsxNode = null;
             
             if (body.isKind(SyntaxKind.JsxElement) || body.isKind(SyntaxKind.JsxSelfClosingElement)) {
               jsxNode = body;
             } else if (body.isKind(SyntaxKind.ParenthesizedExpression)) {
               const expr = body.getExpression();
               if (expr.isKind(SyntaxKind.JsxElement) || expr.isKind(SyntaxKind.JsxSelfClosingElement)) {
                 jsxNode = expr;
               }
             } else if (body.isKind(SyntaxKind.Block)) {
               const retStmt = body.getStatements().find(s => s.isKind(SyntaxKind.ReturnStatement));
               if (retStmt) {
                  const expr = retStmt.getExpression();
                  if (expr && (expr.isKind(SyntaxKind.JsxElement) || expr.isKind(SyntaxKind.JsxSelfClosingElement))) {
                     jsxNode = expr;
                  } else if (expr && expr.isKind(SyntaxKind.ParenthesizedExpression)) {
                     const pExpr = expr.getExpression();
                     if (pExpr.isKind(SyntaxKind.JsxElement) || pExpr.isKind(SyntaxKind.JsxSelfClosingElement)) {
                       jsxNode = pExpr;
                     }
                  }
               }
             }

             if (jsxNode) {
               // We have the JSX element returned by the map
               const opening = jsxElementToOpening(jsxNode);
               const tagName = opening.getTagNameNode().getText();
               
               if (tagName === 'div') {
                 opening.getTagNameNode().replaceWithText('motion.div');
                 const closing = getClosingElement(jsxNode);
                 if (closing) closing.getTagNameNode().replaceWithText('motion.div');
                 changed = true;
               }
               
               if (tagName === 'div' || tagName === 'motion.div') {
                 // add layout prop
                 if (!opening.getAttribute('layout')) {
                   opening.addAttribute({ name: 'layout' });
                   changed = true;
                 }
                 if (!opening.getAttribute('initial')) {
                   opening.addAttribute({ name: 'initial', initializer: '{ { opacity: 0, scale: 0.95 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
                   opening.addAttribute({ name: 'animate', initializer: '{ { opacity: 1, scale: 1 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
                   opening.addAttribute({ name: 'exit', initializer: '{ { opacity: 0, scale: 0.95 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
                   opening.addAttribute({ name: 'transition', initializer: '{ { duration: 0.2 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
                   changed = true;
                 }

                 // Check if the parent of this map call is wrapped in AnimatePresence
                 const parentExpr = callExpr.getParentIfKind(SyntaxKind.JsxExpression);
                 if (parentExpr) {
                   const parentElement = parentExpr.getParentIfKind(SyntaxKind.JsxElement);
                   if (parentElement && parentElement.getOpeningElement().getTagNameNode().getText() !== 'AnimatePresence') {
                      // Let's wrap the JsxExpression with AnimatePresence
                      const exprText = parentExpr.getText();
                      // Only if it doesn't already have AnimatePresence!
                      if (!exprText.startsWith('<AnimatePresence')) {
                        parentExpr.replaceWithText(`<AnimatePresence>${exprText}</AnimatePresence>`);
                        changed = true;
                      }
                   }
                 }
               }
             }
           }
         }
      }
    } catch (e) {
      // ignore
    }
  });

  if (changed) {
    sourceFile.saveSync();
    console.log(`Saved ${sourceFile.getFilePath()}`);
  }
});

function jsxElementToOpening(jsxNode) {
  if (jsxNode.isKind(SyntaxKind.JsxElement)) return jsxNode.getOpeningElement();
  if (jsxNode.isKind(SyntaxKind.JsxSelfClosingElement)) return jsxNode;
  return null;
}

function getClosingElement(jsxNode) {
  if (jsxNode.isKind(SyntaxKind.JsxElement)) return jsxNode.getClosingElement();
  return null;
}
