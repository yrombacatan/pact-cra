import { NavLink, useLocation } from "react-router-dom";

const QueryNavLink = ({ to, ...props }) => {
    let location = useLocation();
    return <NavLink to={to + location.search} {...props} />;
}

const formatKeyset = (keysetList) => {
    const newKeyset = keysetList.reduce((current, next) => {
        let name = next.name
        let address = next.address
        let pred = next.pred

        current[name] = {
            "keys": address.split(';'),
            "pred": pred
        }

        return current
  }, {})

  return newKeyset
}

const connectWallet = async () => {
    const host = "http://localhost:9467/v1/accounts"
    const res = await fetch(host, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            asset: 'kadena'
        })
    })

    return await res.json()
}

const checkWallet = async () => {
    // check if already exist
    if(localStorage.getItem('accountAddress')) {
        return { status: 'success', data: JSON.parse(localStorage.getItem('accountAddress'))}
    } 

    // else connect and store
    try {
        const result = await connectWallet()

        if(result.status === 'success') {
            localStorage.setItem('accountAddress', JSON.stringify(result.data))
        }

        return result

    } catch (error) {
        console.log('im here utility catch')
        return {status: 'error', data: error}
    }
}

const inputTypeChecker = (val) => {
    if(typeof val === "string") {
        console.log('its a string')
        return val.toString()
    }

    if(typeof val === "number") {
        console.log('it is a number')
        return Number(val)
    }

    if(typeof val === "object") {
        console.log('it is an object')
        return JSON.parse(val)
    }
}

export { QueryNavLink, formatKeyset, connectWallet, checkWallet, inputTypeChecker }