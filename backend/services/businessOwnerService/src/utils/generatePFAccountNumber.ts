export function generatePFAccountNumber() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    // Generate 5 random capital letters
    let prefix = "";
    for (let i = 0; i < 5; i++) {
        prefix += letters[Math.floor(Math.random() * letters.length)];
    }

    // Generate 17 random digits
    let suffix = "";
    for (let i = 0; i < 17; i++) {
        suffix += numbers[Math.floor(Math.random() * numbers.length)];
    }

    // Combine the letters and numbers
    return prefix + suffix;
}