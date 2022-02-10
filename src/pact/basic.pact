(define-keyset "admin-keyset" (read-keyset "admin-keyset"))

(module basic-syntax 'admin-keyset

    (defschema user 
        name: string
        balance: decimal
        guard: guard
        status: bool)

    (deftable tbl_user: {user})

    (defun create-account (id name bal guard)
        (enforce (!= name "") "Name is required")
        (enforce (>= bal 1.00) "Invalid balance")

        (insert tbl_user id {
            'name: name,
            'balance: bal,
            'guard: guard,
            'status: true,
            })
            
        (format "Account {} created" [name])
    )

    (defun hello (name)
        (format "Hello {}" [name])
    )
)

(create-table tbl_user)