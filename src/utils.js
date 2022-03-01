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

const formatCapabilityArgument = (args) => {
    // enable to accept dynamic data type from the args input (capability)
    // convert value depending on the prefix char

    const newArgs = args.map((value) => {
        // check if value is object
        if (value.at(0) === "{" && value.at(-1) === "}") return JSON.parse(value);

        // check if value is array
        if (value.at(0) === "[" && value.at(-1) === "]") return JSON.parse(value);

        // check if value is number
        if (Number(value)) return Number(value);

        // check if boolean
        if (value == "false") return false;
        if (value == "true") return true;

        // default string
        return value;
    });

    return newArgs;
};

export {
  QueryNavLink,
  formatKeyset,
  connectWallet,
  checkWallet,
  formatCapabilityArgument,
};