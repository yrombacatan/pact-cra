import React, { useState, useEffect } from 'react'

// utility
import { checkWallet } from '../utils';

import MessageDialogue from './MessageDialogue';

const ConnectButton = () => {
    const [isOpenMessageDailogue, setIsOpenMessageDialogue] = useState(false)
    const [messageData, setMessageData] = useState('')

    const handleConnect = async () => {
        const { status, data } = await checkWallet()

        if(status === 'error') {
            setIsOpenMessageDialogue(true)
            setMessageData(`${data.message? data.message + ', make sure wallet is ready' : data}`)

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