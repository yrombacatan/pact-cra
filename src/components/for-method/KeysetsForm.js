import React from 'react'

const KeysetsForm = ({ keysetList, setKeysetList }) => {

  const handleInputChange = (e, i) => {
    const { name, value } = e.target
    const list = [...keysetList]
    list[i][name.split('-')[0]] = value  // remove dynamic name index for radio button
    setKeysetList(list)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const newList = [...keysetList, {name: '', address: '', pred: ''}]
    setKeysetList(newList)
  }

  const handleRemove = (i) => {
    const list = [...keysetList]
    list.splice(i, 1)
    setKeysetList(list)
  }

  return (
    <>
      <div>

        {keysetList.map((keyset, i) => {
          return(
          <div className='flex flex-wrap gap-2 mb-2' key={i}>
            <input type="text" placeholder='Keyset Name' name='name' value={keyset.name} onChange={e => handleInputChange(e, i)}
            className="flex-auto p-2 rounded border focus:outline-blue-400"/>
            <input type="text" placeholder='Keysets Address' name='address' value={keyset.address} onChange={e => handleInputChange(e, i)}
            className="flex-auto basis-1/2 border p-2 rounded focus:outline-blue-400"/>
            <div className='flex-auto flex items-center gap-5'>
              <div className='flex items-center'>
                <input type='radio' name={`pred-${i}`} id={`keys-any-${i}`} value='keys-any' onChange={e => handleInputChange(e, i)}/>
                <label htmlFor={`keys-any-${i}`}>keys-any</label>
              </div>
              <div className='flex items-center'>
                <input type='radio' name={`pred-${i}`} id={`keys-all-${i}`} value='keys-all' onChange={e => handleInputChange(e, i)} />
                <label htmlFor={`keys-all-${i}`}>keys-all</label>
              </div>
              <div className='flex items-center'>
                <input type='radio' name={`pred-${i}`} id={`keys-two-${i}`} value='keys-two' onChange={e => handleInputChange(e, i)} />
                <label htmlFor={`keys-two-${i}`}>keys-two</label>
              </div>
              <div className='flex items-center'>
                <button className='underline text-red-500' onClick={() => handleRemove(i)}>Remove</button>
              </div>
            </div>
          </div>
        )})}

      </div>
      
      <div>
          <button className='text-indigo-500 my-5' onClick={handleAdd}>Add keyset</button>
      </div>
    </>
    
  )
}

export default KeysetsForm