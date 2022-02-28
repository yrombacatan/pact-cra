import React from 'react'

const CapabilitiesForm = ({ capabilityList, setCapabilityList }) => {

  const handleInputChange = (e, i) => {
    const { name, value } = e.target
    const list = [...capabilityList]
    list[i][name] = value  // remove dynamic name index for radio button
    setCapabilityList(list)
  }

  const handleInputChangeArgs = (e, i, j) => {
    const { value } = e.target
    const list = [...capabilityList]
    list[i]['args'][j] = value  // remove dynamic name index for radio button
    setCapabilityList(list)
  }

  const handleAddArgs = (e, i) => {
    e.preventDefault()
    const newList = [...capabilityList]
    newList[i]['args'].push('')
    setCapabilityList(newList)
  }

  const handleRemoveArgs = (e, i) => {
    e.preventDefault()
    const newList = [...capabilityList]
    newList[i]['args'].pop()
    setCapabilityList(newList)
  }

  const handleAddCapability = (e) => {
    e.preventDefault()
    const list = [...capabilityList, {name: '', args: ['']}]
    setCapabilityList(list)
  }

  const handleRemoveCapability = (e, i) => {
    e.preventDefault()
    const list = [...capabilityList]
    list.splice(i, 1)
    setCapabilityList(list)
  }

  return (
    <>
      {capabilityList.map((capability, i) => (
          <div key={i} className="mb-5">
            <div className='flex flex-wrap gap-2 mb-2'>
              <input type="text" placeholder='Capability Name' name='name' 
              className="flex-auto p-2 rounded border focus:outline-blue-400" value={capability.name} onChange={(e) => handleInputChange(e, i)}/>
            </div>

            <div className='flex flex-wrap gap-5 items-center'>

              {capability.args.map((arg, j) => (
                  <input key={(j+100)} type="text" placeholder={`Args ${j+1}`}
                      className="flex-auto w-80 p-2 rounded border focus:outline-blue-400" value={arg} onChange={e => handleInputChangeArgs(e, i, j)} />
              ))}

            </div>

            <div>
              <button className='mt-2 text-indigo-500 text-lg mr-5' onClick={(e) => handleAddArgs(e, i)}>+</button>
              <button className='mt-2 text-red-500 text-lg' onClick={(e) => handleRemoveArgs(e, i)}>-</button>
              <button className='mt-2 text-red-500 ml-5 underline' onClick={(e) => handleRemoveCapability(e, i)}>Remove</button>
            </div>
          </div>
      ))}
      
      <div>
          <button className='text-indigo-500 my-5' onClick={(e) => handleAddCapability(e)}>Add capability</button>
      </div>
    </>
    
  )
}

export default CapabilitiesForm