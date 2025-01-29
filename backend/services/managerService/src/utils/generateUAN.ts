export function generateUAN() {
    // Generate a random 10-digit account number
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    // Combine prefix and account number
    const uanNumber = accountNumber

    return uanNumber;
}

// Example usage
const uan = generateUAN();

