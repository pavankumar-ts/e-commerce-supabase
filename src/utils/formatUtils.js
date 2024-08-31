export const formatToIndianCurrency = (number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    // Format the number
    let formatted = formatter.format(number);

    // Remove the currency symbol (₹) if present
    formatted = formatted.replace(/^₹/, '');

    // Trim any leading spaces
    formatted = formatted.trim();

    // Add the ₹ symbol at the beginning
    return `₹${formatted}`;
};

// Converts Best Seller to best-seller
export const formatLinkPath = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-')
}

// Converts best-seller to Best Seller
export const formatLinkPathReverse = (name) => {
    return name
        .replace('-', ' ')        // Replace hyphen with space
        .split(' ')               // Split into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
        .join(' ');               // Join words back into a single string
};
