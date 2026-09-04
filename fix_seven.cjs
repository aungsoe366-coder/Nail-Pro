const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target = `              <span className="text-2xl font-mono font-bold text-primary">{s.total.toLocaleString()} Ks</span>
              </div>
              </div>
              </div>
              </div>
              </div>
              </div>
              </div>
              </motion.div>
              ))}
              </AnimatePresence>`;

const replacement = `              <span className="text-2xl font-mono font-bold text-primary">{s.total.toLocaleString()} Ks</span>
              </div>
              </div>
              </div>
              </div>
              </div>
              </div>
              </motion.div>
              ))}
              </AnimatePresence>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Removed extra div");
