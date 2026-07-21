import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace('              </button>\n            </div>\n          </motion.div>\n        )}\n        </AnimatePresence>', '              </button>\n            </div>\n            </div>\n          </motion.div>\n        )}\n        </AnimatePresence>')

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
