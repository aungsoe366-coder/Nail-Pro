const { Project, SyntaxKind } = require("ts-morph");

const project = new Project();
project.addSourceFilesAtPaths("src/**/*.tsx");

project.getSourceFiles().forEach(sourceFile => {
  let changed = false;

  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);
  
  jsxElements.forEach(jsxElement => {
    try {
      const opening = jsxElement.getOpeningElement();
      const classNameAttr = opening.getAttribute("className");
      
      if (classNameAttr && classNameAttr.isKind(SyntaxKind.JsxAttribute)) {
        const init = classNameAttr.getInitializer();
        let text = '';
        if (init && init.isKind(SyntaxKind.StringLiteral)) {
           text = init.getLiteralText();
        }

        if (text.includes('fixed inset-0')) {
          // Change tag to motion.div if it's div
          if (opening.getTagNameNode().getText() === 'div') {
             opening.getTagNameNode().replaceWithText('motion.div');
             const closing = jsxElement.getClosingElement();
             if (closing) {
                closing.getTagNameNode().replaceWithText('motion.div');
             }
             changed = true;
          }
          
          // Add backdrop fade
          if (!opening.getAttribute('initial')) {
             opening.addAttribute({ name: 'initial', initializer: '{ { opacity: 0 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
             opening.addAttribute({ name: 'animate', initializer: '{ { opacity: 1 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
             opening.addAttribute({ name: 'exit', initializer: '{ { opacity: 0 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
             opening.addAttribute({ name: 'transition', initializer: '{ { duration: 0.25 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
             changed = true;
          }
          
          // Now for the AnimatePresence. We look up to see if it's inside a conditional.
          const parent = jsxElement.getParent();
          if (parent.isKind(SyntaxKind.JsxExpression)) {
            // It's like {condition && <motion.div>}
            // We can wrap this JsxExpression's content with AnimatePresence
            const expr = parent.getExpression();
            if (expr && expr.isKind(SyntaxKind.BinaryExpression) && expr.getOperatorToken().getKind() === SyntaxKind.AmpersandAmpersandToken) {
               // We wrap the whole JsxExpression in AnimatePresence
               // Wait, replacing a JsxExpression with another JSX element is straightforward
               const exprText = expr.getText();
               parent.replaceWithText(`<AnimatePresence>${'{'}${exprText}${'}'}</AnimatePresence>`);
               changed = true;
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
