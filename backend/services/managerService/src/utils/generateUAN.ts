export function generateUAN() {
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const uanNumber = accountNumber

    return uanNumber;
}

const uan = generateUAN();