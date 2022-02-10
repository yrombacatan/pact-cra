import React, { useState } from 'react';
import Pact from 'pact-lang-api'

const Keypair = () => { 
    const [keyPairs, setKeyPairs] = useState('')

    const handleButton = () => {
        const result = Pact.crypto.genKeyPair()
        setKeyPairs(result)
    }

    return (
        <main className='max-w-7xl mx-auto p-6 '>
            <section className='text-left mb-4'>
                <h1 className="font-bold">Generate Keypairs</h1>
            </section>
            <div className="w-full">
                <div className="flex flex-col justify-center items-center">
                    <button className='bg-indigo-400 hover:bg-indigo-500 text-white font-medium py-2 px-5 rounded'
                        onClick={handleButton}>Generate</button>
                    <div className='h-80 w-full rounded bg-gray-100 shadow mt-5 flex items-center justify-center'>
                        <pre>
                            <code>
                                {keyPairs && JSON.stringify(keyPairs, null, 4)}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default Keypair;
