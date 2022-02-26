import React, { useState } from 'react'
import Pact from 'pact-lang-api'

import kadenaAPI from '../kadena.config';

const GasStation = () => {
    const [result, setResult] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleSend = async () => {
        try {
            //generates dummy keypair
            //  using gas stations means the keys do not need to have funds
            const kp = Pact.crypto.genKeyPair();
            //sends JSON content to blockchain

            const cmd = {
                networkId: kadenaAPI.meta.networkId,
                //calling here() function from smart contract
                //  writes text from 'user' variable to the memory wall
                pactCode: `(free.basic-payment.welcomeMessage "Hello I hope your doing fine!")`,
                keyPairs: [
                {
                    publicKey: kp.publicKey,
                    secretKey: kp.secretKey,
                    clist: [
                        //capability to use gas station
                        {
                            name: `${kadenaAPI.gasStationAddress}.GAS_PAYER`,
                            //args are irrelevant here just need to be the right type
                            args: ["hi", { int: 1 }, 1.0],
                        },
                    ],
                },
                ],
                //pact-lang-api function to construct transaction meta data
                meta: Pact.lang.mkMeta(
                    kadenaAPI.meta.sender,
                    kadenaAPI.meta.chainId,
                    kadenaAPI.meta.gasPrice,
                    kadenaAPI.meta.gasLimit,
                    kadenaAPI.meta.creationTime(),
                    kadenaAPI.meta.ttl
                ),
            }

            console.log(cmd)

            const tx = await Pact.fetch.send(cmd, kadenaAPI.meta.host);

            if(! tx.hasOwnProperty('requestKeys')) throw(tx)

            //set state to wait for transaction response
            setIsLoading(true);
            setResult(tx)

            try {
                //listens to response to transaction sent
                //  note method will timeout in two minutes
                //    for lower level implementations checkout out Pact.fetch.poll() in pact-lang-api
                let result = await Pact.fetch.listen(
                    { listen: tx.requestKeys[0] },
                    kadenaAPI.meta.host
                );

                if(
                    result.hasOwnProperty('result') &&
                    result.result.status === 'failure') {
                    throw (result)
                }
            
                setResult(result)
                setIsLoading(false)
                setError(false)
            } catch (e) {
                setError(error)
                setIsLoading(false)
                setResult('')
            }
        } catch (error) {
            console.log('outer error')
            console.log(error);
            setError(error)
        }
    };

    return (
        <main className='max-w-7xl mx-auto p-6 '>
            <section className='text-left mb-4'>
                <h1 className="font-bold">Test Gas Payer</h1>
            </section>
            
            <div className="w-full">
                <div className="flex flex-col justify-center items-center overflow-auto">
                    <button className='bg-indigo-400 hover:bg-indigo-500 text-white font-medium py-2 px-5 rounded'
                        onClick={handleSend}>Send Message</button>
                    <div className='bg-gray-100 w-full min-h-fit rounded shadow-sm p-2 overflow-auto mt-2'>
                        {isLoading && <p>Loading...</p>}
                        {error && <pre> <code> {JSON.stringify(error.message?? error, null, 4)} </code></pre>}
                        {result && <pre> <code> {JSON.stringify(result, null, 4)} </code></pre>}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default GasStation

