export function generateESICAccountNumber() {
    let accountNumber = '';
    for (let i = 0; i < 10; i++) {
        accountNumber += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
    }
    return accountNumber;
}