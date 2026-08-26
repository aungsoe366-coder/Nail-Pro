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
        
        if (init && (init.isKind(SyntaxKind.StringLiteral) || init.isKind(SyntaxKind.JsxExpression))) {
           let text = '';
           let isTemplate = false;
           
           if (init.isKind(SyntaxKind.StringLiteral)) {
             text = init.getLiteralText();
           } else {
              const expr = init.getExpression();
              if (expr && expr.isKind(SyntaxKind.TemplateExpression)) {
                 text = expr.getText();
                 isTemplate = true;
              } else if (expr && expr.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)) {
                 text = expr.getLiteralText();
                 isTemplate = true;
              }
           }

           if (text.includes('animate-in fade-in')) {
              const regex = /animate-in\s|fade-in\s|duration-\d+\s?|zoom-in(?:-\d+)?\s?|slide-in-from-[a-z]+(?:-\d+)?\s?/g;
              
              if (init.isKind(SyntaxKind.StringLiteral)) {
                  const newText = text.replace(regex, '').trim();
                  classNameAttr.setInitializer(`"${newText}"`);
              } else if (init.isKind(SyntaxKind.JsxExpression)) {
                  const fullText = init.getText();
                  const newText = fullText.replace(regex, '').trim();
                  init.replaceWithText(newText);
              }

              if (opening.getTagNameNode().getText() === 'div') {
                 opening.getTagNameNode().replaceWithText('motion.div');
                 const closing = jsxElement.getClosingElement();
                 if (closing) {
                    closing.getTagNameNode().replaceWithText('motion.div');
                 }

                 opening.addAttribute({ name: 'initial', initializer: '{ { opacity: 0, y: 12 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
                 opening.addAttribute({ name: 'animate', initializer: '{ { opacity: 1, y: 0 } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
                 opening.addAttribute({ name: 'transition', initializer: '{ { duration: 0.3, ease: "easeOut" } }'.replace(/\{ \{/g, '{{').replace(/\} \}/g, '}}') });
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
