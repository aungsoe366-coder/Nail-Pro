const { Project, SyntaxKind } = require("ts-morph");

const project = new Project();
project.addSourceFilesAtPaths("src/**/*.tsx");

project.getSourceFiles().forEach(sourceFile => {
  let changed = false;
  
  // Ensure motion imports
  const imports = sourceFile.getImportDeclarations();
  const framerImport = imports.find(i => i.getModuleSpecifierValue() === 'motion/react' || i.getModuleSpecifierValue() === 'framer-motion');
  
  if (!framerImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: 'motion/react',
      namedImports: ['motion', 'AnimatePresence']
    });
    changed = true;
  } else {
    // ensure AnimatePresence and motion are imported
    const named = framerImport.getNamedImports().map(n => n.getName());
    if (!named.includes('motion')) {
      framerImport.addNamedImport('motion');
      changed = true;
    }
    if (!named.includes('AnimatePresence')) {
      framerImport.addNamedImport('AnimatePresence');
      changed = true;
    }
  }

  // Find all buttons and replace with motion.button
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);
  const selfClosingElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
  
  const allElements = [...jsxElements, ...selfClosingElements];

  // We have to be careful when modifying AST while iterating
  // Actually, string replacement on the file text is often easier for simple tag renames,
  // but let's try to just do it via text replacement since ts-morph provides `.getText()`
  
  let fileText = sourceFile.getFullText();
  let textChanged = false;

  // 1. Button -> motion.button
  if (fileText.includes('<button') && !fileText.includes('<motion.button whileTap')) {
     fileText = fileText.replace(/<button/g, '<motion.button whileTap={{ scale: 0.97 }}');
     fileText = fileText.replace(/<\/button>/g, '</motion.button>');
     textChanged = true;
  }

  // 2. Page entry animations (finding animate-in fade-in)
  // We can use regex to find `<div ... animate-in fade-in ... >`
  // Actually, changing to <motion.div> and adding initial/animate/transition is easy:
  if (fileText.includes('animate-in fade-in')) {
    // We can't easily replace the closing tag with regex. 
  }

  if (textChanged) {
     sourceFile.replaceWithText(fileText);
     changed = true;
  }

  if (changed) {
    sourceFile.saveSync();
    console.log(`Saved ${sourceFile.getFilePath()}`);
  }
});
