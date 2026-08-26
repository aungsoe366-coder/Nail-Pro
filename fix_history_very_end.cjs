const fs = require('fs');

let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace(
  /<div className="pt-4 flex justify-between items-center">\s*<span className="text-\[10px\] font-bold uppercase tracking-widest text-muted-foreground">Net Total<\/span>\s*<span className="text-2xl font-mono font-bold text-primary">\{s\.total\.toLocaleString\(\)\} Ks<\/span>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*<\/motion\.div>\s*\)\)\}\s*<\/AnimatePresence>\s*<\/div>\s*<\/motion\.div>\s*\)\)\s*\)\}\s*<\/div>\s*<\/div>\s*<PrintPreviewModal/,
  `<div className="pt-4 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Net Total</span>
              <span className="text-2xl font-mono font-bold text-primary">{s.total.toLocaleString()} Ks</span>
              </div>
              </div>
              </div>
              </div>
              </motion.div>
              )}
              </AnimatePresence>
              </motion.div>
              ))}
              </AnimatePresence>
              </motion.div>
              </motion.div>
              ))
              )}
              </div>
              </div>
              <PrintPreviewModal`
);

fs.writeFileSync('src/AppCore.tsx', code);
