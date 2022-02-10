import React, { useEffect, useState } from 'react';
import Pact from 'pact-lang-api'

global.Buffer = global.Buffer || require("buffer").Buffer;

const Methods = () => {
  const [isLocal, setIsLocal] = useState(true)
  const [pactCode, setPactCode] = useState('')
  const [keysetList, setKeysetList] = useState([{
    name: '',
    address: '',
    pred: ''
  }])
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [requestKey, setRequestKey] = useState('')
  
  const handlePactCode = (e) => {
    setPactCode(e.target.value)
  }

  const handleInputChange = (e, i) => {
    const { name, value } = e.target
    const list = [...keysetList]
    list[i][name.split('-')[0]] = value  // remove dynamic name index for radio button
    setKeysetList(list)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const newList = [...keysetList, {names: '', address: '', pred: ''}]
    setKeysetList(newList)
  }

  const handleRemove = (i) => {
    const list = [...keysetList]
    list.splice(i, 1)
    setKeysetList(list)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

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
      keyPairs: {
        publicKey: "1853c995c7d69283f3eecadfb32e3f69da7f615bcffbe342d2c0fd9e5949d4f6",
        secretKey: "e2248d0c932bfc13a32afcbef86fddd86e265efa6d343f95fbce48a2bc7228ed",
      },
      pactCode: pactCode,
      envData: formatKeyset
    }

    console.log(cmd)

    try {
      setIsLoading(true)

      const host = "http://localhost:9001"

      if(isLocal) {
        const result = await Pact.fetch.local(cmd, host)
        if(result.result.status === 'failure') {
          throw (result)
        }

        const resMessage =  `${result.result.status}:  ${result.result.data}`
        setResult({message: resMessage, raw: result})
        setIsLoading(false)
        setError(false)
      } else {
        const result = await Pact.fetch.send(cmd, host)
        
        setRequestKey(result.requestKeys[0])
        setIsLoading(false)
        setError(false)
        setResult({message: result.requestKeys, raw: result})
      }
  
    } catch (error) {
      const errorMessage = `${error.result.error.type}: ${error.result.error.message}`
      setError({message: errorMessage, raw: error})
      setIsLoading(false)
      setResult('')
    }

  }

  useEffect(() => {
    let ignore = false
    const checkRequestKey = async() => {
      
      try {
        if(! requestKey) return
        setIsLoading(true)
        
        const cmd = {
          listen: requestKey
        }
        const host = "http://localhost:9001"
        const result = await Pact.fetch.listen(cmd, host)
        console.log(result)

        if(result.result.status === 'failure') {
          throw (result)
        }
        
        if(! ignore) {
          setIsLoading(false)
          setError(false)
          const resMessage =  `${result.result.status}:  ${result.result.data}`
          setResult({message: resMessage, raw: result})
        }
        
  
      } catch (error) {
        if(! ignore) {
          const errorMessage = `${error.result.error.type}: ${error.result.error.message}`
          setError({message: errorMessage, raw: error})
          setIsLoading(false)
          setResult('')
          console.log(error)
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
                <p className='text-sm text-slate-400 mt-5 mb-3'>Command</p>
                <form className='flex flex-wrap gap-3' onSubmit={handleSubmit}>
                  <div className='flex-auto'>
                      <input type="text" placeholder='Enter Pact' name='pactCode' value={pactCode} onChange={handlePactCode}
                        className="w-full border p-2 rounded mb-2 focus:outline-blue-400"/>
                      <div>
                        {keysetList.map((keyset, i) => {
                          return(
                          <div className='flex flex-wrap gap-2 mb-2' key={i}>
                            <input type="text" placeholder='Keyset Name' name='name' value={keyset.name} onChange={e => handleInputChange(e, i)}
                            className="flex-auto p-2 rounded focus:outline-blue-400"/>
                            <input type="text" placeholder='Keysets Address' name='address' value={keyset.address} onChange={e => handleInputChange(e, i)}
                            className="flex-auto basis-1/2 border p-2 rounded focus:outline-blue-400"/>
                            <div className='flex-auto flex items-center gap-5'>
                              <div className='flex items-center'>
                                <input type='radio' name={`pred-${i}`} id='keys-any' value='keys-any' onChange={e => handleInputChange(e, i)}/>
                                <label htmlFor='keys-any'>keys-any</label>
                              </div>
                              <div className='flex items-center'>
                                <input type='radio' name={`pred-${i}`} id='keys-all' value='keys-all' onChange={e => handleInputChange(e, i)} />
                                <label htmlFor='keys-all'>keys-all</label>
                              </div>
                              <div className='flex items-center'>
                                <input type='radio' name={`pred-${i}`} id='keys-two' value='keys-two' onChange={e => handleInputChange(e, i)} />
                                <label htmlFor='keys-two'>keys-two</label>
                              </div>
                              <div className='flex items-center'>
                                <button className='underline text-red-500' onClick={() => handleRemove(i)}>Remove</button>
                              </div>
                            </div>
                          </div>
                        )})}
          
                      </div>
                      <div>
                        <button className='text-indigo-500 mt-3' onClick={handleAdd}>Add keyset</button>
                      </div>
                  </div>
                  <div className='flex-none'>
                      <input type='submit' value="Local" 
                        className='px-5 py-2 rounded text-black bg-gray-300  transition hover:bg-gray-600 hover:text-gray-100 cursor-pointer mr-3' 
                        onClick={() => setIsLocal(true)}/>
                      <input type='submit' value="Send" 
                        className='px-5 py-2 rounded text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer' 
                        onClick={() => setIsLocal(false)} />
                  </div>
                </form>
          </section>

          <section>
            <p className='text-sm text-slate-400 mt-5 mb-3'>Result</p>
            <div className='bg-gray-100 w-full min-h-fit rounded shadow-sm p-2 overflow-auto'>
              {isLoading && <p>Loading...</p>}

              {error && <p>{error.message}</p>}
              {error && <pre> <code> {JSON.stringify(error.raw, null, 4)} </code></pre>}

              {result && <p>{result.message}</p>}
              {result && <pre> <code> {JSON.stringify(result.raw, null, 4)} </code></pre>}
            </div>
          </section>
      </main>
  )
};

export default Methods;
