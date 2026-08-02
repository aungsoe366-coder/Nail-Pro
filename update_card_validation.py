with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_warning_code = """                           {/* Warning if quantities don't match */}
                           {(item.staffAssignments.reduce((sum, a) => sum + (a.qty || 0), 0) !== item.qty) && (
                             <p className="text-[10px] text-red-500 font-bold">Staff quantities ({item.staffAssignments.reduce((sum, a) => sum + (a.qty || 0), 0)}) must match total qty ({item.qty}).</p>
                           )}"""

new_warning_code = """                           {/* Logic 1 & Logic 2 Validation Error Messages */}
                           {(() => {
                             const itemValidation = validateCartItem(item);
                             if (!itemValidation.isValid && itemValidation.errors.length > 0) {
                               return (
                                 <div className="space-y-1 mt-1">
                                   {itemValidation.errors.map((err, errIdx) => (
                                     <div key={errIdx} className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                                       <AlertCircle size={14} className="shrink-0 text-red-500" />
                                       <span>{err}</span>
                                     </div>
                                   ))}
                                 </div>
                               );
                             }
                             return null;
                           })()}"""

if old_warning_code in content:
    content = content.replace(old_warning_code, new_warning_code)
    with open('src/AppCore.tsx', 'w') as f:
        f.write(content)
    print("Replaced card warning code successfully.")
else:
    print("old_warning_code not found!")
