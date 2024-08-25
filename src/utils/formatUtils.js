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