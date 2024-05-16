export default (input: string, increment = 1) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const radix = alphabet.length;

    // Convert the input string to a base-26 number
    let num = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const charIndex = alphabet.indexOf(char.toLowerCase());
        if (charIndex === -1) {
            // If the character is not in the alphabet, return the original string
            return input;
        }
        num = num * radix + charIndex;
    }

    // Increment the base-26 number
    num += increment;

    // Convert the incremented number back to a string
    let result = "";
    while (num > 0) {
        const remainder = num % radix;
        result = alphabet[remainder] + result;
        num = Math.floor(num / radix);
    }

    return result || "a";
};
