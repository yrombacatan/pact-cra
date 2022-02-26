(define-keyset 'jeromebacatan-keyset (read-keyset 'jeromebacatan-keyset))


(module basic-payment 'jeromebacatan-keyset
    
    (defschema user_schema 
        name: string
        balance: decimal
        position: string
        guard: guard)
    
    (deftable tbl_user: {user_schema})
    

    (defcap GOVERNANCE ()
        (enforce-keyset 'jeromebacatan-keyset))

    (defun hello(name)
        (format "Good days {}" [name])
    )

    (defun db-insert(id name bal pos guard)
        (enforce (> bal 0.00) "Please enter a valid balance amount.")
        (insert tbl_user id {
          'name: name,
          'balance: bal,
          'position: pos,
          'guard: guard
          })
          
        (format "Account {} created, with balance: {}" [name, bal]))
    
    (defun db-read(id)
        (with-read tbl_user id {
          'name:= name,
          'balance:= bal,
          'position:= pos,
          'guard:= guard}
            
            (format "Name: {}, Bal: {}, Pos: {}, Guard: {}" [name, bal, pos, guard])))
    
    
    (defun use-let()
        (let ((name 'Bob) (age 22)) (format "Name: {}, Age: {}" [name, age])))

    (defun use-bind()
        (bind {'name: 'Alice, 'balance: 200.00} {'balance:= bal}
            (format "Alice balance: {}" [bal])))
    
    (defun use-list()
        @doc "create a array (string, integer, boolean, decimal)"
        ['Alice, 23, true, 90.01])

    (defun use-object()
        @doc "create object then use the list above"
        {'name: 'John, 'age: 24, 'friend: (use-list)})

    (defun use-at()
        @doc "get value of array/object by index"
        (at 'age (use-object)))
   
    
)

(create-table tbl_user)





















