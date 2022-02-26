import React from 'react'

const Contract = () => {
    const rawContract = `
        (namespace 'free)

        (module basic-payment GOVERNANCE
            
            "create user schema"
            (defschema user_schema 
                name: string
                balance: decimal
                position: string
                guard: guard)
            
            (deftable tbl_user: {user_schema})
            
            ;; <-- Capabilities 
            (defcap GOVERNANCE ()
                (enforce-guard (at 'guard (coin.details 'Admin)))
            )
        
            ;; capabilites-end -->
            
            ;(use coin)
        
            ;; <-- Transfer
            (defun test-transfer (sender reciever amount)
                (transfer sender reciever amount)
            )
        
            (defun test-transfer-2 (sender reciever amount)
                (transfer 'sender 'reciever amount)
            )
            
            ;; <-- Database function
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
            
            ;; database-end -->
            
            ;; <-- Basic syntax
            (defun welcomeMessage(msg)
                (format "{}" [msg])
            )
            
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
            
            
            ;; basic-end -->
            
        )
    `

    return (
        <main className='max-w-7xl mx-auto p-6 '>
            <section className='text-left mb-4'>
                <h1 className="font-bold">Deployed Smart Contract</h1>
            </section>
            
            <div className="w-full">
                <div className="flex flex-col justify-center items-center">
                    <div className='bg-gray-100 w-full rounded shadow-sm p-2 overflow-auto mt-2' style={{maxHeight: "650px"}}>
                        <pre>
                            <code>
                                {rawContract}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Contract