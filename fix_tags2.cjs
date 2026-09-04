const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target = `              </div>
              </motion.div>
              )}
              </AnimatePresence>
              </motion.div>
              ))}
              </AnimatePresence>`;

const replacement = `              </div>
              </div>
              </div>
              </div>
              </motion.div>
              ))}
              </AnimatePresence>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Fixed second block");
