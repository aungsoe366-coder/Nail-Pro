import re

with open("src/AppCore.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r"(\s*\} else \{\s*try \{\s*)await deleteDoc\(doc\(db, coll, id\)\);\s*(} catch \(err\) \{\s*handleFirestoreError\(err, OperationType\.DELETE, `\$\{coll\}/\$\{id\}`\);\s*\}\s*\})")

new_code = r"""\1if (coll === 'customers') {
          const customer = customers.find(c => c.id === id);
          if (customer) {
            let targetEmail = customer.email;
            if (!targetEmail && customer.phone) {
                targetEmail = `${customer.phone.replace(/[^a-zA-Z0-9]/g, '')}@nailpro.com`;
            }
            if (targetEmail) {
              try {
                const functions = getFunctions(app, 'asia-southeast1');
                const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');
                await deleteUserAccount({ targetEmail });
              } catch (err) {
                console.warn("Could not delete associated auth account. It may not exist.", err);
              }
            }
          }
        }
        await deleteDoc(doc(db, coll, id));
        \2"""

content = pattern.sub(new_code, content)
with open("src/AppCore.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced with regex")
