import React, { useState, useEffect } from 'react'

// utility
import { connectWallet } from '../utils';

import MessageDialogue from './MessageDialogue';

const ConnectButton = () => {
    const [isOpenMessageDailogue, setIsOpenMessageDialogue] = useState(false)
    const [messageData, setMessageData] = useState('')

    const handleConnect = async () => {
        try {
            const result = await connectWallet()

            if(result.status === 'success') {
                localStorage.setItem('accountAddress', JSON.stringify(result.data))
            }

        } catch (error) {
            setIsOpenMessageDialogue(true)
            setMessageData(`${ error.message + ', make sure wallet is ready' }`)

            // close dialogue after 3s
            setTimeout(() => {
                setIsOpenMessageDialogue(false)
            }, 3000)
        }
    }

    return (
        <>
            <button 
                className='bg-indigo-500 px-4 py-2 rounded text-white shadow' 
                onClick={handleConnect}>
                    Wallet
            </button>

            <MessageDialogue message={messageData} isOpen={isOpenMessageDailogue} />
        </>
        
    )
}

export default ConnectButton