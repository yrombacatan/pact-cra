import React, { useEffect, useState } from 'react';
import Pact from 'pact-lang-api'

// kadena config
import kadenaAPI from '../kadena.config'

// sub-components
import KeysetsForm from '../components/for-method/KeysetsForm';
import CapabilitiesForm from '../components/for-method/CapabilitiesForm';

// utility
import { checkWallet, formatKeyset, formatCapabilityArgument } from "../utils";

global.Buffer = global.Buffer || require("buffer").Buffer;

const Methods = () => {
  const [local, setLocal] = useState(true)
  const [pactCode, setPactCode] = useState('')
  const [sender, setSender] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [requestKey, setRequestKey] = useState('')

  const [keysetList, setKeysetList] = useState([{
    name: '',
    address: '',
    pred: ''
  }])

  const [capabilityList, setCapabilityList] = useState([{
    name: '',
    args: ['']
  }])

  const handlePact = (e) => {
    setPactCode(e.target.value)
  }

  const handleSender = (e) => {
    setSender(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(local) {
      handleLocal()
    } else {
      handleSigning()
    }
  }

  const handleLocal = async () => {
    const formatKeyset = keysetList.reduce((current, next) => {
      let name = next.name
      let address = next.address
      let pred = next.pred
  
      current[name] = {
          "keys": address.split(';'),
          "pred": pred
      }
  
      return current
    }, {})

    const cmd = {
      pactCode: pactCode,
      envData: formatKeyset,
      meta: Pact.lang.mkMeta(
        kadenaAPI.meta.sender,
        kadenaAPI.meta.chainId,
        kadenaAPI.meta.gasPrice,
        kadenaAPI.meta.gasLimit,
        kadenaAPI.meta.creationTime(),
        kadenaAPI.meta.ttl
      )
      
    }

    console.log(cmd)

    try {
      setResult('')
      setIsLoading(true)

      const result = await Pact.fetch.local(cmd, kadenaAPI.meta.host)
      if(
        result.hasOwnProperty('result') &&
        result.result.status === 'failure') {
          throw (result)
      }

      setResult(result)
      setIsLoading(false)
      setError(false)
     
    } catch (error) {
      setError(error)
      setIsLoading(false)
      setResult('')
    }

  }

  const handleSigning = async () => {

    // connect wallet
    const { status, data } = await checkWallet()
    if(status === 'error') {
      console.log('no wallet')
      setResult(data.message ? `${data.message}, make sure wallet is ready` : data)
      return
    }

    // format accountAddress
    // we use the first address from the collection
    // remove prefix k
    const accountAddress = data[0].at(0) === 'k' ? data[0].slice(2) : data[0]

    //format keyset to match needed requirement
    const keysets = formatKeyset(keysetList)

    // make capability
    const capability = capabilityList.map(cap => Pact.lang.mkCap(
        'Some Role here', 
        'Some description', 
        cap.name, 
        formatCapabilityArgument(cap.args)))

    const cmd = {
      pactCode: `${pactCode}`,
      caps: capability,
      envData: keysets,
      sender: sender,
      chainId: kadenaAPI.meta.chainId,
      gasLimit: kadenaAPI.meta.gasLimit,
      gasPrice: kadenaAPI.meta.gasPrice,
      signingPubKey: accountAddress, // account with no prefix k here
      networkId: kadenaAPI.meta.networkId,
      nonce: kadenaAPI.meta.nonce,
    };

    console.log(cmd)
    
    try {
      setResult('') 
      setError(false)

      const signedReq = await Pact.wallet.sign(cmd)
      console.log(signedReq)

      const tx = await Pact.wallet.sendSigned(signedReq, kadenaAPI.meta.host)
      console.log(tx)

      setRequestKey(tx.requestKeys[0])
  
    } catch (error) {
      setError(error)
      setIsLoading(false)
      setResult('')
    }

  }

  useEffect(() => {
    let ignore = false
    const checkRequestKey = async() => {
      
      try {
        if(! requestKey) return
        setResult('')
        setError(false);
        setIsLoading(true)
        
        const cmd = {
          listen: requestKey
        }
        //const host = "http://localhost:9001"
        const result = await Pact.fetch.listen(cmd, kadenaAPI.meta.host)
        console.log(result)

        if(result.result.status === 'failure') {
          throw (result)
        }
        
        if(! ignore) {
          setIsLoading(false)
          setError(false)
          setResult(result)
        }
        
  
      } catch (error) {
        if(! ignore) {
          setError(error)
          setIsLoading(false)
          setResult('')
        }
      }
    }

    checkRequestKey()

    return () => { ignore = true }

  }, [requestKey])

  return (
      <main className='md:w-4/5 mx-auto p-4 md:p-6'>
          <section className="w-full mb-5">

                <h1 className='text-lg font-medium'>Methods</h1>
                
                <form className='flex flex-wrap gap-3' onSubmit={handleSubmit}>
                  <div className='flex-auto'>
                      <label className='block text-md font-semibold text-slate-600 mt-5 mb-2'>Command</label>
                      <input type="text" placeholder='Enter Pact' name='pactCode' value={pactCode} onChange={handlePact}
                        className="w-full border p-2 rounded mb-2 focus:outline-blue-400"/>
                      
                      <label className='block text-md font-semibold text-slate-600 mt-5 mb-2'>Keysets</label>
                      <KeysetsForm keysetList={keysetList} setKeysetList={setKeysetList}/>

                      <label className='block text-md font-semibold text-slate-600 mt-5 mb-2'>Capabilities</label>
                      <CapabilitiesForm capabilityList={capabilityList} setCapabilityList={setCapabilityList} />

                      <label className='block text-md font-semibold text-slate-600 mt-5 mb-2'>Sender (Gas Payer)</label>
                      <input type="text" placeholder='Enter Sender' name='sender' value={sender} onChange={handleSender}
                        className="w-full border p-2 rounded mb-2 focus:outline-blue-400"/>
                  </div>

                  <div className='flex-none'>
                      <label className='block text-md font-semibold text-slate-600 mt-5 mb-2'>Action</label>
                      <input type='submit' value="Local" 
                        className='px-5 py-2 rounded text-black bg-gray-300  transition hover:bg-gray-600 hover:text-gray-100 cursor-pointer mr-3' 
                        onClick={() => setLocal(true)}/>
                      <input type='submit' value="Send" 
                        className='px-5 py-2 rounded text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer' 
                        onClick={() => setLocal(false)} />
                  </div>
                </form>
          </section>

          <section>
            <p className='text-sm text-slate-400 mt-5 mb-3'>Result</p>
            <div className='bg-gray-100 w-full min-h-fit rounded shadow-sm p-2 overflow-auto'>
              {isLoading && <p>Loading...</p>}
              {error && <pre> <code> {JSON.stringify(error.message?? error, null, 4)} </code></pre>}
              {result && <pre> <code> {JSON.stringify(result, null, 4)} </code></pre>}
            </div>
          </section>
      </main>
  )
};

export default Methods;
