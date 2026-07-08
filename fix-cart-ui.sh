#!/bin/bash
sed -i -e '/<div className="flex items-center gap-2">/,/<\/div>/ {
  /Discount %/! {
    /Staff/! {
      /CustomSelect/! {
        /value={item.staffEmail || '"'"''"'"'}/! {
          /onChange={(val)/! {
            /const selected = staff.find/! {
              /if (selected)/! {
                /updateCartItem/! {
                  /} else {/! {
                    /updateCartItem/! {
                      /placeholder="Auto (Main Staff)"/! {
                        /options={\[/! {
                          /{ value: '"'"''"'"', label: '"'"'Auto/! {
                            /...staff.filter/! {
                              /\]}/! {
                                /buttonClassName/! {
                                  /\/>/! {
                                    /<\/div>/!d
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}' src/AppCore.tsx
