const handleSubmit = () => {
    const kp = Pact.crypto.genKeyPair();
    var creationTime = () => Math.round(new Date().getTime() / 1000) - 15;

    const cmd = {
        networkId: "testnet04",
        pactCode: `(free.basic-payment.use-let)`,
        keyPairs: [
        {
            publicKey: kp.publicKey,
            secretKey: kp.secretKey,
            clist: [
            //capability to use gas station
            {
                name: `free.basic-payment-gas-station.GAS_PAYER`,
                //args are irrelevant here just need to be the right type
                args: ["hi", { int: 1 }, 1.0],
            },
            ],
        },
        ],
        //pact-lang-api function to construct transaction meta data
        meta: Pact.lang.mkMeta(
            "Admin", //sender
            "1", //chainid
            0.00010001, //gas price
            30000, // gas limit
            creationTime(), // creation
            28800 // ttl
        ),
    }

    console.log(cmd)

    const tx = await Pact.fetch.send(cmd, kadenaAPI.meta.host);
    console.log(tx)
}

