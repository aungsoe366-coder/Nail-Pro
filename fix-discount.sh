#!/bin/bash
sed -i -e '/value={item.disP || 0}/c\
                        value={item.disP === "" as any ? "" : (item.disP ?? 0)}\
                        onFocus={() => {\
                          if (item.disP === 0) updateCartItem(i, { disP: "" as any });\
                        }}\
                        onBlur={(e) => {\
                          if (e.target.value === "") updateCartItem(i, { disP: 0 });\
                        }}' src/AppCore.tsx

sed -i -e '/onChange={(e) => {/,/}}/c\
                        onChange={(e) => {\
                          if (e.target.value === "") {\
                            updateCartItem(i, { disP: "" as any });\
                            return;\
                          }\
                          const val = Number(e.target.value);\
                          if (val >= 0 \&\& val <= 100) {\
                            updateCartItem(i, { disP: val });\
                          }\
                        }}' src/AppCore.tsx
